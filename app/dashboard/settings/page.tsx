'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Bell, Lock, Globe, Moon, Volume2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'English',
    notifications: true,
    emailNotifications: true,
    soundEnabled: true,
    twoFactorAuth: false,
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground mb-8">Manage your account preferences and app settings</p>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl border border-border p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Medication Reminders</p>
                    <p className="text-sm text-muted-foreground">Get notified about your medication schedule</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      settings.notifications ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Sound Enabled</p>
                    <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="bg-white rounded-xl border border-border p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Display & Language</h2>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-2 text-foreground bg-background"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-2 text-foreground bg-background"
                  >
                    <option>English</option>
                    <option>اردو</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl border border-border p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Security</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>

            {isSaved && (
              <div className="mt-4 bg-success/10 border border-success/30 rounded-lg p-4">
                <p className="text-sm text-success font-medium">Settings saved successfully!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
