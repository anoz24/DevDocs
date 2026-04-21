import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CopyCodeService {
  attachButtons(): void {
    document.querySelectorAll('pre code').forEach(block => {
      const pre = block.parentElement!;
      if (pre.querySelector('.copy-btn')) return;    // already attached

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent ?? '').then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        });
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }
}
