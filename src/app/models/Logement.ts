// src/app/core/models/Logement.ts
export interface Logement {
    id: number;
    type: 'appartement' | 'studio' | 'chambre';
    numeroLogement: number; 
    niveau: number;
    numeroVanne: string;
    numeroCompteur: string; 
    echeanceLoyer: string; 
    estAjout: boolean;
    Ans: Date;
    paiements: Paiement[];
    afficherDetails?: boolean;
  }
  
  // src/app/core/models/Paiement.ts
  export interface Paiement {
    mois: string;
    estPaye: boolean;
    montant: number; 
  }
  