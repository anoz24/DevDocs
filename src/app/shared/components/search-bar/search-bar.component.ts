import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
      <input matInput [formControl]="searchControl" [placeholder]="placeholder" />
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
  /** Text shown inside the input when it is empty. */
  @Input() placeholder = 'Search documentation…';

  /** Emits the current search term (debounced, distinct) whenever it changes. */
  @Output() searchChanged = new EventEmitter<string>();

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchChanged.emit(term ?? '');
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
