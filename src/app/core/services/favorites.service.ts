import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { DocSection } from '../models/doc-section.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private KEY = 'devdocs_favorites';
  private favorites$ = new BehaviorSubject<Favorite[]>(this.load());

  getAll(): Observable<Favorite[]> { return this.favorites$.asObservable(); }

  isFavorite(id: string): boolean {
    return this.favorites$.value.some(f => f.id === id);
  }

  toggle(section: DocSection): void {
    const current = this.favorites$.value;
    const exists = current.findIndex(f => f.id === section.id);
    const updated = exists >= 0
      ? current.filter(f => f.id !== section.id)          // remove
      : [...current, { id: section.id, title: section.title, savedAt: Date.now() }]; // add
    this.favorites$.next(updated);
    localStorage.setItem(this.KEY, JSON.stringify(updated));
  }

  private load(): Favorite[] {
    try { return JSON.parse(localStorage.getItem(this.KEY) ?? '[]'); }
    catch { return []; }
  }
}
