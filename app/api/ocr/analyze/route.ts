import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface ExtractedMedicine {
  name: string
  dosage: string
  frequency: string
  purpose: string
  safety: 'Safe' | 'Caution' | 'High Risk'
}

export interface PrescriptionAnalysis {
  medications: ExtractedMedicine[]
  interactions: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
  warnings: string[]
  patientSummary: string
}

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

    // Structured prompt for reliable medicine extraction
    const analysisPrompt = `You are Lumi, an AI Digital Pharmacist. Analyze this prescription image carefully.

IMPORTANT: Return your response as valid JSON only. No markdown, no code blocks, just pure JSON.

Extract ALL medications from the prescription and return this exact JSON structure:
{
  "medications": [
    {
      "name": "Medicine Name",
      "dosage": "500mg",
      "frequency": "twice daily after meals",
      "purpose": "Brief description of what it treats",
      "safety": "Safe" or "Caution" or "High Risk"
    }
  ],
  "interactions": ["List any drug-drug interactions between the medicines"],
  "riskLevel": "Low" or "Medium" or "High",
  "warnings": ["Important warnings for the patient"],
  "patientSummary": "A simple, friendly summary for the patient explaining their prescription"
}

Guidelines for safety levels:
- "Safe": Common medications with minimal side effects (paracetamol, vitamins)
- "Caution": Medications requiring monitoring or with notable side effects (antibiotics, NSAIDs)
- "High Risk": Medications with significant risks or interactions (blood thinners, opioids, certain heart medications)

If you cannot read certain parts clearly, still extract what you can and note unclear items in warnings.
Return ONLY the JSON object, nothing else.`

    try {
      // Use Groq with vision model for prescription analysis
      const result = await generateText({
        model: groq('llama-3.2-90b-vision-preview'),
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

      // Try to parse structured JSON response
      let structuredData: PrescriptionAnalysis | null = null
      try {
        // Clean the response - remove any markdown code blocks if present
        let cleanedText = result.text.trim()
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.slice(7)
        }
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.slice(3)
        }
        if (cleanedText.endsWith('```')) {
          cleanedText = cleanedText.slice(0, -3)
        }
        structuredData = JSON.parse(cleanedText.trim())
      } catch {
        console.log('[v0] Could not parse structured response, using raw text')
      }

      // Create human-readable analysis from structured data
      let humanReadableAnalysis = ''
      if (structuredData) {
        humanReadableAnalysis = `## Prescription Analysis\n\n`
        humanReadableAnalysis += `### Medications Found\n`
        structuredData.medications.forEach((med, i) => {
          humanReadableAnalysis += `${i + 1}. **${med.name}** (${med.dosage})\n`
          humanReadableAnalysis += `   - Take: ${med.frequency}\n`
          humanReadableAnalysis += `   - Purpose: ${med.purpose}\n`
          humanReadableAnalysis += `   - Safety: ${med.safety}\n\n`
        })
        
        if (structuredData.interactions.length > 0) {
          humanReadableAnalysis += `### Drug Interactions\n`
          structuredData.interactions.forEach(interaction => {
            humanReadableAnalysis += `- ${interaction}\n`
          })
          humanReadableAnalysis += '\n'
        }
        
        humanReadableAnalysis += `### Risk Level: ${structuredData.riskLevel}\n\n`
        
        if (structuredData.warnings.length > 0) {
          humanReadableAnalysis += `### Warnings\n`
          structuredData.warnings.forEach(warning => {
            humanReadableAnalysis += `- ${warning}\n`
          })
          humanReadableAnalysis += '\n'
        }
        
        humanReadableAnalysis += `### Patient Summary\n${structuredData.patientSummary}`
      } else {
        humanReadableAnalysis = result.text
      }

      return NextResponse.json({
        success: true,
        rawText: 'Image analyzed directly by AI',
        analysis: humanReadableAnalysis,
        structuredData: structuredData,
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      console.error('[v0] AI analysis error:', aiError)
      const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown error'
      
      return NextResponse.json({
        success: false,
        rawText: '',
        analysis: `AI analysis failed: ${errorMessage}. Please try again.`,
        structuredData: null,
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
