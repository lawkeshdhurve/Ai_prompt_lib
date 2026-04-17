import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt, CreatePromptDto } from '../models/prompt.model';

@Injectable({ providedIn: 'root' })
export class PromptService {
  private apiUrl = 'http://localhost:8001/prompts';

  constructor(private http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.apiUrl}/`);
  }

  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}/${id}/`);
  }

  createPrompt(dto: CreatePromptDto): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.apiUrl}/`, dto);
  }
}
