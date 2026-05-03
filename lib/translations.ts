/**
 * Comprehensive Multi-Language Translation System
 * Supports English, Urdu, Sindhi, Pashto, Balochi, Saraiki
 */

export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false },
  ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  sd: { name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', rtl: true },
  ps: { name: 'Pashto', nativeName: 'پښتو', flag: '🇵🇰', rtl: true },
  bal: { name: 'Balochi', nativeName: 'بلوچی', flag: '🇵🇰', rtl: true },
  skr: { name: 'Saraiki', nativeName: 'سرائیکی', flag: '🇵🇰', rtl: true },
}

export type LanguageCode = keyof typeof languages

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.scan': 'Scan',
    'nav.interactions': 'Interactions',
    'nav.consult': 'Consult',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Auth
    'auth.welcome': 'Welcome to Lumi',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.createAccount': 'Create Account',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.orContinueWith': 'or continue with',
    'auth.signingIn': 'Signing In...',
    'auth.creatingAccount': 'Creating Account...',
    
    // Dashboard
    'dashboard.greeting': 'Hello',
    'dashboard.subtitle': "We're here to help you stay healthy.",
    'dashboard.scanPrescription': 'Scan Prescription',
    'dashboard.myMedicines': 'My Medicines',
    'dashboard.drugInteractions': 'Drug Interactions',
    'dashboard.reminders': 'Reminders',
    'dashboard.patientProfile': 'Patient Profile',
    'dashboard.aiChat': 'AI Chat',
    'dashboard.todaySchedule': "Today's Schedule",
    'dashboard.adherence': 'Adherence Progress',
    'dashboard.quickActions': 'Quick Actions',
    
    // Scan
    'scan.title': 'Scan Prescription',
    'scan.subtitle': 'Upload, capture, or describe your prescription',
    'scan.camera': 'Scan via Camera',
    'scan.upload': 'Upload Image',
    'scan.voice': 'Voice Input',
    'scan.analyzing': 'Analyzing prescription...',
    'scan.complete': 'Analysis Complete',
    'scan.extractedText': 'Extracted Text',
    'scan.aiAnalysis': 'AI Analysis',
    'scan.scanAnother': 'Scan Another Prescription',
    'scan.addToMedicines': 'Add to My Medicines',
    
    // Interactions
    'interactions.title': 'Drug Interactions',
    'interactions.subtitle': 'Check potential interactions between your medicines',
    'interactions.enterMedicines': 'Enter Your Medicines',
    'interactions.searchPlaceholder': 'Search medicine name...',
    'interactions.add': 'Add',
    'interactions.check': 'Check Interactions',
    'interactions.analyzing': 'Analyzing with AI...',
    'interactions.found': 'Found {count} Interaction(s)',
    'interactions.noInteractions': 'No Known Interactions',
    'interactions.noInteractionsDesc': 'No dangerous interactions found. Always consult your healthcare provider.',
    'interactions.doseCalculator': 'Dose Adjustment Calculator',
    'interactions.severity.minor': 'Minor',
    'interactions.severity.moderate': 'Moderate',
    'interactions.severity.severe': 'Severe',
    
    // Chat
    'chat.title': 'Chat with Lumi',
    'chat.placeholder': 'Ask me about your medications...',
    'chat.send': 'Send',
    'chat.speaking': 'Listening...',
    'chat.thinking': 'Thinking...',
    
    // Profile
    'profile.title': 'Patient Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.medicalHistory': 'Medical History',
    'profile.allergies': 'Allergies',
    'profile.conditions': 'Conditions',
    'profile.emergencyContact': 'Emergency Contact',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.language': 'Language',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.close': 'Close',
    
    // Medical
    'medical.dose': 'Dose',
    'medical.frequency': 'Frequency',
    'medical.duration': 'Duration',
    'medical.sideEffects': 'Side Effects',
    'medical.precautions': 'Precautions',
    'medical.contraindications': 'Contraindications',
    'medical.beforeFood': 'Before Food',
    'medical.afterFood': 'After Food',
    'medical.withFood': 'With Food',
    'medical.morning': 'Morning',
    'medical.afternoon': 'Afternoon',
    'medical.evening': 'Evening',
    'medical.night': 'Night',
  },
  
  ur: {
    // Navigation
    'nav.home': 'ہوم',
    'nav.chat': 'چیٹ',
    'nav.scan': 'اسکین',
    'nav.interactions': 'دوا کے تعاملات',
    'nav.consult': 'مشاورت',
    'nav.settings': 'ترتیبات',
    'nav.help': 'مدد',
    'nav.profile': 'پروفائل',
    'nav.logout': 'لاگ آؤٹ',
    
    // Auth
    'auth.welcome': 'لومی میں خوش آمدید',
    'auth.signIn': 'سائن ان',
    'auth.signUp': 'رجسٹر کریں',
    'auth.email': 'ای میل ایڈریس',
    'auth.password': 'پاس ورڈ',
    'auth.confirmPassword': 'پاس ورڈ کی تصدیق',
    'auth.fullName': 'پورا نام',
    'auth.createAccount': 'اکاؤنٹ بنائیں',
    'auth.dontHaveAccount': 'اکاؤنٹ نہیں ہے؟',
    'auth.alreadyHaveAccount': 'پہلے سے اکاؤنٹ ہے؟',
    'auth.forgotPassword': 'پاس ورڈ بھول گئے؟',
    'auth.orContinueWith': 'یا جاری رکھیں',
    'auth.signingIn': 'سائن ان ہو رہا ہے...',
    'auth.creatingAccount': 'اکاؤنٹ بنایا جا رہا ہے...',
    
    // Dashboard
    'dashboard.greeting': 'السلام علیکم',
    'dashboard.subtitle': 'ہم آپ کو صحت مند رہنے میں مدد کے لیے یہاں ہیں۔',
    'dashboard.scanPrescription': 'نسخہ اسکین کریں',
    'dashboard.myMedicines': 'میری دوائیں',
    'dashboard.drugInteractions': 'دوا کے تعاملات',
    'dashboard.reminders': 'یاددہانی',
    'dashboard.patientProfile': 'مریض کی پروفائل',
    'dashboard.aiChat': 'اے آئی چیٹ',
    'dashboard.todaySchedule': 'آج کا شیڈول',
    'dashboard.adherence': 'دوائی کی پابندی',
    'dashboard.quickActions': 'فوری اقدامات',
    
    // Scan
    'scan.title': 'نسخہ اسکین کریں',
    'scan.subtitle': 'اپلوڈ کریں، کیمرے سے لیں، یا آواز سے بتائیں',
    'scan.camera': 'کیمرے سے اسکین',
    'scan.upload': 'تصویر اپلوڈ',
    'scan.voice': 'آواز سے ان پٹ',
    'scan.analyzing': 'نسخہ کا تجزیہ ہو رہا ہے...',
    'scan.complete': 'تجزیہ مکمل',
    'scan.extractedText': 'نکالا گیا متن',
    'scan.aiAnalysis': 'اے آئی تجزیہ',
    'scan.scanAnother': 'دوسرا نسخہ اسکین کریں',
    'scan.addToMedicines': 'میری دوائیوں میں شامل کریں',
    
    // Interactions
    'interactions.title': 'دوا کے تعاملات',
    'interactions.subtitle': 'اپنی دوائیوں کے درمیان ممکنہ تعاملات چیک کریں',
    'interactions.enterMedicines': 'اپنی دوائیں درج کریں',
    'interactions.searchPlaceholder': 'دوا کا نام تلاش کریں...',
    'interactions.add': 'شامل کریں',
    'interactions.check': 'تعاملات چیک کریں',
    'interactions.analyzing': 'اے آئی سے تجزیہ...',
    'interactions.found': '{count} تعامل ملا',
    'interactions.noInteractions': 'کوئی معلوم تعاملات نہیں',
    'interactions.noInteractionsDesc': 'کوئی خطرناک تعاملات نہیں ملے۔ ہمیشہ اپنے ڈاکٹر سے مشورہ کریں۔',
    'interactions.doseCalculator': 'خوراک کی ایڈجسٹمنٹ کیلکولیٹر',
    'interactions.severity.minor': 'معمولی',
    'interactions.severity.moderate': 'درمیانی',
    'interactions.severity.severe': 'شدید',
    
    // Chat
    'chat.title': 'لومی سے چیٹ کریں',
    'chat.placeholder': 'اپنی دوائیوں کے بارے میں پوچھیں...',
    'chat.send': 'بھیجیں',
    'chat.speaking': 'سن رہا ہوں...',
    'chat.thinking': 'سوچ رہا ہوں...',
    
    // Profile
    'profile.title': 'مریض کی پروفائل',
    'profile.personalInfo': 'ذاتی معلومات',
    'profile.medicalHistory': 'طبی تاریخ',
    'profile.allergies': 'الرجیاں',
    'profile.conditions': 'بیماریاں',
    'profile.emergencyContact': 'ہنگامی رابطہ',
    
    // Common
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ',
    'common.edit': 'ترمیم',
    'common.delete': 'حذف',
    'common.search': 'تلاش',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'ایک خرابی ہوئی',
    'common.success': 'کامیاب',
    'common.warning': 'انتباہ',
    'common.language': 'زبان',
    'common.yes': 'ہاں',
    'common.no': 'نہیں',
    'common.back': 'واپس',
    'common.next': 'اگلا',
    'common.submit': 'جمع کریں',
    'common.close': 'بند کریں',
    
    // Medical
    'medical.dose': 'خوراک',
    'medical.frequency': 'تعدد',
    'medical.duration': 'مدت',
    'medical.sideEffects': 'ضمنی اثرات',
    'medical.precautions': 'احتیاطی تدابیر',
    'medical.contraindications': 'ممنوعات',
    'medical.beforeFood': 'کھانے سے پہلے',
    'medical.afterFood': 'کھانے کے بعد',
    'medical.withFood': 'کھانے کے ساتھ',
    'medical.morning': 'صبح',
    'medical.afternoon': 'دوپہر',
    'medical.evening': 'شام',
    'medical.night': 'رات',
  },
  
  sd: {
    // Navigation
    'nav.home': 'گھر',
    'nav.chat': 'چيٽ',
    'nav.scan': 'اسڪين',
    'nav.interactions': 'دوائن جا تعاملات',
    'nav.consult': 'صلاح',
    'nav.settings': 'سيٽنگز',
    'nav.help': 'مدد',
    'nav.profile': 'پروفائل',
    'nav.logout': 'ٻاهر نڪرو',
    
    // Auth
    'auth.welcome': 'لومي ۾ ڀلي ڪري آيا',
    'auth.signIn': 'سائن ان',
    'auth.signUp': 'رجسٽر',
    'auth.email': 'اي ميل',
    'auth.password': 'پاسورڊ',
    'auth.confirmPassword': 'پاسورڊ جي تصديق',
    'auth.fullName': 'پورو نالو',
    'auth.createAccount': 'اڪائونٽ ٺاھيو',
    'auth.dontHaveAccount': 'اڪائونٽ ناھي؟',
    'auth.alreadyHaveAccount': 'اڳ ۾ ئي اڪائونٽ آھي؟',
    'auth.forgotPassword': 'پاسورڊ وساري ويا؟',
    'auth.orContinueWith': 'يا جاري رکو',
    'auth.signingIn': 'سائن ان ٿي رھيو آھي...',
    'auth.creatingAccount': 'اڪائونٽ ٺھي رھيو آھي...',
    
    // Dashboard
    'dashboard.greeting': 'السلام عليڪم',
    'dashboard.subtitle': 'اسان توھان جي صحت ۾ مدد لاءِ موجود آھيون۔',
    'dashboard.scanPrescription': 'نسخو اسڪين ڪريو',
    'dashboard.myMedicines': 'منھنجون دوائون',
    'dashboard.drugInteractions': 'دوائن جا تعاملات',
    'dashboard.reminders': 'ياددھاني',
    'dashboard.patientProfile': 'مريض جي پروفائل',
    'dashboard.aiChat': 'اي آءِ چيٽ',
    'dashboard.todaySchedule': 'اڄ جو شيڊول',
    'dashboard.adherence': 'دوائي جي پابندي',
    'dashboard.quickActions': 'جلدي عملون',
    
    // Scan
    'scan.title': 'نسخو اسڪين ڪريو',
    'scan.subtitle': 'اپلوڊ ڪريو، ڪيمري مان وٺو، يا آواز سان ٻڌايو',
    'scan.camera': 'ڪيمري سان اسڪين',
    'scan.upload': 'تصوير اپلوڊ',
    'scan.voice': 'آواز سان',
    'scan.analyzing': 'نسخي جو تجزيو ٿي رھيو آھي...',
    'scan.complete': 'تجزيو مڪمل',
    'scan.extractedText': 'ڪڍيل لکت',
    'scan.aiAnalysis': 'اي آءِ تجزيو',
    'scan.scanAnother': 'ٻيو نسخو اسڪين ڪريو',
    'scan.addToMedicines': 'منھنجي دوائن ۾ شامل ڪريو',
    
    // Common
    'common.save': 'محفوظ ڪريو',
    'common.cancel': 'منسوخ',
    'common.loading': 'لوڊ ٿي رھيو...',
    'common.language': 'ٻولي',
  },
  
  ps: {
    // Navigation
    'nav.home': 'کور',
    'nav.chat': 'چیٹ',
    'nav.scan': 'سکین',
    'nav.interactions': 'د درملو تعاملات',
    'nav.consult': 'مشوره',
    'nav.settings': 'تنظیمات',
    'nav.help': 'مرسته',
    'nav.profile': 'پروفایل',
    'nav.logout': 'وتل',
    
    // Auth
    'auth.welcome': 'لومي ته ښه راغلاست',
    'auth.signIn': 'داخلیدل',
    'auth.signUp': 'نوم لیکنه',
    'auth.email': 'بریښنالیک',
    'auth.password': 'پټنوم',
    'auth.confirmPassword': 'پټنوم تایید',
    'auth.fullName': 'بشپړ نوم',
    'auth.createAccount': 'حساب جوړول',
    'auth.dontHaveAccount': 'حساب نلرئ؟',
    'auth.alreadyHaveAccount': 'حساب لرئ؟',
    'auth.forgotPassword': 'پټنوم مو هیر شو؟',
    'auth.orContinueWith': 'یا دوام ورکړئ',
    'auth.signingIn': 'داخلیږئ...',
    'auth.creatingAccount': 'حساب جوړیږي...',
    
    // Dashboard
    'dashboard.greeting': 'سلام',
    'dashboard.subtitle': 'موږ ستاسو د روغتیا لپاره دلته یو.',
    'dashboard.scanPrescription': 'نسخه سکین کړئ',
    'dashboard.myMedicines': 'زما درمل',
    'dashboard.drugInteractions': 'د درملو تعاملات',
    'dashboard.reminders': 'یادونه',
    'dashboard.patientProfile': 'د ناروغ پروفایل',
    'dashboard.aiChat': 'اے آی چیٹ',
    'dashboard.todaySchedule': 'نن ورځ مهالویش',
    'dashboard.adherence': 'درمل پیروي',
    'dashboard.quickActions': 'چټک عملونه',
    
    // Common
    'common.save': 'خوندي کړئ',
    'common.cancel': 'لغوه',
    'common.loading': 'بارول...',
    'common.language': 'ژبه',
  },
  
  bal: {
    // Navigation
    'nav.home': 'لوگ',
    'nav.chat': 'گپ',
    'nav.scan': 'اسکین',
    'nav.interactions': 'دارو ءِ اثر',
    'nav.consult': 'صلاح',
    'nav.settings': 'تنظیمات',
    'nav.help': 'کمک',
    'nav.profile': 'پروفائل',
    'nav.logout': 'در بوھگ',
    
    // Auth
    'auth.welcome': 'لومی ءَ شُما شَرّ آتکگیت',
    'auth.signIn': 'داخل بوھیت',
    'auth.signUp': 'نام نویسی',
    'auth.email': 'ایمیل',
    'auth.password': 'پاسورڈ',
    'auth.confirmPassword': 'پاسورڈ تصدیق',
    'auth.fullName': 'پورین نام',
    'auth.createAccount': 'اکاؤنٹ جوڑ کنگ',
    'auth.dontHaveAccount': 'اکاؤنٹ نیست؟',
    'auth.alreadyHaveAccount': 'اکاؤنٹ ھست؟',
    'auth.orContinueWith': 'یا ادامہ بدیئیت',
    'auth.signingIn': 'داخل بوھگ...',
    'auth.creatingAccount': 'اکاؤنٹ جوڑ بیت...',
    
    // Dashboard
    'dashboard.greeting': 'السلام علیکم',
    'dashboard.subtitle': 'ما شما ءِ سلامتی ءِ واستہ ادا اَنت.',
    'dashboard.scanPrescription': 'نسخہ اسکین کنیت',
    'dashboard.myMedicines': 'منی دارو',
    'dashboard.drugInteractions': 'دارو ءِ اثر',
    'dashboard.reminders': 'یادداشت',
    'dashboard.patientProfile': 'ناجوڑ ءِ پروفائل',
    'dashboard.aiChat': 'اے آئی گپ',
    
    // Common
    'common.save': 'محفوظ کنیت',
    'common.cancel': 'منسوخ',
    'common.loading': 'لوڈ بیت...',
    'common.language': 'زبان',
  },
  
  skr: {
    // Navigation
    'nav.home': 'گھر',
    'nav.chat': 'گل بات',
    'nav.scan': 'سکین',
    'nav.interactions': 'دوائیں دا رلاپ',
    'nav.consult': 'صلاح',
    'nav.settings': 'سیٹنگاں',
    'nav.help': 'مدد',
    'nav.profile': 'پروفائل',
    'nav.logout': 'ٻاہر نکلو',
    
    // Auth
    'auth.welcome': 'لومی وچ خوش آیا',
    'auth.signIn': 'سائن ان',
    'auth.signUp': 'رجسٹر',
    'auth.email': 'ای میل',
    'auth.password': 'پاسورڈ',
    'auth.confirmPassword': 'پاسورڈ دی تصدیق',
    'auth.fullName': 'پورا ناں',
    'auth.createAccount': 'اکاؤنٹ ٻناؤ',
    'auth.dontHaveAccount': 'اکاؤنٹ کائنی؟',
    'auth.alreadyHaveAccount': 'پہلے کنوں اکاؤنٹ ہے؟',
    'auth.orContinueWith': 'یا جاری رکھو',
    'auth.signingIn': 'سائن ان تھی ویندا...',
    'auth.creatingAccount': 'اکاؤنٹ ٻندا پیا...',
    
    // Dashboard
    'dashboard.greeting': 'السلام علیکم',
    'dashboard.subtitle': 'اساں تہاڈی صحت وچ مدد کرن لئی حاضر ہاں۔',
    'dashboard.scanPrescription': 'نسخہ سکین کرو',
    'dashboard.myMedicines': 'میڈیاں دوائیاں',
    'dashboard.drugInteractions': 'دوائیں دا رلاپ',
    'dashboard.reminders': 'یاد دہانی',
    'dashboard.patientProfile': 'مریض دا پروفائل',
    'dashboard.aiChat': 'اے آئی گل بات',
    
    // Common
    'common.save': 'محفوظ کرو',
    'common.cancel': 'منسوخ',
    'common.loading': 'لوڈ تھی ویندا...',
    'common.language': 'بولی',
  },
}

// Get translation with fallback to English
export function t(key: string, lang: LanguageCode = 'en'): string {
  return translations[lang]?.[key] || translations.en?.[key] || key
}

// Check if language is RTL
export function isRTL(lang: LanguageCode): boolean {
  return languages[lang]?.rtl || false
}

// Get all language options
export function getLanguageOptions() {
  return Object.entries(languages).map(([code, info]) => ({
    code: code as LanguageCode,
    ...info
  }))
}
