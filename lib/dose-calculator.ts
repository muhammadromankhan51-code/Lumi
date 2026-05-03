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

// Maximum safe doses for common medications
const MAX_SAFE_DOSES: Record<string, { 
  general: number, 
  pregnancy: number | null, // null means contraindicated
  pediatric: number,
  geriatric: number,
  renalImpaired: number,
  unit: string 
}> = {
  'aspirin': { general: 4000, pregnancy: null, pediatric: 60, geriatric: 2000, renalImpaired: 2000, unit: 'mg/day' },
  'acetylsalicylic acid': { general: 4000, pregnancy: null, pediatric: 60, geriatric: 2000, renalImpaired: 2000, unit: 'mg/day' },
  'paracetamol': { general: 4000, pregnancy: 3000, pediatric: 75, geriatric: 3000, renalImpaired: 2000, unit: 'mg/day' },
  'acetaminophen': { general: 4000, pregnancy: 3000, pediatric: 75, geriatric: 3000, renalImpaired: 2000, unit: 'mg/day' },
  'ibuprofen': { general: 3200, pregnancy: null, pediatric: 40, geriatric: 1200, renalImpaired: 1200, unit: 'mg/day' },
  'metformin': { general: 2550, pregnancy: 2000, pediatric: 2000, geriatric: 1700, renalImpaired: 1000, unit: 'mg/day' },
  'amoxicillin': { general: 3000, pregnancy: 3000, pediatric: 90, geriatric: 3000, renalImpaired: 1500, unit: 'mg/day' },
  'ciprofloxacin': { general: 1500, pregnancy: null, pediatric: 30, geriatric: 1000, renalImpaired: 500, unit: 'mg/day' },
}

// Validate dose against maximum safe limits
function validateDoseAgainstLimits(
  drugName: string,
  calculatedDose: number,
  isPregnant: boolean,
  isPediatric: boolean,
  isGeriatric: boolean,
  hasRenalImpairment: boolean,
  weight?: number
): { dose: number; warnings: string[]; isContraindicated: boolean } {
  const normalizedName = drugName.toLowerCase().trim()
  const limits = MAX_SAFE_DOSES[normalizedName]
  const warnings: string[] = []
  
  if (!limits) {
    return { dose: calculatedDose, warnings: [], isContraindicated: false }
  }
  
  // Check pregnancy contraindication
  if (isPregnant && limits.pregnancy === null) {
    return {
      dose: 0,
      warnings: [`${drugName} is CONTRAINDICATED in pregnancy - DO NOT USE`],
      isContraindicated: true
    }
  }
  
  // Get applicable limit based on patient factors
  let applicableLimit = limits.general
  
  if (isPregnant && limits.pregnancy !== null) {
    applicableLimit = Math.min(applicableLimit, limits.pregnancy)
    warnings.push(`Pregnancy limit: max ${limits.pregnancy}${limits.unit}`)
  }
  
  if (isPediatric && weight) {
    // Pediatric limits are per kg
    applicableLimit = Math.min(applicableLimit, limits.pediatric * weight)
    warnings.push(`Pediatric limit: max ${limits.pediatric}mg/kg/day`)
  }
  
  if (isGeriatric) {
    applicableLimit = Math.min(applicableLimit, limits.geriatric)
    warnings.push(`Geriatric limit: max ${limits.geriatric}${limits.unit}`)
  }
  
  if (hasRenalImpairment) {
    applicableLimit = Math.min(applicableLimit, limits.renalImpaired)
    warnings.push(`Renal impairment limit: max ${limits.renalImpaired}${limits.unit}`)
  }
  
  // Cap the dose at the applicable limit
  if (calculatedDose > applicableLimit) {
    warnings.push(`Dose reduced from ${calculatedDose}mg to ${applicableLimit}mg (max safe dose)`)
    return { dose: applicableLimit, warnings, isContraindicated: false }
  }
  
  return { dose: calculatedDose, warnings, isContraindicated: false }
}

// Pregnancy dose considerations
export function getPregnancyDoseGuidance(
  drugName: string,
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X',
  trimester: 1 | 2 | 3
): DoseRecommendation {
  const warnings: string[] = []
  let reason: string
  
  // Check specific drug contraindications first
  const normalizedName = drugName.toLowerCase().trim()
  const limits = MAX_SAFE_DOSES[normalizedName]
  
  if (limits && limits.pregnancy === null) {
    return {
      adjustedDose: 'DO NOT USE',
      adjustmentPercentage: 0,
      reason: `${drugName} is CONTRAINDICATED in pregnancy`,
      warnings: [
        'This medication is NOT SAFE for use during pregnancy',
        'Consult your doctor for a safer alternative immediately',
        'If you have taken this medication, contact your healthcare provider'
      ],
      formula: 'CONTRAINDICATED - No safe dose exists',
      calculations: {
        pregnancyCategory: pregnancyCategory.charCodeAt(0),
        trimester,
        maxSafeDose: 0
      }
    }
  }
  
  switch (pregnancyCategory) {
    case 'A':
      reason = 'Category A - Adequate studies show no risk'
      warnings.push('Generally safe for use during pregnancy')
      break
    case 'B':
      reason = 'Category B - Animal studies show no risk; human data limited'
      warnings.push('Generally considered safe if clinically needed')
      warnings.push('Use only if clearly needed')
      break
    case 'C':
      reason = 'Category C - Risk cannot be ruled out'
      warnings.push('Use only if benefit clearly justifies potential risk')
      warnings.push('Discuss risks and benefits with prescriber')
      warnings.push('Consider safer alternatives if available')
      break
    case 'D':
      reason = 'Category D - Positive evidence of fetal risk'
      warnings.push('AVOID - Significant risk to fetus documented')
      warnings.push('Use ONLY in life-threatening situations where no alternatives exist')
      warnings.push('Requires specialist consultation before use')
      return {
        adjustedDose: 'AVOID - Consult specialist',
        adjustmentPercentage: 0,
        reason,
        warnings,
        formula: `Pregnancy Category D - High Risk`,
        calculations: {
          pregnancyCategory: pregnancyCategory.charCodeAt(0),
          trimester
        }
      }
    case 'X':
      reason = 'Category X - Contraindicated in pregnancy'
      return {
        adjustedDose: 'DO NOT USE',
        adjustmentPercentage: 0,
        reason,
        warnings: [
          'CONTRAINDICATED - Risk clearly outweighs any benefit',
          'Can cause birth defects or fetal death',
          'Must use effective contraception during treatment',
          'If pregnant, stop immediately and contact doctor'
        ],
        formula: 'CONTRAINDICATED - Pregnancy Category X',
        calculations: {
          pregnancyCategory: pregnancyCategory.charCodeAt(0),
          trimester
        }
      }
  }
  
  // Trimester-specific warnings
  if (trimester === 1) {
    warnings.push('First trimester: highest risk for birth defects')
  } else if (trimester === 3) {
    warnings.push('Third trimester: consider effects on labor and newborn')
    // NSAIDs are particularly dangerous in 3rd trimester
    if (normalizedName.includes('ibuprofen') || normalizedName.includes('aspirin') || normalizedName.includes('naproxen')) {
      warnings.push('NSAIDs in 3rd trimester can cause premature closure of fetal heart duct')
    }
  }
  
  return {
    adjustedDose: limits?.pregnancy ? `Max ${limits.pregnancy}${limits.unit}` : 'Consult specialist',
    adjustmentPercentage: limits?.pregnancy ? Math.round((limits.pregnancy / limits.general) * 100) : 75,
    reason,
    warnings,
    formula: `Pregnancy Category ${pregnancyCategory} - Trimester ${trimester}`,
    calculations: {
      pregnancyCategory: pregnancyCategory.charCodeAt(0),
      trimester,
      maxSafeDose: limits?.pregnancy || 0
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
  },
  drugName?: string
): DoseRecommendation {
  const warnings: string[] = []
  let finalAdjustmentFactor = 1
  const reasons: string[] = []
  
  // Check pregnancy contraindication FIRST - this is critical safety check
  if (patient.isPregnant) {
    if (drugInfo.pregnancyCategory === 'X' || drugInfo.pregnancyCategory === 'D') {
      const pregnancyResult = getPregnancyDoseGuidance(
        drugName || '',
        drugInfo.pregnancyCategory,
        patient.pregnancyTrimester || 1
      )
      // For contraindicated drugs, return immediately
      if (pregnancyResult.adjustmentPercentage === 0) {
        return pregnancyResult
      }
    }
    
    // Check against known contraindicated drugs
    if (drugName) {
      const validation = validateDoseAgainstLimits(
        drugName,
        adultDose,
        true, // isPregnant
        patient.age < 18,
        patient.age >= 65,
        (patient.creatinineClearance !== undefined && patient.creatinineClearance < 60),
        patient.weight
      )
      
      if (validation.isContraindicated) {
        return {
          adjustedDose: 'DO NOT USE',
          adjustmentPercentage: 0,
          reason: `${drugName} is CONTRAINDICATED for this patient`,
          warnings: validation.warnings,
          formula: 'CONTRAINDICATED - No safe dose exists',
          calculations: {
            originalDose: adultDose,
            adjustedDose: 0,
            adjustmentFactor: 0
          }
        }
      }
      
      warnings.push(...validation.warnings)
    }
  }
  
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
  
  // Pregnancy adjustment (for non-contraindicated drugs)
  if (patient.isPregnant && drugInfo.pregnancyCategory) {
    const pregnancyResult = getPregnancyDoseGuidance(
      drugName || '',
      drugInfo.pregnancyCategory,
      patient.pregnancyTrimester || 1
    )
    warnings.push(...pregnancyResult.warnings)
    reasons.push(`Pregnancy: ${pregnancyResult.reason}`)
  }
  
  // Nursing
  if (patient.isNursing) {
    warnings.push('Breastfeeding: Check drug excretion in breast milk')
    warnings.push('Some medications pass into breast milk - consult specialist')
  }
  
  let adjustedDose = adultDose * finalAdjustmentFactor
  
  // Final validation against safe dose limits
  if (drugName) {
    const validation = validateDoseAgainstLimits(
      drugName,
      adjustedDose,
      patient.isPregnant || false,
      patient.age < 18,
      patient.age >= 65,
      (patient.creatinineClearance !== undefined && patient.creatinineClearance < 60),
      patient.weight
    )
    
    if (validation.dose !== adjustedDose) {
      adjustedDose = validation.dose
      warnings.push(...validation.warnings)
    }
  }
  
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
