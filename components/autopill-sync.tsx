'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, Smartphone, Check, AlertCircle, Wifi, WifiOff, Clock, Pill, Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LumiMascot } from '@/components/lumi-mascot'

interface SyncedDevice {
  id: string
  name: string
  type: 'smartwatch' | 'phone' | 'tablet' | 'dispenser'
  lastSync: Date
  isConnected: boolean
  batteryLevel?: number
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  nextDose: Date
  pillsRemaining: number
  autoDispenseEnabled: boolean
}

interface AutoPillSyncProps {
  onSync?: () => void
  className?: string
}

export function AutoPillSync({ onSync, className = '' }: AutoPillSyncProps) {
  const [devices, setDevices] = useState<SyncedDevice[]>([
    {
      id: '1',
      name: 'Smart Pill Dispenser',
      type: 'dispenser',
      lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      isConnected: true,
      batteryLevel: 85
    },
    {
      id: '2',
      name: 'Health Watch',
      type: 'smartwatch',
      lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
      isConnected: true,
      batteryLevel: 62
    }
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Every 8 hours',
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
      pillsRemaining: 28,
      autoDispenseEnabled: true
    },
    {
      id: '2',
      name: 'Omeprazole',
      dosage: '20mg',
      frequency: 'Once daily',
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 14), // 14 hours from now
      pillsRemaining: 15,
      autoDispenseEnabled: true
    },
    {
      id: '3',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
      pillsRemaining: 42,
      autoDispenseEnabled: false
    }
  ])

  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date())
  const [showSettings, setShowSettings] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLastSyncTime(new Date())
    setDevices(devices.map(d => ({ ...d, lastSync: new Date() })))
    setIsSyncing(false)
    onSync?.()
  }

  const toggleAutoDispense = (medId: string) => {
    setMedications(medications.map(med => 
      med.id === medId 
        ? { ...med, autoDispenseEnabled: !med.autoDispenseEnabled }
        : med
    ))
  }

  const formatTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatTimeSince = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'dispenser':
        return Pill
      case 'smartwatch':
        return Clock
      case 'phone':
        return Smartphone
      default:
        return Smartphone
    }
  }

  const connectedDevices = devices.filter(d => d.isConnected).length

  return (
    <div className={`glass-card-elevated rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AutoPill Sync</h2>
            <p className="text-sm text-muted-foreground">
              {connectedDevices} device{connectedDevices !== 1 ? 's' : ''} connected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sync Status */}
      {isSyncing && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <LumiMascot size="sm" state="thinking" />
            <div>
              <p className="font-medium text-emerald-800">Syncing with devices...</p>
              <p className="text-sm text-emerald-600">Updating medication schedules and reminders</p>
            </div>
          </div>
        </div>
      )}

      {/* Connected Devices */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Connected Devices</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {devices.map(device => {
            const DeviceIcon = getDeviceIcon(device.type)
            return (
              <div 
                key={device.id}
                className={`p-4 rounded-xl border ${
                  device.isConnected 
                    ? 'bg-white border-emerald-200' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      device.isConnected ? 'bg-emerald-100' : 'bg-muted'
                    }`}>
                      <DeviceIcon className={`w-4 h-4 ${
                        device.isConnected ? 'text-emerald-600' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Synced {formatTimeSince(device.lastSync)}
                      </p>
                    </div>
                  </div>
                  {device.isConnected ? (
                    <Wifi className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                {device.batteryLevel !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          device.batteryLevel > 50 ? 'bg-emerald-500' :
                          device.batteryLevel > 20 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${device.batteryLevel}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{device.batteryLevel}%</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Auto-Dispense Medications */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Medication Schedule</h3>
        <div className="space-y-3">
          {medications.map(med => (
            <div 
              key={med.id}
              className="p-4 bg-white border border-border rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    med.autoDispenseEnabled ? 'bg-emerald-100' : 'bg-muted'
                  }`}>
                    <Pill className={`w-5 h-5 ${
                      med.autoDispenseEnabled ? 'text-emerald-600' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{med.name}</p>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-foreground">Next: {formatTimeUntil(med.nextDose)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Pill className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{med.pillsRemaining} pills left</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => toggleAutoDispense(med.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      med.autoDispenseEnabled ? 'bg-emerald-500' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        med.autoDispenseEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {med.autoDispenseEnabled ? 'Auto-dispense on' : 'Manual'}
                  </span>
                </div>
              </div>
              
              {med.pillsRemaining < 10 && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Low stock - order refill soon</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Last sync info */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Last synced: {formatTimeSince(lastSyncTime)}</span>
        </div>
        <button className="text-primary hover:underline text-sm font-medium">
          View History
        </button>
      </div>
    </div>
  )
}
