import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let imageBase64: string | null = null
    let mimeType: string = 'image/jpeg'

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
        mimeType = file.type || 'image/jpeg'
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data required' },
        { status: 400 }
      )
    }

    // Use Vercel AI Gateway (zero-config, no API key needed)
    const analysisPrompt = `You are Lumi, an AI Digital Pharmacist. Analyze this prescription image and provide a detailed analysis.

Please extract and provide:

1. **Medications Found**: List each medication with:
   - Name
   - Dosage (e.g., 500mg)
   - Frequency (e.g., twice daily, after meals)
   
2. **Purpose**: What each medication is typically used for (in simple words)

3. **Drug Interactions**: Any potential interactions between the medications listed

4. **Risk Assessment**: Overall risk level (Low/Medium/High) with explanation

5. **Important Warnings**: Any important precautions the patient should know

6. **Patient Summary**: A simple, easy-to-understand summary for the patient

If you cannot read the prescription clearly or certain parts are unclear, please mention that and provide what analysis you can based on what is visible.

Format your response in a clear, readable way with the sections above.`

    try {
      const result = await generateText({
        model: 'google/gemini-2.5-flash-preview-04-17',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: `data:${mimeType};base64,${imageBase64}`,
              },
              {
                type: 'text',
                text: analysisPrompt
              }
            ]
          }
        ]
      })

      return NextResponse.json({
        success: true,
        rawText: 'Image analyzed directly by AI',
        analysis: result.text,
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      console.error('[v0] AI analysis error:', aiError)
      return NextResponse.json({
        success: false,
        rawText: '',
        analysis: 'AI analysis failed. Please try again.',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('[v0] OCR processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process prescription. Please try again with a clearer image.' },
      { status: 500 }
    )
  }
}
