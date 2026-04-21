import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TocItem { id: string; text: string; level: number; }

@Injectable({ providedIn: 'root' })
export class TocService {
  private items$ = new BehaviorSubject<TocItem[]>([]);
  readonly toc$ = this.items$.asObservable();

  buildFromDOM(): void {
    const headings = Array.from(
      document.querySelectorAll('.doc-content h2, .doc-content h3')
    ) as HTMLElement[];

    const items: TocItem[] = headings.map(h => {
      if (!h.id) h.id = h.textContent!.toLowerCase().replace(/\s+/g, '-');
      return { id: h.id, text: h.textContent!, level: +h.tagName[1] };
    });
    this.items$.next(items);
  }

  clear(): void {
    this.items$.next([]);
  }
}
