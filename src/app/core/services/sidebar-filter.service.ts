import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarFilterService {
  private term$ = new BehaviorSubject<string>('');
  readonly currentTerm$ = this.term$.asObservable();

  setTerm(term: string) { this.term$.next(term.toLowerCase()); }
}
