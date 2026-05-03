import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text input required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are Lumi, an AI Pharmacist assistant. A user has described their prescription or medication through voice input:

"${text}"

Please analyze this and provide:
1. Identified medications (name, dosage if mentioned)
2. Purpose of each medication
3. Any potential drug interactions or warnings
4. A simple patient-friendly summary
5. Recommended schedule if applicable

Format your response as a clear, helpful explanation. Be conversational but professional.`

    const result = await model.generateContent(prompt)
    const analysis = result.response.text()

    return NextResponse.json({
      rawText: text,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Voice analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze voice input' },
      { status: 500 }
    )
  }
}
