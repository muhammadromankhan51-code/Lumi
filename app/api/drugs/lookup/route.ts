import { NextRequest, NextResponse } from 'next/server'
import { searchDrug, getDrugFullInfo, searchPakistanDrug, getAllPakistanDrugs } from '@/lib/openfda'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const source = searchParams.get('source') || 'all' // 'openfda', 'pakistan', 'all'
  
  if (!query) {
    // Return all Pakistan drugs if no query
    const pakistanDrugs = getAllPakistanDrugs()
    return NextResponse.json({
      success: true,
      source: 'pakistan',
      results: pakistanDrugs,
      total: pakistanDrugs.length
    })
  }
  
  const results: any[] = []
  
  // Search Pakistan drug database first (faster)
  if (source === 'pakistan' || source === 'all') {
    const pakistanResult = searchPakistanDrug(query)
    if (pakistanResult) {
      results.push({
        source: 'pakistan',
        data: pakistanResult
      })
    }
  }
  
  // Search OpenFDA
  if (source === 'openfda' || source === 'all') {
    try {
      const openfdaResult = await searchDrug(query, 3)
      if (openfdaResult?.results) {
        results.push({
          source: 'openfda',
          data: openfdaResult.results.map(r => ({
            brand_name: r.openfda?.brand_name?.[0] || 'Unknown',
            generic_name: r.openfda?.generic_name?.[0] || 'Unknown',
            manufacturer: r.openfda?.manufacturer_name?.[0] || 'Unknown',
            purpose: r.purpose?.[0] || r.indications_and_usage?.[0]?.substring(0, 200) || 'Not available',
            warnings: r.warnings?.[0]?.substring(0, 500) || 'See full label',
            interactions: r.drug_interactions?.[0]?.substring(0, 500) || 'See full label',
            dosage: r.dosage_and_administration?.[0]?.substring(0, 500) || 'See full label',
            pregnancy: r.pregnancy?.[0]?.substring(0, 300) || 'Consult physician',
            pediatric: r.pediatric_use?.[0]?.substring(0, 300) || 'Consult physician',
            geriatric: r.geriatric_use?.[0]?.substring(0, 300) || 'Consult physician',
          }))
        })
      }
    } catch (error) {
      console.error('[Drug Lookup] OpenFDA error:', error)
    }
  }
  
  return NextResponse.json({
    success: true,
    query,
    results,
    total: results.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const { drugName } = await request.json()
    
    if (!drugName) {
      return NextResponse.json(
        { error: 'Drug name required' },
        { status: 400 }
      )
    }
    
    // Get comprehensive drug info
    const [pakistanInfo, openfdaInfo] = await Promise.all([
      Promise.resolve(searchPakistanDrug(drugName)),
      getDrugFullInfo(drugName)
    ])
    
    return NextResponse.json({
      success: true,
      drug: drugName,
      pakistan: pakistanInfo,
      openfda: openfdaInfo ? {
        brand_name: openfdaInfo.openfda?.brand_name,
        generic_name: openfdaInfo.openfda?.generic_name,
        indications: openfdaInfo.indications_and_usage,
        warnings: openfdaInfo.warnings,
        interactions: openfdaInfo.drug_interactions,
        dosage: openfdaInfo.dosage_and_administration,
        contraindications: openfdaInfo.contraindications,
        adverse_reactions: openfdaInfo.adverse_reactions,
        pregnancy: openfdaInfo.pregnancy,
        pediatric_use: openfdaInfo.pediatric_use,
        geriatric_use: openfdaInfo.geriatric_use
      } : null
    })
  } catch (error) {
    console.error('[Drug Lookup] Error:', error)
    return NextResponse.json(
      { error: 'Failed to lookup drug information' },
      { status: 500 }
    )
  }
}
