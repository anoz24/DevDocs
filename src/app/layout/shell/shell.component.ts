import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../features/sidebar/sidebar.component';
import { TocComponent } from '../../features/toc/toc.component';
import { DocsStateService } from '../../core/services/docs-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TocComponent, MatIconModule, MatButtonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  docsState = inject(DocsStateService);
  themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService.init();
    this.docsState.loadReadme();
  }
}
