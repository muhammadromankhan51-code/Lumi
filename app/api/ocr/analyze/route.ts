import { NextRequest, NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let imageBase64: string | null = null

    // Handle both JSON and FormData
    if (contentType.includes('application/json')) {
      const body = await request.json()
      imageBase64 = body.imageBase64
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File
      if (file) {
        const arrayBuffer = await file.arrayBuffer()
        imageBase64 = Buffer.from(arrayBuffer).toString('base64')
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data required' },
        { status: 400 }
      )
    }

    // OCR extraction using Tesseract
    let extractedText = ''
    try {
      const imageBuffer = Buffer.from(imageBase64, 'base64')
      const { data: { text } } = await Tesseract.recognize(
        imageBuffer,
        'eng',
        {
          logger: () => {} // Suppress logs
        }
      )
      extractedText = text.trim()
    } catch (ocrError) {
      console.error('[v0] OCR error:', ocrError)
      extractedText = 'Could not extract text from image'
    }

    // AI analysis with Gemini
    const apiKey = process.env.GEMINI_API_KEY
    let analysis = null

    if (apiKey && extractedText && extractedText !== 'Could not extract text from image') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const analysisPrompt = `You are Lumi, an AI Pharmacist. Analyze this prescription text extracted via OCR and provide:

1. **Medications Found**: List each medication with name, dosage, and frequency
2. **Purpose**: What each medication is typically used for
3. **Drug Interactions**: Any potential interactions between the medications
4. **Risk Assessment**: Low/Medium/High risk with explanation
5. **Warnings**: Any important precautions
6. **Patient Summary**: Simple explanation for the patient

Prescription text:
${extractedText}

If the text is unclear or incomplete, mention that and provide what analysis you can.`

        const result = await model.generateContent(analysisPrompt)
        analysis = result.response.text()
      } catch (aiError) {
        console.error('[v0] AI analysis error:', aiError)
        analysis = 'AI analysis unavailable. Please review the extracted text manually.'
      }
    } else if (!apiKey) {
      analysis = 'AI analysis requires GEMINI_API_KEY to be configured.'
    }

    return NextResponse.json({
      success: true,
      rawText: extractedText,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] OCR processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process prescription. Please try again with a clearer image.' },
      { status: 500 }
    )
  }
}
