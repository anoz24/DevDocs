import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { DocsStateService } from '../../core/services/docs-state.service';
import { SidebarFilterService } from '../../core/services/sidebar-filter.service';
import { DocSection } from '../../core/models/doc-section.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchBarComponent, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private docs = inject(DocsStateService);
  private filter = inject(SidebarFilterService);
  private router = inject(Router);

  filteredSections$!: Observable<DocSection[]>;
  expandedSections = new Set<string>();

  ngOnInit() {
    this.filteredSections$ = combineLatest([
      this.docs.sections$,
      this.filter.currentTerm$
    ]).pipe(
      map(([sections, term]) =>
        term ? this.filterTree(sections, term) : sections
      )
    );
  }

  navigateTo(section: DocSection) {
    this.router.navigate(['/docs/section', section.id]);
  }

  toggleExpand(sectionId: string) {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  isExpanded(sectionId: string): boolean {
    return this.expandedSections.has(sectionId);
  }

  private filterTree(sections: DocSection[], term: string): DocSection[] {
    return sections
      .map(s => ({
        ...s,
        children: s.children
          .map(c => ({
            ...c,
            children: c.children.filter(gc =>
              gc.title.toLowerCase().includes(term)
            )
          }))
          .filter(c =>
            c.title.toLowerCase().includes(term) || c.children.length > 0
          )
      }))
      .filter(s =>
        s.title.toLowerCase().includes(term) || s.children.length > 0
      );
  }
}
