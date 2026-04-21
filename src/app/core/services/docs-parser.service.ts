import { Injectable } from '@angular/core';
import { DocSection } from '../models/doc-section.model';

@Injectable({ providedIn: 'root' })
export class DocsParserService {

  parse(markdown: string): DocSection[] {
    const lines = markdown.split('\n');
    const root: DocSection[] = [];
    let currentH1: DocSection | null = null;
    let currentH2: DocSection | null = null;
    let currentH3: DocSection | null = null;
    let buffer: string[] = [];

    /** Flush buffered content to the deepest active heading */
    const flush = (target: DocSection | null) => {
      if (target) target.content += buffer.join('\n');
      buffer = [];
    };

    /** Return the deepest active heading for flushing */
    const deepest = () => currentH3 ?? currentH2 ?? currentH1;

    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = this.slugify(title);
        const section: DocSection = { id, title, level, content: '', children: [] };

        if (level === 1) {
          flush(deepest());
          root.push(section);
          currentH1 = section;
          currentH2 = null;
          currentH3 = null;
        } else if (level === 2) {
          flush(deepest());
          currentH1?.children.push(section);
          currentH2 = section;
          currentH3 = null;
        } else {
          flush(deepest());
          currentH2?.children.push(section);
          currentH3 = section;
        }
      } else {
        buffer.push(line);
      }
    }
    flush(deepest());
    return root;
  }

  slugify(text: string): string {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  }
}
