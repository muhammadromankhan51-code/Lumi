'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Ali Khan',
    email: 'ali.khan@example.com',
    phone: '+92 300 1234567',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    bloodType: 'O+',
    address: '123 Main Street, Karachi, Pakistan',
    medicalHistory: 'Diabetes Type 2, Hypertension',
    allergies: 'Penicillin, Shellfish',
  })

  const [formData, setFormData] = useState(profile)

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Patient Profile</h1>
                <p className="text-muted-foreground">View and manage your personal health information</p>
              </div>
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-border p-8 mb-8">
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-border">
                <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.gender}</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{profile.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{profile.phone}</p>
                  )}
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-bold text-foreground mb-6">Medical Information</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Blood Type</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{profile.bloodType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full border border-border rounded-lg px-4 py-2 text-foreground bg-background"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      <p className="text-foreground">{profile.gender}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Medical History</label>
                  {isEditing ? (
                    <textarea
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground">{profile.medicalHistory}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Known Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground">{profile.allergies}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
