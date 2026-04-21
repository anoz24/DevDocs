import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkClass = 'dark-theme';
  isDark = signal(false);          // Angular signal for reactive UI

  toggle() {
    this.isDark.update(v => !v);
    document.body.classList.toggle(this.darkClass, this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }

  init() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      this.toggle();
    }
  }
}
