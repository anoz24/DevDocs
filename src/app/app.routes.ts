import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { DocViewerComponent } from './features/doc-viewer/doc-viewer.component';
import { FavoritesComponent } from './features/favorites/favorites.component';

export const routes: Routes = [
  {
    path: 'docs',
    component: ShellComponent,          // Persistent 3-column shell
    children: [                         // children[] nested routes
      {
        path: 'section/:sectionId',     // :sectionId matches DocSection.id
        component: DocViewerComponent
      },
      {
        path: 'favorites',
        component: FavoritesComponent
      },
      {
        path: '',
        redirectTo: 'section/introduction',   // Default child route
        pathMatch: 'full'
      }
    ]
  },
  { path: '', redirectTo: '/docs', pathMatch: 'full' },
  { path: '**', redirectTo: '/docs' }
];
