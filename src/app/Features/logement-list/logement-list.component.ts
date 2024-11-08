// logement-list.component.ts
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LogementApiService } from '../../services/logement-api.service';
import { Logement } from '../../models/Logement';

@Component({
  selector: 'app-logement-list',
  templateUrl: './logement-list.component.html',
  styleUrls: ['./logement-list.component.css'],
})
export class LogementListComponent implements OnInit {
  logements: Logement[] = [];
  niveaux: number[] = [];
  niveau: number = 1;

  constructor(private logementApiService: LogementApiService) {}

  ngOnInit(): void {
    this.loadLogements();
  }

  // Méthode pour filtrer les logements en fonction du niveau
  getLogementsFiltres(): Logement[] {
    return this.logements.filter(logement => logement.niveau === this.niveau);
  }

  loadLogements(): void {
    this.logementApiService.getLogements().subscribe((data) => {
      this.logements = data.map((logement) => ({
        ...logement,
        afficherDetails: false,
      }));
      this.niveaux = Array.from(new Set(this.logements.map((logement) => logement.niveau)));
    });
  }

  mettreAJourPaiement(logementId: number, mois: string, estPaye: boolean, montant: number): void {
    const logement = this.logements.find((l) => l.id === logementId);
    if (logement) {
      const paiement = logement.paiements.find((p) => p.mois === mois);
      if (paiement) {
        paiement.estPaye = estPaye;
        paiement.montant = montant;
        this.logementApiService.addOrUpdateLogement(logement).subscribe(() => {
          console.log('Paiement mis à jour sur le serveur');
        });
      }
    }
  }

  mettreAJourEcheanceLoyer(logementId: number, nouvelleEcheance: string): void {
    const logement = this.logements.find((l) => l.id === logementId);
    if (logement) {
      logement.echeanceLoyer = nouvelleEcheance;
      this.logementApiService.addOrUpdateLogement(logement).subscribe(() => {
        console.log('Échéance de loyer mise à jour sur le serveur');
      });
    }
  }

  afficherDetailsLogement(logement: Logement): void {
    const paiementsHtml = logement.paiements
      .map(
        (paiement, index) => `
          <tr>
            <td>${paiement.mois}</td>
            <td>
              <input 
                type="number" 
                value="${paiement.montant}" 
                id="montant-${index}"
                style="width: 80px;" 
              /> FCFA
            </td>
            <td>
              <input
                type="checkbox"
                id="paiement-${index}"
                ${paiement.estPaye ? 'checked' : ''}
              />
              <span id="status-${index}" style="color: ${paiement.estPaye ? '#28a745' : '#dc3545'}; font-weight: bold;">
                ${paiement.estPaye ? 'Payé' : 'Non payé'}
              </span>
            </td>
          </tr>
        `
      )
      .join('');

    const htmlContent = `
      <h3>${logement.type} - Vanne ${logement.numeroVanne}</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
        <thead>
          <tr style="background-color: #007bff; color: white;">
            <th style="padding: 8px; border: 1px solid #ddd;">Mois</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Montant</th>
            <th style="padding: 8px; border: 1px solid #ddd;">État du paiement</th>
          </tr>
        </thead>
        <tbody>
          ${paiementsHtml}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: `Détails de ${logement.type}`,
      html: htmlContent,
      showCloseButton: true,
      focusConfirm: false,
      width: '600px',
      didOpen: () => {
        logement.paiements.forEach((paiement, index) => {
          const checkbox = document.getElementById(`paiement-${index}`) as HTMLInputElement;
          const montantInput = document.getElementById(`montant-${index}`) as HTMLInputElement;
          const statusLabel = document.getElementById(`status-${index}`);

          // Ajouter un écouteur d'événement pour le checkbox
          checkbox.addEventListener('change', () => {
            paiement.estPaye = checkbox.checked;
            this.mettreAJourPaiement(logement.id, paiement.mois, paiement.estPaye, parseFloat(montantInput.value));
            
            statusLabel!.textContent = paiement.estPaye ? 'Payé' : 'Non payé';
            statusLabel!.style.color = paiement.estPaye ? '#28a745' : '#dc3545';
          });

          // Ajouter un écouteur d'événement pour le montant
          montantInput.addEventListener('change', () => {
            paiement.montant = parseFloat(montantInput.value) || 0;
            this.mettreAJourPaiement(logement.id, paiement.mois, paiement.estPaye, paiement.montant);
          });
        });
      },
    });
  
  } 
}
