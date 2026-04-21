import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TocService } from '../../core/services/toc.service';

@Component({
  selector: 'app-toc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toc.component.html',
  styleUrl: './toc.component.scss'
})
export class TocComponent {
  toc = inject(TocService);

  scrollTo(id: string): void {
    const target = document.getElementById(id);
    if (!target) return;

    // The scrollable container is .panel--center, not the document body
    const scrollContainer = target.closest('.panel--center') ?? target.closest('main');
    if (scrollContainer) {
      const targetTop = target.getBoundingClientRect().top
                      - scrollContainer.getBoundingClientRect().top
                      + scrollContainer.scrollTop
                      - 24; // small offset for breathing room
      scrollContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
