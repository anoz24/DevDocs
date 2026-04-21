import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightMatch',
  standalone: true
})
export class HighlightMatchPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, term: string): SafeHtml {
    if (!term) return value;
    const regex = new RegExp(`(${term})`, 'gi');
    const highlighted = value.replace(regex, '<mark>$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
