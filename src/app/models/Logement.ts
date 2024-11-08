// src/app/core/models/Logement.ts
export interface Logement {
    id: number;
    type: 'appartement' | 'studio' | 'chambre';
    niveau: number;
    numeroVanne: string;
    numeroCompteur: string; // Nouveau champ pour le numéro de compteur
    echeanceLoyer: string; // Nouveau champ pour l'échéance de loyer
    estAjout: boolean;
    paiements: Paiement[];
    afficherDetails?: boolean;
  }
  
  // src/app/core/models/Paiement.ts
  export interface Paiement {
    mois: string;
    estPaye: boolean;
    montant: number; // Nouveau champ pour le montant payé
  }
  