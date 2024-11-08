// logement-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logement } from '../models/Logement';

@Injectable({
  providedIn: 'root'
})
export class LogementApiService {
  private apiUrl = 'https://imo-server.onrender.com/logements';

  constructor(private http: HttpClient) {}

  getLogements(): Observable<Logement[]> {
    return this.http.get<Logement[]>(this.apiUrl);
  }

  addOrUpdateLogement(logement: Logement): Observable<any> {
    return this.http.post(this.apiUrl, logement);
  }

  deleteLogement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
