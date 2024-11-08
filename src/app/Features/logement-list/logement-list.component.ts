// logement-list.component.ts
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LogementApiService } from '../../services/logement-api.service';
import { Logement, Paiement } from '../../models/Logement';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-logement-list',
  templateUrl: './logement-list.component.html',
  styleUrls: ['./logement-list.component.css'],
})
export class LogementListComponent implements OnInit {
  logements: Logement[] = [];
  niveaux: number[] = [];
  niveau: number = 1;

  constructor(private logementApiService: LogementApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadLogements();
    const logementId = Number(this.route.snapshot.paramMap.get('id'));
    if (logementId) {
      this.loadLogementDetails(logementId);
    }
  }

  // Nouvelle méthode pour charger un logement spécifique
  loadLogementDetails(id: number): void {
    this.logementApiService.getLogementById(id).subscribe((logement) => {
      this.logements = [logement]; // Remplir la liste avec un seul logement
      this.niveaux = [logement.niveau];
    });
  }

  // Méthode pour filtrer les logements en fonction du niveau
  getLogementsFiltres(): Logement[] {
    return this.logements.filter(logement => this.niveaux.includes(logement.niveau));
  }

  loadLogements(): void {
    this.logementApiService.getLogements().subscribe((data) => {
      this.logements = data.map((logement) => ({
        ...logement,
        afficherDetails: false, // Initialiser à false pour masquer par défaut
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

  mettreAJourLogement(logement: Logement): void {
    this.logementApiService.addOrUpdateLogement(logement).subscribe(() => {
      console.log(`Logement avec ID ${logement.id} mis à jour.`);
    });
  }

  afficherDetailsLogement(logement: Logement): void {
    const paiementsHtml = logement.paiements
      .map(
        (paiement, index) => `
          <div id="mois-container-${index}" style="margin-bottom: 10px;">
            <!-- En-tête du mois cliquable -->
            <div id="mois-header-${index}" style="padding: 10px; background-color: #f0f0f0; cursor: pointer; border: 1px solid #ddd; border-radius: 5px;">
              Mois: ${paiement.mois} <span style="float: right;">${paiement.estPaye ? '✔️' : '❌'}</span>
            </div>
  
            <!-- Contenu des détails du paiement (caché par défaut) -->
            <div id="details-${index}" style="display: none; padding: 10px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px; text-align: center;">
                    Montant: 
                    <input 
                      type="number" 
                      value="${paiement.montant}" 
                      id="montant-${index}" 
                      style="width: 100px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: right;" 
                    /> FCFA
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; text-align: center;">
                    État: 
                    <input
                      type="checkbox"
                      id="paiement-${index}"
                      ${paiement.estPaye ? 'checked' : ''}
                      style="margin-right: 8px;"
                    />
                    <span id="status-${index}" style="color: ${paiement.estPaye ? '#28a745' : '#dc3545'}; font-weight: bold;">
                      ${paiement.estPaye ? 'Payé' : 'Non payé'}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        `
      )
      .join('');
  
    const htmlContent = `
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <tbody>
          ${paiementsHtml}
        </tbody>
      </table>
    `;
  
    Swal.fire({
      title: `Détails de ${logement.type} ${logement.numeroLogement}`,
      html: `
        <div style="max-height: 200px; overflow-y: auto;">
          ${htmlContent}
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      width: '500px',          // Largeur réduite
      showConfirmButton: false, // Retire le bouton OK
      didOpen: () => {
        logement.paiements.forEach((paiement, index) => {
          const checkbox = document.getElementById(`paiement-${index}`) as HTMLInputElement | null;
          const montantInput = document.getElementById(`montant-${index}`) as HTMLInputElement | null;
          const statusLabel = document.getElementById(`status-${index}`);
          const moisHeader = document.getElementById(`mois-header-${index}`);
          const detailsContainer = document.getElementById(`details-${index}`);
    
          // Vérification de l'existence des éléments pour éviter les erreurs de null
          if (moisHeader && detailsContainer) {
            moisHeader.addEventListener('click', () => {
              const isVisible = detailsContainer.style.display === 'block';
              detailsContainer.style.display = isVisible ? 'none' : 'block';
            });
          }
    
          if (checkbox && montantInput && statusLabel) {
            checkbox.addEventListener('change', () => {
              paiement.estPaye = checkbox.checked;
              this.mettreAJourPaiement(logement.id, paiement.mois, paiement.estPaye, parseFloat(montantInput.value));
              
              statusLabel.textContent = paiement.estPaye ? 'Payé' : 'Non payé';
              statusLabel.style.color = paiement.estPaye ? '#28a745' : '#dc3545';
            });
    
            montantInput.addEventListener('change', () => {
              paiement.montant = parseFloat(montantInput.value) || 0;
              this.mettreAJourPaiement(logement.id, paiement.mois, paiement.estPaye, paiement.montant);
            });
          }
        });
      },
    });    
  }
  
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
