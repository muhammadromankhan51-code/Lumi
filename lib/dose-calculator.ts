/**
 * Dose Adjustment Calculator
 * Formulas for pediatric, geriatric, pregnancy, renal, and hepatic adjustments
 */

export interface PatientProfile {
  age: number // years
  weight: number // kg
  height?: number // cm
  gender: 'male' | 'female'
  isPregnant?: boolean
  pregnancyTrimester?: 1 | 2 | 3
  isNursing?: boolean
  creatinine?: number // mg/dL (serum creatinine)
  creatinineClearance?: number // mL/min
  childPughScore?: 'A' | 'B' | 'C' // Liver function
  bsa?: number // Body Surface Area m²
}

export interface DoseRecommendation {
  adjustedDose: string
  adjustmentPercentage: number
  reason: string
  warnings: string[]
  formula: string
  calculations?: Record<string, number>
}

// Calculate Body Surface Area (BSA) using Mosteller formula
export function calculateBSA(weight: number, height: number): number {
  return Math.sqrt((weight * height) / 3600)
}

// Calculate Creatinine Clearance using Cockcroft-Gault formula
export function calculateCrCl(
  age: number,
  weight: number,
  creatinine: number,
  gender: 'male' | 'female'
): number {
  let crcl = ((140 - age) * weight) / (72 * creatinine)
  if (gender === 'female') {
    crcl *= 0.85
  }
  return Math.round(crcl)
}

// Pediatric dose calculation using various methods
export function calculatePediatricDose(
  adultDose: number,
  childAge: number,
  childWeight: number,
  method: 'weight' | 'bsa' | 'young' | 'clark' | 'fried' = 'weight'
): DoseRecommendation {
  let adjustedDose: number
  let formula: string
  const warnings: string[] = []
  
  if (childAge < 0.083) { // Less than 1 month
    warnings.push('Neonatal dosing requires specialist consultation')
  }
  
  switch (method) {
    case 'weight':
      // Standard mg/kg dosing
      adjustedDose = adultDose * (childWeight / 70) // Assuming 70kg adult
      formula = `Dose = Adult Dose × (Child Weight / 70kg)`
      break
      
    case 'bsa':
      // BSA method - most accurate for chemotherapy
      const childBSA = Math.sqrt((childWeight * 100) / 3600) // Estimate height as 100cm base
      const adultBSA = 1.73 // Standard adult BSA
      adjustedDose = adultDose * (childBSA / adultBSA)
      formula = `Dose = Adult Dose × (Child BSA / 1.73 m²)`
      break
      
    case 'young':
      // Young's Rule (for children 1-12 years)
      adjustedDose = (adultDose * childAge) / (childAge + 12)
      formula = `Young's Rule: Dose = Adult Dose × Age / (Age + 12)`
      if (childAge < 1 || childAge > 12) {
        warnings.push('Young\'s Rule is most accurate for ages 1-12 years')
      }
      break
      
    case 'clark':
      // Clark's Rule (weight-based)
      adjustedDose = (adultDose * childWeight) / 68 // 68kg = 150lbs
      formula = `Clark's Rule: Dose = Adult Dose × Weight(kg) / 68`
      break
      
    case 'fried':
      // Fried's Rule (for infants < 1 year)
      adjustedDose = (adultDose * childAge * 12) / 150 // Age in months
      formula = `Fried's Rule: Dose = Adult Dose × Age(months) / 150`
      if (childAge >= 1) {
        warnings.push('Fried\'s Rule is designed for infants under 1 year')
      }
      break
      
    default:
      adjustedDose = adultDose * (childWeight / 70)
      formula = `Weight-based: Dose = Adult Dose × (Weight / 70kg)`
  }
  
  const adjustmentPercentage = Math.round((adjustedDose / adultDose) * 100)
  
  warnings.push('Always verify pediatric doses with a pharmacist or pediatrician')
  
  return {
    adjustedDose: `${adjustedDose.toFixed(2)} mg`,
    adjustmentPercentage,
    reason: `Pediatric dose adjustment for ${childAge} year old, ${childWeight}kg`,
    warnings,
    formula,
    calculations: {
      originalDose: adultDose,
      adjustedDose,
      childAge,
      childWeight
    }
  }
}

// Geriatric dose adjustment
export function calculateGeriatricDose(
  adultDose: number,
  age: number,
  creatinineClearance?: number
): DoseRecommendation {
  const warnings: string[] = []
  let adjustmentFactor = 1
  let reason = 'Geriatric dose adjustment'
  
  // Age-based reduction
  if (age >= 80) {
    adjustmentFactor *= 0.5 // 50% reduction for >80
    reason = 'Age > 80 years - significant dose reduction recommended'
  } else if (age >= 75) {
    adjustmentFactor *= 0.6 // 40% reduction
    reason = 'Age 75-80 years - moderate dose reduction recommended'
  } else if (age >= 65) {
    adjustmentFactor *= 0.75 // 25% reduction
    reason = 'Age 65-74 years - mild dose reduction recommended'
  }
  
  // Renal function adjustment (common in elderly)
  if (creatinineClearance !== undefined) {
    if (creatinineClearance < 30) {
      adjustmentFactor *= 0.5
      warnings.push('Severe renal impairment (CrCl < 30) - additional dose reduction')
    } else if (creatinineClearance < 60) {
      adjustmentFactor *= 0.75
      warnings.push('Moderate renal impairment (CrCl 30-59) - dose reduction applied')
    }
  }
  
  const adjustedDose = adultDose * adjustmentFactor
  
  warnings.push('Start low, go slow in elderly patients')
  warnings.push('Monitor for adverse effects more frequently')
  warnings.push('Consider polypharmacy and drug interactions')
  
  return {
    adjustedDose: `${adjustedDose.toFixed(2)} mg`,
    adjustmentPercentage: Math.round(adjustmentFactor * 100),
    reason,
    warnings,
    formula: `Geriatric Dose = Adult Dose × ${adjustmentFactor.toFixed(2)}`,
    calculations: {
      originalDose: adultDose,
      adjustedDose,
      adjustmentFactor,
      age,
      creatinineClearance: creatinineClearance || 0
    }
  }
}

// Renal dose adjustment based on CrCl
export function calculateRenalDose(
  adultDose: number,
  creatinineClearance: number,
  drugRenallyCleared: boolean = true
): DoseRecommendation {
  const warnings: string[] = []
  let adjustmentFactor = 1
  let reason: string
  
  if (!drugRenallyCleared) {
    return {
      adjustedDose: `${adultDose} mg`,
      adjustmentPercentage: 100,
      reason: 'No renal adjustment needed - drug not primarily renally cleared',
      warnings: ['Monitor renal function during treatment'],
      formula: 'No adjustment formula applied',
    }
  }
  
  if (creatinineClearance >= 90) {
    adjustmentFactor = 1
    reason = 'Normal renal function - no adjustment needed'
  } else if (creatinineClearance >= 60) {
    adjustmentFactor = 1
    reason = 'Mild renal impairment (CrCl 60-89) - usually no adjustment'
    warnings.push('Monitor for accumulation')
  } else if (creatinineClearance >= 30) {
    adjustmentFactor = 0.75
    reason = 'Moderate renal impairment (CrCl 30-59)'
    warnings.push('Reduce dose by 25% or extend dosing interval')
  } else if (creatinineClearance >= 15) {
    adjustmentFactor = 0.5
    reason = 'Severe renal impairment (CrCl 15-29)'
    warnings.push('Reduce dose by 50% or significantly extend dosing interval')
  } else {
    adjustmentFactor = 0.25
    reason = 'End-stage renal disease (CrCl < 15)'
    warnings.push('Major dose reduction required')
    warnings.push('Consider dialysis supplementation if applicable')
  }
  
  const adjustedDose = adultDose * adjustmentFactor
  
  return {
    adjustedDose: `${adjustedDose.toFixed(2)} mg`,
    adjustmentPercentage: Math.round(adjustmentFactor * 100),
    reason,
    warnings,
    formula: `Renal Adjusted Dose = Adult Dose × ${adjustmentFactor}`,
    calculations: {
      originalDose: adultDose,
      adjustedDose,
      creatinineClearance,
      adjustmentFactor
    }
  }
}

// Hepatic dose adjustment based on Child-Pugh score
export function calculateHepaticDose(
  adultDose: number,
  childPughScore: 'A' | 'B' | 'C',
  drugHepaticallyMetabolized: boolean = true
): DoseRecommendation {
  const warnings: string[] = []
  let adjustmentFactor = 1
  let reason: string
  
  if (!drugHepaticallyMetabolized) {
    return {
      adjustedDose: `${adultDose} mg`,
      adjustmentPercentage: 100,
      reason: 'No hepatic adjustment needed - drug not primarily hepatically metabolized',
      warnings: ['Monitor liver function during treatment'],
      formula: 'No adjustment formula applied',
    }
  }
  
  switch (childPughScore) {
    case 'A':
      adjustmentFactor = 0.85
      reason = 'Child-Pugh A (mild hepatic impairment)'
      warnings.push('Consider 15% dose reduction')
      break
    case 'B':
      adjustmentFactor = 0.5
      reason = 'Child-Pugh B (moderate hepatic impairment)'
      warnings.push('Reduce dose by 50%')
      warnings.push('Monitor for drug accumulation')
      break
    case 'C':
      adjustmentFactor = 0.25
      reason = 'Child-Pugh C (severe hepatic impairment)'
      warnings.push('Major dose reduction required (75%)')
      warnings.push('Consider alternative therapy if available')
      warnings.push('Close monitoring essential')
      break
  }
  
  const adjustedDose = adultDose * adjustmentFactor
  
  return {
    adjustedDose: `${adjustedDose.toFixed(2)} mg`,
    adjustmentPercentage: Math.round(adjustmentFactor * 100),
    reason,
    warnings,
    formula: `Hepatic Adjusted Dose = Adult Dose × ${adjustmentFactor}`,
    calculations: {
      originalDose: adultDose,
      adjustedDose,
      childPughScore,
      adjustmentFactor
    }
  }
}

// Pregnancy dose considerations
export function getPregnancyDoseGuidance(
  drugName: string,
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X',
  trimester: 1 | 2 | 3
): DoseRecommendation {
  const warnings: string[] = []
  let reason: string
  let recommendation: string
  
  switch (pregnancyCategory) {
    case 'A':
      reason = 'Category A - Adequate studies show no risk'
      recommendation = 'Generally safe for use during pregnancy'
      break
    case 'B':
      reason = 'Category B - Animal studies show no risk; human data limited'
      recommendation = 'Generally considered safe if clinically needed'
      warnings.push('Use only if clearly needed')
      break
    case 'C':
      reason = 'Category C - Risk cannot be ruled out'
      recommendation = 'Use only if benefit justifies potential risk'
      warnings.push('Discuss risks and benefits with prescriber')
      warnings.push('Consider alternatives if available')
      break
    case 'D':
      reason = 'Category D - Positive evidence of risk'
      recommendation = 'AVOID unless no alternatives exist'
      warnings.push('SIGNIFICANT RISK to fetus')
      warnings.push('Use only in life-threatening situations')
      break
    case 'X':
      reason = 'Category X - Contraindicated in pregnancy'
      recommendation = 'DO NOT USE - Contraindicated'
      warnings.push('CONTRAINDICATED - Risk clearly outweighs any benefit')
      warnings.push('Must use effective contraception during treatment')
      break
  }
  
  // Trimester-specific warnings
  if (trimester === 1) {
    warnings.push('First trimester: highest risk for teratogenic effects')
  } else if (trimester === 3) {
    warnings.push('Third trimester: consider effects on labor and neonate')
  }
  
  return {
    adjustedDose: pregnancyCategory === 'X' ? 'DO NOT USE' : 'Consult specialist',
    adjustmentPercentage: pregnancyCategory === 'X' ? 0 : 100,
    reason,
    warnings,
    formula: `Pregnancy Category ${pregnancyCategory} - Trimester ${trimester}`,
    calculations: {
      pregnancyCategory: pregnancyCategory.charCodeAt(0),
      trimester
    }
  }
}

// Comprehensive dose adjustment based on patient profile
export function getComprehensiveDoseAdjustment(
  adultDose: number,
  patient: PatientProfile,
  drugInfo: {
    renallyCleared: boolean
    hepaticallyMetabolized: boolean
    pregnancyCategory?: 'A' | 'B' | 'C' | 'D' | 'X'
  }
): DoseRecommendation {
  const warnings: string[] = []
  let finalAdjustmentFactor = 1
  const reasons: string[] = []
  
  // Pediatric
  if (patient.age < 18) {
    const pediatricResult = calculatePediatricDose(adultDose, patient.age, patient.weight)
    finalAdjustmentFactor *= pediatricResult.adjustmentPercentage / 100
    reasons.push(`Pediatric: ${pediatricResult.reason}`)
    warnings.push(...pediatricResult.warnings)
  }
  
  // Geriatric
  if (patient.age >= 65) {
    const geriatricResult = calculateGeriatricDose(adultDose, patient.age, patient.creatinineClearance)
    finalAdjustmentFactor *= geriatricResult.adjustmentPercentage / 100
    reasons.push(`Geriatric: ${geriatricResult.reason}`)
    warnings.push(...geriatricResult.warnings)
  }
  
  // Renal adjustment (if not already factored in geriatric)
  if (patient.creatinineClearance !== undefined && patient.age < 65) {
    const renalResult = calculateRenalDose(adultDose, patient.creatinineClearance, drugInfo.renallyCleared)
    if (renalResult.adjustmentPercentage < 100) {
      finalAdjustmentFactor *= renalResult.adjustmentPercentage / 100
      reasons.push(`Renal: ${renalResult.reason}`)
      warnings.push(...renalResult.warnings)
    }
  }
  
  // Hepatic adjustment
  if (patient.childPughScore) {
    const hepaticResult = calculateHepaticDose(adultDose, patient.childPughScore, drugInfo.hepaticallyMetabolized)
    if (hepaticResult.adjustmentPercentage < 100) {
      finalAdjustmentFactor *= hepaticResult.adjustmentPercentage / 100
      reasons.push(`Hepatic: ${hepaticResult.reason}`)
      warnings.push(...hepaticResult.warnings)
    }
  }
  
  // Pregnancy
  if (patient.isPregnant && drugInfo.pregnancyCategory) {
    const pregnancyResult = getPregnancyDoseGuidance(
      '',
      drugInfo.pregnancyCategory,
      patient.pregnancyTrimester || 1
    )
    warnings.push(...pregnancyResult.warnings)
    if (drugInfo.pregnancyCategory === 'X') {
      return pregnancyResult
    }
  }
  
  // Nursing
  if (patient.isNursing) {
    warnings.push('Breastfeeding: Check drug excretion in breast milk')
  }
  
  const adjustedDose = adultDose * finalAdjustmentFactor
  
  return {
    adjustedDose: `${adjustedDose.toFixed(2)} mg`,
    adjustmentPercentage: Math.round(finalAdjustmentFactor * 100),
    reason: reasons.join('; ') || 'No adjustment needed',
    warnings: [...new Set(warnings)], // Remove duplicates
    formula: `Final Dose = ${adultDose} mg × ${finalAdjustmentFactor.toFixed(3)} = ${adjustedDose.toFixed(2)} mg`,
    calculations: {
      originalDose: adultDose,
      adjustedDose,
      adjustmentFactor: finalAdjustmentFactor
    }
  }
}
