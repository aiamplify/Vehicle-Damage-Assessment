import type { DamageReport } from '../types';

export async function analyzeDamageImage(imageUrl: string, apiKey: string): Promise<DamageReport> {
  try {
    // Format the base64 URL to meet OpenAI's requirements
    const formattedImageUrl = imageUrl.startsWith('data:') 
      ? imageUrl 
      : `data:image/jpeg;base64,${imageUrl}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a vehicle damage assessment expert. Always respond with valid JSON only, no additional text or explanations.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this vehicle image and return a JSON object with this exact structure, no additional text: { "damageLocations": [{ "area": string, "description": string, "severity": "Minor" | "Moderate" | "Severe" }], "severity": "Minor" | "Moderate" | "Severe", "estimatedCost": number, "recommendations": string[] }'
              },
              {
                type: 'image_url',
                image_url: {
                  url: formattedImageUrl
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze image');
    }

    const data = await response.json();
    const assessment = JSON.parse(data.choices[0].message.content);

    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      images: [imageUrl],
      ...assessment
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Image analysis failed: ${error.message}`);
    }
    throw new Error('Image analysis failed');
  }
}