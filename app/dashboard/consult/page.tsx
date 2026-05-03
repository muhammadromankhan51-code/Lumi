'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Stethoscope, Video, Phone, Calendar, MapPin, Clock, Star, ArrowRight, Shield, Award, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LumiAvatar } from '@/components/lumi-avatar'

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Ahmed',
    specialty: 'General Physician',
    experience: '15 years',
    rating: 4.9,
    reviews: 1247,
    available: true,
    nextSlot: '10:30 AM',
    image: null,
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Pharmacist Consultant',
    experience: '12 years',
    rating: 4.8,
    reviews: 892,
    available: true,
    nextSlot: '11:00 AM',
    image: null,
  },
  {
    id: 3,
    name: 'Dr. Fatima Khan',
    specialty: 'Internal Medicine',
    experience: '20 years',
    rating: 4.95,
    reviews: 2156,
    available: false,
    nextSlot: 'Tomorrow 9:00 AM',
    image: null,
  },
]

export default function ConsultPage() {
  const [consultType, setConsultType] = useState<'video' | 'phone' | 'inperson'>('video')

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-5xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <LumiAvatar size="lg" />
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Consult a Doctor</h1>
                <p className="text-muted-foreground">Connect with healthcare professionals for personalized advice</p>
              </div>
            </div>

            {/* Consultation Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setConsultType('video')}
                className={`glass-card hover:glass-card-elevated rounded-xl p-5 flex items-center gap-4 transition-all duration-300 ${
                  consultType === 'video' ? 'ring-2 ring-primary border-primary/50' : 'border-border/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  consultType === 'video' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-blue-100'
                }`}>
                  <Video className={`w-6 h-6 ${consultType === 'video' ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Video Call</p>
                  <p className="text-xs text-muted-foreground">Face-to-face consultation</p>
                </div>
              </button>

              <button
                onClick={() => setConsultType('phone')}
                className={`glass-card hover:glass-card-elevated rounded-xl p-5 flex items-center gap-4 transition-all duration-300 ${
                  consultType === 'phone' ? 'ring-2 ring-primary border-primary/50' : 'border-border/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  consultType === 'phone' 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20' 
                    : 'bg-emerald-100'
                }`}>
                  <Phone className={`w-6 h-6 ${consultType === 'phone' ? 'text-white' : 'text-emerald-600'}`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Phone Call</p>
                  <p className="text-xs text-muted-foreground">Voice consultation</p>
                </div>
              </button>

              <button
                onClick={() => setConsultType('inperson')}
                className={`glass-card hover:glass-card-elevated rounded-xl p-5 flex items-center gap-4 transition-all duration-300 ${
                  consultType === 'inperson' ? 'ring-2 ring-primary border-primary/50' : 'border-border/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  consultType === 'inperson' 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20' 
                    : 'bg-amber-100'
                }`}>
                  <MapPin className={`w-6 h-6 ${consultType === 'inperson' ? 'text-white' : 'text-amber-600'}`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">In-Person</p>
                  <p className="text-xs text-muted-foreground">Visit a clinic nearby</p>
                </div>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Board Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full">
                <Users className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-700">100K+ Consultations</span>
              </div>
            </div>

            {/* Doctors List */}
            <h2 className="text-xl font-bold text-foreground mb-4">Available Doctors</h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="glass-card-elevated rounded-2xl p-6 flex items-center gap-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                      {doctor.available && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{doctor.specialty} • {doctor.experience}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{doctor.nextSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button 
                    onClick={() => window.open('https://www.teladoc.com/', '_blank')}
                    className={`${
                      doctor.available 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                    disabled={!doctor.available}
                  >
                    {doctor.available ? (
                      <>
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      'Schedule'
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Lumi AI Disclaimer */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <LumiAvatar size="md" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">About Lumi AI</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    While Lumi provides helpful information about medications and prescriptions, 
                    we always recommend consulting with a licensed healthcare professional for 
                    personalized medical advice. The doctors listed above are third-party providers 
                    and not affiliated with Lumi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
