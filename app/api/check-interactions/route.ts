import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { medicines } = await request.json()

    if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 medicines required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { analysis: 'AI analysis requires GEMINI_API_KEY to be configured. Please check your environment variables.' },
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are Lumi, an AI Pharmacist assistant. A user wants to check drug interactions between these medicines:

${medicines.map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')}

Please analyze potential drug-drug interactions and provide:
1. A brief overview of any interactions (if any)
2. Risk level for each interaction
3. Clinical significance
4. Practical recommendations for the patient

Be thorough but concise. If medicines are safe to take together, confirm this clearly.

IMPORTANT: Always remind the user to consult their healthcare provider for personalized medical advice.`

    const result = await model.generateContent(prompt)
    const analysis = result.response.text()

    return NextResponse.json({
      success: true,
      analysis: analysis,
      medicines: medicines,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Interaction check error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze interactions' },
      { status: 500 }
    )
  }
}
