/**
 * OpenFDA Drug Database Integration
 * Free API for drug information, interactions, and labeling
 */

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug'

export interface DrugInfo {
  brand_name: string[]
  generic_name: string[]
  manufacturer_name: string[]
  product_type: string[]
  route: string[]
  substance_name: string[]
  rxcui: string[]
  spl_id: string[]
  package_ndc: string[]
}

export interface DrugLabel {
  openfda: DrugInfo
  purpose: string[]
  indications_and_usage: string[]
  warnings: string[]
  dosage_and_administration: string[]
  drug_interactions: string[]
  pregnancy: string[]
  nursing_mothers: string[]
  pediatric_use: string[]
  geriatric_use: string[]
  adverse_reactions: string[]
  contraindications: string[]
  active_ingredient: string[]
  inactive_ingredient: string[]
}

export interface DrugEvent {
  receivedate: string
  serious: number
  patient: {
    drug: Array<{
      medicinalproduct: string
      drugindication: string
      drugadministrationroute: string
    }>
    reaction: Array<{
      reactionmeddrapt: string
      reactionoutcome: number
    }>
  }
}

export interface DrugSearchResult {
  meta: {
    results: {
      total: number
      skip: number
      limit: number
    }
  }
  results: DrugLabel[]
}

// Search for drug information by name
export async function searchDrug(drugName: string, limit: number = 10): Promise<DrugSearchResult | null> {
  try {
    const encodedName = encodeURIComponent(drugName)
    const response = await fetch(
      `${OPENFDA_BASE_URL}/label.json?search=openfda.brand_name:"${encodedName}"+OR+openfda.generic_name:"${encodedName}"&limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`OpenFDA API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('[OpenFDA] Search error:', error)
    return null
  }
}

// Get drug interactions information
export async function getDrugInteractions(drugName: string): Promise<string[] | null> {
  try {
    const result = await searchDrug(drugName, 1)
    if (!result?.results?.[0]?.drug_interactions) {
      return null
    }
    return result.results[0].drug_interactions
  } catch (error) {
    console.error('[OpenFDA] Interactions error:', error)
    return null
  }
}

// Get drug warnings
export async function getDrugWarnings(drugName: string): Promise<string[] | null> {
  try {
    const result = await searchDrug(drugName, 1)
    if (!result?.results?.[0]?.warnings) {
      return null
    }
    return result.results[0].warnings
  } catch (error) {
    console.error('[OpenFDA] Warnings error:', error)
    return null
  }
}

// Get drug dosage information
export async function getDrugDosage(drugName: string): Promise<string[] | null> {
  try {
    const result = await searchDrug(drugName, 1)
    if (!result?.results?.[0]?.dosage_and_administration) {
      return null
    }
    return result.results[0].dosage_and_administration
  } catch (error) {
    console.error('[OpenFDA] Dosage error:', error)
    return null
  }
}

// Get comprehensive drug label info
export async function getDrugFullInfo(drugName: string): Promise<DrugLabel | null> {
  try {
    const result = await searchDrug(drugName, 1)
    if (!result?.results?.[0]) {
      return null
    }
    return result.results[0]
  } catch (error) {
    console.error('[OpenFDA] Full info error:', error)
    return null
  }
}

// Search drug adverse events
export async function searchAdverseEvents(drugName: string, limit: number = 10): Promise<DrugEvent[] | null> {
  try {
    const encodedName = encodeURIComponent(drugName)
    const response = await fetch(
      `${OPENFDA_BASE_URL}/event.json?search=patient.drug.medicinalproduct:"${encodedName}"&limit=${limit}`,
      { next: { revalidate: 3600 } }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`OpenFDA API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.results || null
  } catch (error) {
    console.error('[OpenFDA] Adverse events error:', error)
    return null
  }
}

/**
 * Pakistan National Formulary Drug Database (Built-in)
 * Common medications available in Pakistan with local brand names
 */
export const pakistanDrugDatabase: Record<string, {
  genericName: string
  localBrands: string[]
  category: string
  commonDosages: string[]
  interactions: string[]
  pediatricUse: boolean
  geriatricCaution: boolean
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X'
  renalAdjustment: boolean
  hepaticAdjustment: boolean
}> = {
  'paracetamol': {
    genericName: 'Paracetamol (Acetaminophen)',
    localBrands: ['Panadol', 'Calpol', 'Tylenol', 'Adol', 'Disprol'],
    category: 'Analgesic/Antipyretic',
    commonDosages: ['500mg', '650mg', '1000mg', '125mg/5ml syrup'],
    interactions: ['Warfarin (increases INR)', 'Alcohol (hepatotoxicity risk)'],
    pediatricUse: true,
    geriatricCaution: false,
    pregnancyCategory: 'B',
    renalAdjustment: true,
    hepaticAdjustment: true
  },
  'ibuprofen': {
    genericName: 'Ibuprofen',
    localBrands: ['Brufen', 'Advil', 'Nurofen', 'Profen'],
    category: 'NSAID',
    commonDosages: ['200mg', '400mg', '600mg', '100mg/5ml syrup'],
    interactions: ['Aspirin', 'Warfarin', 'ACE inhibitors', 'Lithium', 'Methotrexate'],
    pediatricUse: true,
    geriatricCaution: true,
    pregnancyCategory: 'C',
    renalAdjustment: true,
    hepaticAdjustment: true
  },
  'amoxicillin': {
    genericName: 'Amoxicillin',
    localBrands: ['Amoxil', 'Moxilin', 'Ospamox', 'Polymox'],
    category: 'Antibiotic (Penicillin)',
    commonDosages: ['250mg', '500mg', '125mg/5ml syrup', '250mg/5ml syrup'],
    interactions: ['Methotrexate', 'Warfarin', 'Oral contraceptives'],
    pediatricUse: true,
    geriatricCaution: false,
    pregnancyCategory: 'B',
    renalAdjustment: true,
    hepaticAdjustment: false
  },
  'metformin': {
    genericName: 'Metformin',
    localBrands: ['Glucophage', 'Glycomet', 'Dianorm', 'Obimet'],
    category: 'Antidiabetic (Biguanide)',
    commonDosages: ['500mg', '850mg', '1000mg'],
    interactions: ['Alcohol', 'Contrast media', 'Cimetidine'],
    pediatricUse: false,
    geriatricCaution: true,
    pregnancyCategory: 'B',
    renalAdjustment: true,
    hepaticAdjustment: true
  },
  'omeprazole': {
    genericName: 'Omeprazole',
    localBrands: ['Risek', 'Omez', 'Losec', 'Prilosec'],
    category: 'Proton Pump Inhibitor',
    commonDosages: ['20mg', '40mg'],
    interactions: ['Clopidogrel', 'Methotrexate', 'Digoxin', 'Warfarin'],
    pediatricUse: true,
    geriatricCaution: false,
    pregnancyCategory: 'C',
    renalAdjustment: false,
    hepaticAdjustment: true
  },
  'amlodipine': {
    genericName: 'Amlodipine',
    localBrands: ['Norvasc', 'Amlopin', 'Amlor', 'Stamlo'],
    category: 'Calcium Channel Blocker',
    commonDosages: ['2.5mg', '5mg', '10mg'],
    interactions: ['Simvastatin', 'Cyclosporine', 'CYP3A4 inhibitors'],
    pediatricUse: false,
    geriatricCaution: true,
    pregnancyCategory: 'C',
    renalAdjustment: false,
    hepaticAdjustment: true
  },
  'atorvastatin': {
    genericName: 'Atorvastatin',
    localBrands: ['Lipitor', 'Atorva', 'Lipicure', 'Storvas'],
    category: 'Statin',
    commonDosages: ['10mg', '20mg', '40mg', '80mg'],
    interactions: ['Gemfibrozil', 'Niacin', 'Cyclosporine', 'Clarithromycin', 'Grapefruit juice'],
    pediatricUse: false,
    geriatricCaution: true,
    pregnancyCategory: 'X',
    renalAdjustment: false,
    hepaticAdjustment: true
  },
  'losartan': {
    genericName: 'Losartan',
    localBrands: ['Cozaar', 'Losacar', 'Losar', 'Repace'],
    category: 'ARB (Antihypertensive)',
    commonDosages: ['25mg', '50mg', '100mg'],
    interactions: ['Potassium supplements', 'NSAIDs', 'Lithium', 'ACE inhibitors'],
    pediatricUse: false,
    geriatricCaution: true,
    pregnancyCategory: 'D',
    renalAdjustment: false,
    hepaticAdjustment: true
  },
  'aspirin': {
    genericName: 'Aspirin (Acetylsalicylic Acid)',
    localBrands: ['Disprin', 'Aspirin', 'Ecotrin', 'Ascard'],
    category: 'NSAID/Antiplatelet',
    commonDosages: ['75mg', '150mg', '300mg', '500mg'],
    interactions: ['Warfarin', 'Heparin', 'NSAIDs', 'Methotrexate', 'ACE inhibitors'],
    pediatricUse: false, // Reye's syndrome risk
    geriatricCaution: true,
    pregnancyCategory: 'D',
    renalAdjustment: true,
    hepaticAdjustment: true
  },
  'ciprofloxacin': {
    genericName: 'Ciprofloxacin',
    localBrands: ['Cipro', 'Ciproxin', 'Ciplox', 'Cifran'],
    category: 'Antibiotic (Fluoroquinolone)',
    commonDosages: ['250mg', '500mg', '750mg'],
    interactions: ['Theophylline', 'Warfarin', 'Antacids', 'NSAIDs', 'Cyclosporine'],
    pediatricUse: false, // Tendon damage risk
    geriatricCaution: true,
    pregnancyCategory: 'C',
    renalAdjustment: true,
    hepaticAdjustment: false
  }
}

// Search Pakistan drug database
export function searchPakistanDrug(drugName: string): typeof pakistanDrugDatabase[keyof typeof pakistanDrugDatabase] | null {
  const normalizedName = drugName.toLowerCase().trim()
  
  // Direct match
  if (pakistanDrugDatabase[normalizedName]) {
    return pakistanDrugDatabase[normalizedName]
  }
  
  // Search by brand name
  for (const [key, drug] of Object.entries(pakistanDrugDatabase)) {
    if (drug.localBrands.some(brand => brand.toLowerCase() === normalizedName)) {
      return drug
    }
    if (drug.genericName.toLowerCase().includes(normalizedName)) {
      return drug
    }
  }
  
  return null
}

// Get all Pakistan drugs
export function getAllPakistanDrugs() {
  return Object.entries(pakistanDrugDatabase).map(([key, drug]) => ({
    id: key,
    ...drug
  }))
}
