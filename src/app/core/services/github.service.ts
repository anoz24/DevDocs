import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient);
  private base = environment.github.apiBase;
  private owner = environment.github.owner;
  private repo = environment.github.repo;

  private token = environment.github.token;

  /** Fetches raw README markdown. Result is cached for the session. */
  getReadme(): Observable<string> {
    const url = `${this.base}/repos/${this.owner}/${this.repo}/readme`;
    let headers = new HttpHeaders({
      Accept: 'application/vnd.github.raw+json'
    });
    // Add auth token if configured (raises rate limit from 60 → 5,000/hour)
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      shareReplay(1)   // cache so multiple components don't re-fetch
    );
  }
}
