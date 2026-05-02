'use client'

import React from 'react'
import { MapPin, Phone, Clock } from 'lucide-react'

interface Pharmacy {
  id: string
  name: string
  distance: string
  status: string
  phone: string
}

interface NearbyPharmaciesProps {
  pharmacies?: Pharmacy[]
}

const DEFAULT_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'HealthPlus Pharmacy',
    distance: '0.5 km away',
    status: 'Open 24 hours',
    phone: '(555) 123-4567',
  },
  {
    id: '2',
    name: 'LifeCare Pharmacy',
    distance: '0.8 km away',
    status: 'Closes at 10 PM',
    phone: '(555) 234-5678',
  },
  {
    id: '3',
    name: 'CarePoint Pharmacy',
    distance: '1.2 km away',
    status: 'Open 24 hours',
    phone: '(555) 345-6789',
  },
]

export function NearbyPharmacies({ pharmacies = DEFAULT_PHARMACIES }: NearbyPharmaciesProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground">Nearby Pharmacies</h3>
        <button className="text-primary text-xs font-semibold hover:underline">View all</button>
      </div>

      <div className="space-y-5">
        {pharmacies.map((pharmacy) => (
          <div key={pharmacy.id} className="pb-5 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{pharmacy.name}</h4>
              </div>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{pharmacy.distance}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <p className={`text-xs font-medium ${pharmacy.status.includes('24') ? 'text-green-600' : 'text-orange-600'}`}>
                  {pharmacy.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
