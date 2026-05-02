import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';
import { createClient } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data required' },
        { status: 400 }
      );
    }

    // OCR extraction
    const { data: { text } } = await Tesseract.recognize(
      Buffer.from(imageBase64, 'base64'),
      'eng'
    );

    // AI analysis with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const analysisPrompt = `Analyze this prescription text and extract: medications (name, dosage, frequency), patient info, prescriber info, and any warnings. Return as JSON.
    
    Prescription text:
    ${text}`;

    const result = await model.generateContent(analysisPrompt);
    const analysis = result.response.text();

    return NextResponse.json({
      rawText: text,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('OCR Error:', error);
    return NextResponse.json(
      { error: 'OCR processing failed' },
      { status: 500 }
    );
  }
}
