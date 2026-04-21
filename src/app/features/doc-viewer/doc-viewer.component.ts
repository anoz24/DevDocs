import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap, Subject, takeUntil } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { DocsStateService } from '../../core/services/docs-state.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { CopyCodeService } from '../../core/services/copy-code.service';
import { TocService } from '../../core/services/toc.service';
import { DocSection } from '../../core/models/doc-section.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [CommonModule, MarkdownComponent, MatIconModule, MatButtonModule],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.scss'
})
export class DocViewerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private docsState = inject(DocsStateService);
  private copyCodeService = inject(CopyCodeService);
  private tocService = inject(TocService);
  favorites = inject(FavoritesService);

  currentSection: DocSection | undefined;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('sectionId')!;
        return this.docsState.getSectionById(id);
      }),
      takeUntil(this.destroy$)
    ).subscribe(section => {
      this.currentSection = section;
    });
  }

  onMarkdownReady() {
    // After markdown renders, inject Copy Code buttons into <pre><code> blocks
    setTimeout(() => {
      this.copyCodeService.attachButtons();
      // Re-parse headings for the TOC
      this.tocService.buildFromDOM();
    }, 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.tocService.clear();
  }
}
