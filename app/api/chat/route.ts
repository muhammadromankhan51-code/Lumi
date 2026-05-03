import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, medicines, imageBase64, mimeType } = body

    if (!message && !imageBase64) {
      return NextResponse.json(
        { error: 'Message or image is required' },
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

    // Build message content - supports both text and images
    const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = []
    
    if (imageBase64) {
      userContent.push({
        type: 'image',
        image: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`,
      })
    }
    
    if (message) {
      userContent.push({
        type: 'text',
        text: message,
      })
    }

    // Use Vercel AI Gateway (zero-config, no API key needed)
    const result = await generateText({
      model: 'google/gemini-2.5-flash-preview-04-17',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userContent,
        }
      ]
    })

    return NextResponse.json({
      success: true,
      response: result.text,
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
