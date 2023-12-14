import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Person, PersonBody } from '../models/person';
import { environment } from '../../environments/environment';

const { apiURL } = environment;

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private http = inject(HttpClient);

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${apiURL}people`);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${apiURL}people/${id}`);
  }

  registerPerson(person: PersonBody): Observable<Person> {
    return this.http.post<Person>(`${apiURL}people`, person);
  }

  updatePerson(id: number, person: PersonBody): Observable<Person> {
    return this.http.put<Person>(`${apiURL}people/${id}`, person);
  }

  removePerson(id: number): Observable<Object> {
    return this.http.delete(`${apiURL}people/${id}`);
  }
}
