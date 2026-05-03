import { NextRequest, NextResponse } from 'next/server'
import {
  calculatePediatricDose,
  calculateGeriatricDose,
  calculateRenalDose,
  calculateHepaticDose,
  getPregnancyDoseGuidance,
  getComprehensiveDoseAdjustment,
  calculateCrCl,
  type PatientProfile
} from '@/lib/dose-calculator'
import { searchPakistanDrug } from '@/lib/openfda'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      drugName,
      adultDose,
      patient,
      adjustmentType
    } = body as {
      drugName?: string
      adultDose: number
      patient: PatientProfile
      adjustmentType?: 'pediatric' | 'geriatric' | 'renal' | 'hepatic' | 'pregnancy' | 'comprehensive'
    }
    
    if (!adultDose || adultDose <= 0) {
      return NextResponse.json(
        { error: 'Valid adult dose required' },
        { status: 400 }
      )
    }
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient profile required' },
        { status: 400 }
      )
    }
    
    // Get drug info if provided
    let drugInfo = {
      renallyCleared: true,
      hepaticallyMetabolized: true,
      pregnancyCategory: 'C' as 'A' | 'B' | 'C' | 'D' | 'X'
    }
    
    if (drugName) {
      const pakistanDrug = searchPakistanDrug(drugName)
      if (pakistanDrug) {
        drugInfo = {
          renallyCleared: pakistanDrug.renalAdjustment,
          hepaticallyMetabolized: pakistanDrug.hepaticAdjustment,
          pregnancyCategory: pakistanDrug.pregnancyCategory
        }
      }
    }
    
    // Calculate CrCl if serum creatinine is provided but CrCl is not
    if (patient.creatinine && !patient.creatinineClearance) {
      patient.creatinineClearance = calculateCrCl(
        patient.age,
        patient.weight,
        patient.creatinine,
        patient.gender
      )
    }
    
    let result
    
    switch (adjustmentType) {
      case 'pediatric':
        result = calculatePediatricDose(adultDose, patient.age, patient.weight)
        break
        
      case 'geriatric':
        result = calculateGeriatricDose(adultDose, patient.age, patient.creatinineClearance)
        break
        
      case 'renal':
        if (!patient.creatinineClearance) {
          return NextResponse.json(
            { error: 'Creatinine clearance required for renal adjustment' },
            { status: 400 }
          )
        }
        result = calculateRenalDose(adultDose, patient.creatinineClearance, drugInfo.renallyCleared)
        break
        
      case 'hepatic':
        if (!patient.childPughScore) {
          return NextResponse.json(
            { error: 'Child-Pugh score required for hepatic adjustment' },
            { status: 400 }
          )
        }
        result = calculateHepaticDose(adultDose, patient.childPughScore, drugInfo.hepaticallyMetabolized)
        break
        
      case 'pregnancy':
        if (!patient.isPregnant) {
          return NextResponse.json(
            { error: 'Patient must be pregnant for pregnancy guidance' },
            { status: 400 }
          )
        }
        result = getPregnancyDoseGuidance(
          drugName || '',
          drugInfo.pregnancyCategory,
          patient.pregnancyTrimester || 1
        )
        break
        
      case 'comprehensive':
      default:
        result = getComprehensiveDoseAdjustment(adultDose, patient, drugInfo)
        break
    }
    
    return NextResponse.json({
      success: true,
      drugName,
      originalDose: `${adultDose} mg`,
      patient: {
        age: patient.age,
        weight: patient.weight,
        gender: patient.gender,
        creatinineClearance: patient.creatinineClearance,
        childPughScore: patient.childPughScore,
        isPregnant: patient.isPregnant,
        pregnancyTrimester: patient.pregnancyTrimester
      },
      adjustment: result,
      drugInfo
    })
  } catch (error) {
    console.error('[Dose Adjustment] Error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate dose adjustment' },
      { status: 500 }
    )
  }
}
