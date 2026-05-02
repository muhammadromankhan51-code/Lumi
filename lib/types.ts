export interface User {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  language: 'en' | 'ur';
  createdAt: string;
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  extractedText: string;
  analyzedData: PrescriptionAnalysis;
  createdAt: string;
}

export interface PrescriptionAnalysis {
  medicines: Medicine[];
  riskScore: number;
  interactions: DrugInteraction[];
  warnings: string[];
  summary: string;
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  whenToTake: string;
  safety: 'safe' | 'caution' | 'high_risk';
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
}

export interface DrugInteraction {
  id: string;
  medicineId1: string;
  medicineId2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface Reminder {
  id: string;
  userId: string;
  medicineId: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  taken: boolean;
  dueDate: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  distance: number;
  address: string;
  openStatus: 'open' | 'closed' | 'closing_soon';
  hours: string;
  phone: string;
  latitude: number;
  longitude: number;
}
