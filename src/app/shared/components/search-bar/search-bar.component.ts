import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SidebarFilterService } from '../../../core/services/sidebar-filter.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput [formControl]="searchControl" placeholder="Search documentation…" />
      @if (searchControl.value) {
        <button mat-icon-button matSuffix (click)="searchControl.reset()">
          <mat-icon>close</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
  styles: [`
    :host { display: block; }
    .search-field {
      width: 100%;
      font-family: 'DM Sans', 'Helvetica Neue', sans-serif;

      input {
        font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
        font-size: 0.875rem;
      }
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();
  private filter = inject(SidebarFilterService);

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),              // wait 300ms after last keystroke
      distinctUntilChanged(),         // ignore if value didn't change
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filter.setTerm(term ?? '');
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
