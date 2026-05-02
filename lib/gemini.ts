import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function analyzePrescriptionImage(imageData: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `You are a pharmacist AI assistant. Analyze this prescription image and provide:
1. List of medications with dosages
2. Potential drug interactions
3. Risk score (0-10)
4. Important warnings
5. Simple summary for patients

Format your response as JSON.`;

  const response = await model.generateContent([
    {
      inlineData: {
        data: imageData,
        mimeType: 'image/jpeg'
      }
    },
    prompt
  ]);

  return response.response.text();
}

export async function generateMedicineAnalysis(medicineText: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `As a pharmacist AI, analyze this prescription text and provide detailed information about the medicines mentioned. Include dosages, purposes, precautions, and potential interactions. Format as JSON.`;

  const response = await model.generateContent(medicineText + '\n\n' + prompt);
  return response.response.text();
}
