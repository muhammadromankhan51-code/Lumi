import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

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
${medicineContext}`

    // Use Groq for fast inference
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: message,
    })

    return NextResponse.json({
      success: true,
      response: result.text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { error: `Failed to process your message: ${errorMessage}` },
      { status: 500 }
    )
  }
}
