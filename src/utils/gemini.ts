import { GoogleGenAI } from '@google/genai';

export async function extractTextFromImage(base64Image: string, mimeType: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: 'Extract all the text from this image. Only return the extracted text, nothing else.',
          },
        ],
      },
    });
    return response.text || '';
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from image.');
  }
}
