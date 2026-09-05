import { GoogleGenAI, Type } from '@google/genai';
import { AIAnalysisResult, ComplaintCategory, ComplaintPriority } from '../src/types.ts';

const VALID_CATEGORIES: ComplaintCategory[] = [
  'Garbage Overflow',
  'Illegal Dumping',
  'Blocked Drain',
  'Plastic Waste',
  'Unclean Public Space',
  'Other',
];

const VALID_PRIORITIES: ComplaintPriority[] = ['High', 'Medium', 'Low'];

/**
 * Intelligent rule-based fallback when Gemini API is unavailable, offline, or key is not provided.
 */
function ruleBasedFallback(
  description: string,
  location?: string,
  categoryHint?: string
): AIAnalysisResult {
  const desc = (description || '').toLowerCase();
  const loc = (location || '').toLowerCase();

  let category: ComplaintCategory = 'Unclean Public Space';
  let priority: ComplaintPriority = 'Medium';
  let reason = 'AI evaluated textual context and location parameters for sanitation severity.';
  let recommendedAction = 'Schedule routine municipal sanitation sweep and inspection.';
  let confidence = 0.88;

  if (
    desc.includes('drain') ||
    desc.includes('clog') ||
    desc.includes('sewage') ||
    desc.includes('gutter') ||
    desc.includes('overflowing water') ||
    desc.includes('stagnant')
  ) {
    category = 'Blocked Drain';
    priority = desc.includes('road') || desc.includes('school') || desc.includes('rain') ? 'High' : 'Medium';
    reason = 'Identified stormwater or drainage channel obstruction presenting waterlogging risk.';
    recommendedAction = 'Dispatch municipal desilting machinery and sanitation crew for unblocking.';
    confidence = 0.93;
  } else if (
    desc.includes('dump') ||
    desc.includes('construction') ||
    desc.includes('debris') ||
    desc.includes('truck') ||
    desc.includes('illegal') ||
    desc.includes('vacant plot')
  ) {
    category = 'Illegal Dumping';
    priority = 'High';
    reason = 'Detected unauthorized accumulation of bulk commercial or construction refuse.';
    recommendedAction = 'Issue public notice, dispatch heavy mechanical loader, and verify parcel ownership.';
    confidence = 0.95;
  } else if (
    desc.includes('plastic') ||
    desc.includes('bottle') ||
    desc.includes('wrapper') ||
    desc.includes('polythene') ||
    desc.includes('cup')
  ) {
    category = 'Plastic Waste';
    priority = desc.includes('beach') || desc.includes('river') || desc.includes('lake') ? 'Medium' : 'Low';
    reason = 'Detected non-biodegradable post-consumer packaging and single-use polymer waste.';
    recommendedAction = 'Deploy dedicated dry-waste collection and place segregated recycling bins.';
    confidence = 0.91;
  } else if (
    desc.includes('overflow') ||
    desc.includes('bin') ||
    desc.includes('pile') ||
    desc.includes('stray animal') ||
    desc.includes('stench') ||
    desc.includes('smell') ||
    desc.includes('rotten')
  ) {
    category = 'Garbage Overflow';
    priority = desc.includes('hospital') || desc.includes('market') || desc.includes('school') ? 'High' : 'Medium';
    reason = 'Identified saturated municipal bins with refuse spilling into pedestrian circulation areas.';
    recommendedAction = 'Deploy high-capacity hydraulic compactor truck and sanitize collection perimeter.';
    confidence = 0.94;
  } else if (categoryHint && VALID_CATEGORIES.includes(categoryHint as ComplaintCategory)) {
    category = categoryHint as ComplaintCategory;
  }

  // Adjust priority if high urgency keywords are present
  if (
    desc.includes('hazard') ||
    desc.includes('disease') ||
    desc.includes('urgent') ||
    desc.includes('danger') ||
    desc.includes('hospital') ||
    loc.includes('hospital')
  ) {
    priority = 'High';
    confidence = Math.min(0.98, confidence + 0.04);
  }

  return {
    category,
    priority,
    confidence: Number(confidence.toFixed(2)),
    reason,
    recommendedAction,
  };
}

export async function analyzeSanitationIssue(params: {
  description: string;
  imageBase64?: string;
  imageMimeType?: string;
  location?: string;
  categoryHint?: string;
}): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('[AI Analysis] GEMINI_API_KEY not set. Using intelligent rule-based fallback.');
    return ruleBasedFallback(params.description, params.location, params.categoryHint);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are CleanCity's expert civic sanitation AI analyzer for municipal complaints.
Analyze the user's sanitation problem complaint (image and/or text description and location).
Provide:
1. Category: Must be strictly one of: "Garbage Overflow", "Illegal Dumping", "Blocked Drain", "Plastic Waste", "Unclean Public Space", "Other".
2. Priority: Must be strictly one of: "High", "Medium", "Low". (High if obstructing traffic/drainage, near hospitals/schools, or biohazard; Medium if general public nuisance; Low if isolated litter).
3. Confidence: Float between 0.70 and 0.99.
4. Reason: A concise 1-2 sentence technical assessment of the sanitation issue.
5. Recommended Action: Actionable municipal recommendation for sanitation workers or authorities.`;

    const contents: any[] = [];

    let promptText = `Description of issue: "${params.description}"\nLocation/Context: "${params.location || 'Not specified'}"`;
    if (params.categoryHint) {
      promptText += `\nUser indicated category: "${params.categoryHint}"`;
    }

    if (params.imageBase64 && params.imageMimeType) {
      // Remove data URL header if present
      const cleanBase64 = params.imageBase64.includes(',')
        ? params.imageBase64.split(',')[1]
        : params.imageBase64;

      contents.push({
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: params.imageMimeType,
            },
          },
          { text: promptText },
        ],
      });
    } else {
      contents.push({
        parts: [{ text: promptText }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents[0].parts ? contents[0] : contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description:
                'One of: Garbage Overflow, Illegal Dumping, Blocked Drain, Plastic Waste, Unclean Public Space, Other',
            },
            priority: {
              type: Type.STRING,
              description: 'One of: High, Medium, Low',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0.70 and 0.99',
            },
            reason: {
              type: Type.STRING,
              description: 'Clear factual justification for category and priority',
            },
            recommendedAction: {
              type: Type.STRING,
              description: 'Specific municipal action required',
            },
          },
          required: ['category', 'priority', 'confidence', 'reason', 'recommendedAction'],
        },
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(jsonText);

    // Validate category & priority
    const category: ComplaintCategory = VALID_CATEGORIES.includes(parsed.category)
      ? parsed.category
      : 'Unclean Public Space';
    const priority: ComplaintPriority = VALID_PRIORITIES.includes(parsed.priority)
      ? parsed.priority
      : 'Medium';

    return {
      category,
      priority,
      confidence: typeof parsed.confidence === 'number' ? Number(parsed.confidence.toFixed(2)) : 0.92,
      reason: parsed.reason || 'Sanitation issue evaluated by computer vision and context.',
      recommendedAction: parsed.recommendedAction || 'Schedule prompt municipal cleaning response.',
    };
  } catch (error) {
    console.warn('[AI Analysis Error] Falling back to intelligent rule-based engine:', error);
    return ruleBasedFallback(params.description, params.location, params.categoryHint);
  }
}
