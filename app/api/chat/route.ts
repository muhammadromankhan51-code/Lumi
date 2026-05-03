import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, medicines } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Build context from user's medicines if available
    let medicineContext = ''
    if (medicines && medicines.length > 0) {
      medicineContext = `\n\nThe user currently has the following medications:\n${medicines.map((m: { name: string; dosage: string; purpose: string }) => 
        `- ${m.name} (${m.dosage}): ${m.purpose}`
      ).join('\n')}`
    }

    const systemPrompt = `You are Lumi, a friendly and knowledgeable AI Digital Pharmacist assistant. You help users understand their medications, answer health questions, provide guidance on drug interactions, side effects, and dosage information.

Important guidelines:
- Be helpful, empathetic, and professional
- Provide accurate medication information
- Always recommend consulting a healthcare professional for serious concerns
- Use simple, easy-to-understand language
- If asked about specific medications, provide general information about their uses, common side effects, and precautions
- Never diagnose conditions or replace professional medical advice
${medicineContext}

User question: ${message}`

    const result = await model.generateContent(systemPrompt)
    const response = result.response.text()

    return NextResponse.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
