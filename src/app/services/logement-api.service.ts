// logement-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logement } from '../models/Logement';

@Injectable({
  providedIn: 'root'
})
export class LogementApiService {
  private apiUrl = 'https://imo-server.onrender.com';
  //private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getLogements(): Observable<Logement[]> {
    return this.http.get<Logement[]>(`${this.apiUrl}/logements`);
  }

  // Récupère tous les niveaux disponibles
  getNiveaux(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/niveaux`);
  }

  // Récupère les logements par niveau
  getLogementsParNiveau(niveau: number): Observable<Logement[]> {
    return this.http.get<Logement[]>(`${this.apiUrl}/logements/niveau/${niveau}`);
  }

  // Récupère un logement spécifique par son ID
  getLogementById(id: number): Observable<Logement> {
    return this.http.get<Logement>(`${this.apiUrl}/logements/${id}`);
  }

  addOrUpdateLogement(logement: Logement): Observable<any> {
    return this.http.post(`${this.apiUrl}/logements`, logement);
  }  

  deleteLogement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateLogement(logement: Logement): Observable<any> {
    return this.http.put(`${this.apiUrl}/logements/${logement.id}`, logement);
  }
  
}
