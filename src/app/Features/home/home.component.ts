import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logement } from 'src/app/models/Logement';
import { LogementApiService } from 'src/app/services/logement-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  niveaux: number[] = [];
  logements: Logement[] = [];
  logementTypes: string[] = ['Appartement', 'Studio', 'Chambre'];
  
  selectedNiveau: number | null = null;
  selectedLogementType: string = '';

  constructor(private logementApiService: LogementApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadNiveaux();
  }

  loadNiveaux(): void {
    this.logementApiService.getNiveaux().subscribe((niveaux) => {
      this.niveaux = niveaux;
    });
  }

  search(): void {
    if (this.selectedNiveau !== null) {
      this.logementApiService.getLogementsParNiveau(this.selectedNiveau).subscribe((logements) => {
        // Si un type de logement est sélectionné, on filtre par type
        if (this.selectedLogementType) {
          this.logements = logements.filter(logement => logement.type.toLowerCase() === this.selectedLogementType.toLowerCase());
        } else {
          // Sinon, on affiche tous les logements du niveau
          this.logements = logements;
        }
      });
    }
  }

  onNiveauChange(): void {
    if (this.selectedNiveau !== null) {
      this.logementApiService.getLogementsParNiveau(this.selectedNiveau).subscribe((logements) => {
        // Filtre les logements selon le type sélectionné
        this.logements = logements.filter(logement => logement.type.toLowerCase() === this.selectedLogementType.toLowerCase());
      });
    }
  }

   // Méthode pour naviguer vers LogementListComponent avec l'ID du logement
   goToLogementDetails(logementId: number): void {
    this.router.navigate(['/logements', logementId]);
  }
}
