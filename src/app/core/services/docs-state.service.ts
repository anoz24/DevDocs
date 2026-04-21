import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { GithubService } from './github.service';
import { DocsParserService } from './docs-parser.service';
import { DocSection } from '../models/doc-section.model';

@Injectable({ providedIn: 'root' })
export class DocsStateService {
  private github = inject(GithubService);
  private parser = inject(DocsParserService);

  private sectionsSubject = new BehaviorSubject<DocSection[]>([]);
  readonly sections$ = this.sectionsSubject.asObservable();

  private loaded = false;

  /** Load and parse the README from GitHub */
  loadReadme(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.github.getReadme().pipe(
      map(md => this.parser.parse(md)),
      tap(sections => this.sectionsSubject.next(sections))
    ).subscribe();
  }

  /** Find a section by id (searches flat + nested) */
  getSectionById(id: string): Observable<DocSection | undefined> {
    return this.sections$.pipe(
      map(sections => this.findSection(sections, id))
    );
  }

  private findSection(sections: DocSection[], id: string): DocSection | undefined {
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.children.length) {
        const found = this.findSection(section.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }
}
