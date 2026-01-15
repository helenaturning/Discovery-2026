# Guide de Correction des Couleurs

## Couleurs à remplacer

TOUTES les références à #0ea5e9 (bleu cyan) doivent être remplacées par #10b981 (vert).
TOUTES les références à #0284c7 (bleu foncé) doivent être remplacées par #059669 (vert foncé).
TOUTES les références à #06b6d4 (cyan) doivent être remplacées par #10b981 (vert).

## Remplacements à effectuer dans tous les fichiers .tsx :

1. `#0ea5e9` → `#10b981` (vert pour les éléments principaux)
2. `#0284c7` → `#059669` (vert foncé pour les hovers)
3. `#06b6d4` → `#10b981` (vert pour les gradients)

## Fichiers à corriger :

- /components/AdminDashboard.tsx
- /components/AdminMapView.tsx
- /components/AdministratorRegistration.tsx
- /components/BiometricCapture.tsx
- /components/EmployeeHome.tsx
- /components/EmployeeMap.tsx
- /components/EmployeeSummary.tsx
- /components/SupervisorAlerts.tsx
- /components/SupervisorDashboard.tsx
- /components/InitialCheckInDialog.tsx
- /components/PairQRValidationDialog.tsx

## Charte graphique finale :

- **Vert (#10b981)** : Boutons principaux, statuts de succès, éléments actifs
- **Rouge (#ef4444)** : Alertes, dangers, erreurs
- **Jaune (#f59e0b)** : Avertissements, badges, éléments importants
- **Gris (#64748b)** : Éléments inactifs

## Composant BackgroundDesign

Un composant `/components/BackgroundDesign.tsx` a été créé avec des designs abstraits représentant le travail en équipe.
Utiliser ce composant dans toutes les vues principales pour ajouter le fond décoratif avec la charte graphique.

## Corrections déjà effectuées :

✅ Login.tsx - Bouton vert + fond avec designs abstraits
✅ MobileNav.tsx - Navigation centrée + couleur verte pour les éléments actifs
✅ CheckInDialog.tsx - Géolocalisation SIMULÉE + affichage correct de la question de sécurité
✅ EmployeeRegistration.tsx - Sélection correcte de la question + traduction "Choisissez une question"
✅ LanguageContext.tsx - Ajout de la traduction 'register.selectQuestion'

## Corrections restantes :

⚠️ Remplacer toutes les instances de #0ea5e9, #0284c7, #06b6d4 par les couleurs de la charte (vert/rouge/jaune)
⚠️ Ajouter <BackgroundDesign /> dans tous les écrans principaux
