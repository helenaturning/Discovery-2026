import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // General
    'app.name': 'Choisissez votre inscription',
    'language': 'Langue',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'confirm': 'Confirmer',
    'close': 'Fermer',
    'search': 'Rechercher',
    'filter': 'Filtrer',
    'export': 'Exporter',
    'loading': 'Chargement...',
    'error': 'Erreur',
    'success': 'Succès',
    'delete': 'Supprimer',
    'edit': 'Modifier',
    'create': 'Créer',
    'view': 'Voir',
    'back': 'Retour',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.logout': 'Déconnexion',
    'auth.register': 'Inscription',
    'auth.selectRole': 'Sélectionner votre rôle',
    'auth.employee': 'Employé',
    'auth.supervisor': 'Superviseur',
    'auth.admin': 'Administrateur Entreprise',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.map': 'Carte',
    'nav.summary': 'Résumé',
    'nav.profile': 'Profil',
    'nav.sites': 'Sites',
    'nav.pairs': 'Binômes',
    'nav.alerts': 'Alertes',
    'nav.users': 'Utilisateurs',
    'nav.settings': 'Paramètres',
    
    // Registration
    'register.title': 'Inscription',
    'register.firstName': 'Prénom',
    'register.lastName': 'Nom',
    'register.employeeId': 'Identifiant Employé',
    'register.company': 'Entreprise',
    'register.email': 'Email',
    'register.password': 'Mot de passe',
    'register.biometric': 'Enrôlement Biométrique',
    'register.biometric.desc': 'Capture de votre visage pour la reconnaissance faciale',
    'register.personalQuestion': 'Question de Sécurité Personnelle',
    'register.personalQuestion.desc': 'Cette question sera utilisée pour vérifier votre identité',
    'register.question': 'Votre question',
    'register.selectQuestion': 'Choisissez une question',
    'register.answer': 'Réponse',
    'register.capturePhoto': 'Capturer Photo',
    'register.retakePhoto': 'Reprendre Photo',
    'register.photoSuccess': 'Photo capturée avec succès',
    'register.consent.title': 'Consentements',
    'register.consent.geo': 'J\'autorise la géolocalisation pendant mes horaires de travail',
    'register.consent.biometric': 'J\'accepte l\'usage biométrique de mon visage',
    'register.consent.privacy': 'J\'ai lu et j\'accepte la politique de confidentialité',
    'register.submit': 'Créer mon compte',
    
    // Employee Dashboard
    'employee.dashboard': 'Tableau de bord Employé',
    'employee.status': 'Statut',
    'employee.status.notStarted': 'Non Démarré',
    'employee.status.present': 'Présent',
    'employee.status.absent': 'Absent',
    'employee.status.paused': 'En Pause',
    'employee.status.suspended': 'Suspendu',
    'employee.startDay': 'Démarrer la Présence',
    'employee.endDay': 'Terminer la Journée',
    'employee.pause': 'Pause',
    'employee.emergency': 'Urgence',
    'employee.checkin': 'Vérification',
    'employee.checkin.title': 'Vérification de Présence',
    'employee.checkin.desc': 'Veuillez vérifier votre présence',
    'employee.checkin.method': 'Choisissez votre méthode de vérification',
    'employee.checkin.facial': 'Reconnaissance Faciale',
    'employee.checkin.question': 'Question Personnelle',
    'employee.location.consent': 'Consentement de Localisation',
    'employee.location.request': 'Voulez-vous activer le suivi de localisation ?',
    'employee.location.required': 'Le suivi de localisation est requis pour vérifier votre présence sur le site.',
    'employee.pair': 'Binôme',
    'employee.pair.status': 'Statut du Binôme',
    'employee.pair.distance': 'Distance',
    'employee.site': 'Site',
    'employee.shift': 'Créneau',
    'employee.summary': 'Résumé de la Journée',
    'employee.summary.individual': 'Temps Individuel',
    'employee.summary.withPair': 'Temps avec Binôme',
    'employee.summary.badge': 'Badge de Présence',
    'employee.summary.score': 'Score de Fiabilité',
    
    // Supervisor Dashboard
    'supervisor.dashboard': 'Tableau de bord Superviseur',
    'supervisor.sites': 'Sites',
    'supervisor.sites.create': 'Créer un Site',
    'supervisor.sites.edit': 'Modifier le Site',
    'supervisor.sites.name': 'Nom du Site',
    'supervisor.sites.address': 'Adresse',
    'supervisor.sites.city': 'Ville',
    'supervisor.sites.gps': 'Coordonnées GPS',
    'supervisor.sites.radius': 'Rayon Autorisé (m)',
    'supervisor.pairs': 'Binômes',
    'supervisor.pairs.create': 'Créer un Binôme',
    'supervisor.pairs.edit': 'Modifier le Binôme',
    'supervisor.pairs.employee1': 'Employé 1',
    'supervisor.pairs.employee2': 'Employé 2',
    'supervisor.monitoring': 'Surveillance Temps Réel',
    'supervisor.monitoring.present': 'Présents',
    'supervisor.monitoring.absent': 'Absents',
    'supervisor.monitoring.suspended': 'Suspendus',
    'supervisor.monitoring.alerts': 'Alertes IA',
    'supervisor.history': 'Historique',
    'supervisor.heatmap': 'Carte de Chaleur',
    'supervisor.schedules': 'Horaires',
    
    // AI & Alerts
    'ai.faceRecognition': 'Reconnaissance Faciale',
    'ai.anomalyDetection': 'Détection d\'Anomalies',
    'ai.score': 'Score de Confiance',
    'ai.alert.gpsStable': 'GPS trop stable',
    'ai.alert.identicalSelfies': 'Selfies identiques',
    'ai.alert.noPair': 'Présence sans binôme',
    'ai.alert.unrealisticMovement': 'Déplacements irréalistes',
    'ai.alert.lateAuth': 'Authentification tardive répétée',
    
    // Status messages
    'status.verifying': 'Vérification en cours...',
    'status.verified': 'Vérifié',
    'status.failed': 'Échec de vérification',
    'status.locationEnabled': 'Localisation activée',
    'status.locationDenied': 'Localisation refusée',
    
    // Privacy
    'privacy.title': 'Confidentialité',
    'privacy.noDataOutsideHours': 'Aucune collecte de données hors horaires',
    'privacy.stopTracking': 'Arrêter le Suivi',
    'privacy.viewHistory': 'Voir mon Historique',
    
    // Administrator
    'admin.dashboard': 'Tableau de bord Administrateur',
    'admin.metrics': 'Métriques Globales',
    'admin.totalEmployees': 'Total Employés',
    'admin.totalSupervisors': 'Total Superviseurs',
    'admin.totalSites': 'Total Sites',
    'admin.totalPairs': 'Total Binômes',
    'admin.users': 'Utilisateurs',
    'admin.users.create': 'Créer un Utilisateur',
    'admin.users.edit': 'Modifier l\'Utilisateur',
    'admin.users.role': 'Rôle',
    'admin.users.status': 'Statut',
    'admin.users.active': 'Actif',
    'admin.users.inactive': 'Inactif',
    'admin.settings': 'Paramètres Système',
    'admin.settings.verification': 'Fréquence de Vérification',
    'admin.settings.defaultRadius': 'Rayon de Site par Défaut',
    'admin.settings.aiThreshold': 'Seuil d\'Alerte IA',
    'admin.settings.minutes': 'minutes',
    'admin.settings.meters': 'mètres',
    'admin.settings.percentage': '%',
  },
  en: {
    // General
    'app.name': 'AI Presence Verification',
    'language': 'Language',
    'save': 'Save',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'close': 'Close',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'delete': 'Delete',
    'edit': 'Edit',
    'create': 'Create',
    'view': 'View',
    'back': 'Back',
    
    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.selectRole': 'Select Your Role',
    'auth.employee': 'Employee',
    'auth.supervisor': 'Supervisor',
    'auth.admin': 'Company Administrator',
    
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.map': 'Map',
    'nav.summary': 'Summary',
    'nav.profile': 'Profile',
    'nav.sites': 'Sites',
    'nav.pairs': 'Pairs',
    'nav.alerts': 'Alerts',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    
    // Registration
    'register.title': 'Registration',
    'register.firstName': 'First Name',
    'register.lastName': 'Last Name',
    'register.employeeId': 'Employee ID',
    'register.company': 'Company',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.biometric': 'Biometric Enrollment',
    'register.biometric.desc': 'Capture your face for facial recognition',
    'register.personalQuestion': 'Personal Security Question',
    'register.personalQuestion.desc': 'This question will be used to verify your identity',
    'register.question': 'Your question',
    'register.selectQuestion': 'Choose a question',
    'register.answer': 'Answer',
    'register.capturePhoto': 'Capture Photo',
    'register.retakePhoto': 'Retake Photo',
    'register.photoSuccess': 'Photo captured successfully',
    'register.consent.title': 'Consents',
    'register.consent.geo': 'I authorize geolocation during my work hours',
    'register.consent.biometric': 'I accept biometric use of my face',
    'register.consent.privacy': 'I have read and accept the privacy policy',
    'register.submit': 'Create My Account',
    
    // Employee Dashboard
    'employee.dashboard': 'Employee Dashboard',
    'employee.status': 'Status',
    'employee.status.notStarted': 'Not Started',
    'employee.status.present': 'Present',
    'employee.status.absent': 'Absent',
    'employee.status.paused': 'Paused',
    'employee.status.suspended': 'Suspended',
    'employee.startDay': 'Start Presence',
    'employee.endDay': 'End Day',
    'employee.pause': 'Pause',
    'employee.emergency': 'Emergency',
    'employee.checkin': 'Check-in',
    'employee.checkin.title': 'Presence Check-in',
    'employee.checkin.desc': 'Please verify your presence',
    'employee.checkin.method': 'Choose your verification method',
    'employee.checkin.facial': 'Facial Recognition',
    'employee.checkin.question': 'Personal Question',
    'employee.location.consent': 'Location Consent',
    'employee.location.request': 'Do you want to enable location tracking?',
    'employee.location.required': 'Location tracking is required to verify your presence at the site.',
    'employee.pair': 'Pair',
    'employee.pair.status': 'Pair Status',
    'employee.pair.distance': 'Distance',
    'employee.site': 'Site',
    'employee.shift': 'Shift',
    'employee.summary': 'Day Summary',
    'employee.summary.individual': 'Individual Time',
    'employee.summary.withPair': 'Time with Pair',
    'employee.summary.badge': 'Presence Badge',
    'employee.summary.score': 'Reliability Score',
    
    // Supervisor Dashboard
    'supervisor.dashboard': 'Supervisor Dashboard',
    'supervisor.sites': 'Sites',
    'supervisor.sites.create': 'Create Site',
    'supervisor.sites.edit': 'Edit Site',
    'supervisor.sites.name': 'Site Name',
    'supervisor.sites.address': 'Address',
    'supervisor.sites.city': 'City',
    'supervisor.sites.gps': 'GPS Coordinates',
    'supervisor.sites.radius': 'Allowed Radius (m)',
    'supervisor.pairs': 'Pairs',
    'supervisor.pairs.create': 'Create Pair',
    'supervisor.pairs.edit': 'Edit Pair',
    'supervisor.pairs.employee1': 'Employee 1',
    'supervisor.pairs.employee2': 'Employee 2',
    'supervisor.monitoring': 'Real-Time Monitoring',
    'supervisor.monitoring.present': 'Present',
    'supervisor.monitoring.absent': 'Absent',
    'supervisor.monitoring.suspended': 'Suspended',
    'supervisor.monitoring.alerts': 'AI Alerts',
    'supervisor.history': 'History',
    'supervisor.heatmap': 'Heatmap',
    'supervisor.schedules': 'Schedules',
    
    // AI & Alerts
    'ai.faceRecognition': 'Facial Recognition',
    'ai.anomalyDetection': 'Anomaly Detection',
    'ai.score': 'Confidence Score',
    'ai.alert.gpsStable': 'GPS too stable',
    'ai.alert.identicalSelfies': 'Identical selfies',
    'ai.alert.noPair': 'Presence without pair',
    'ai.alert.unrealisticMovement': 'Unrealistic movements',
    'ai.alert.lateAuth': 'Repeated late authentication',
    
    // Status messages
    'status.verifying': 'Verifying...',
    'status.verified': 'Verified',
    'status.failed': 'Verification failed',
    'status.locationEnabled': 'Location enabled',
    'status.locationDenied': 'Location denied',
    
    // Privacy
    'privacy.title': 'Privacy',
    'privacy.noDataOutsideHours': 'No data collection outside work hours',
    'privacy.stopTracking': 'Stop Tracking',
    'privacy.viewHistory': 'View My History',
    
    // Administrator
    'admin.dashboard': 'Administrator Dashboard',
    'admin.metrics': 'Global Metrics',
    'admin.totalEmployees': 'Total Employees',
    'admin.totalSupervisors': 'Total Supervisors',
    'admin.totalSites': 'Total Sites',
    'admin.totalPairs': 'Total Pairs',
    'admin.users': 'Users',
    'admin.users.create': 'Create User',
    'admin.users.edit': 'Edit User',
    'admin.users.role': 'Role',
    'admin.users.status': 'Status',
    'admin.users.active': 'Active',
    'admin.users.inactive': 'Inactive',
    'admin.settings': 'System Settings',
    'admin.settings.verification': 'Verification Frequency',
    'admin.settings.defaultRadius': 'Default Site Radius',
    'admin.settings.aiThreshold': 'AI Alert Threshold',
    'admin.settings.minutes': 'minutes',
    'admin.settings.meters': 'meters',
    'admin.settings.percentage': '%',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}