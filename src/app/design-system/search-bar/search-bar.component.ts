import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  searchChange = output<string>();
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged() // Only emit when the current value is different than the last
      )
      .subscribe((value) => {
        this.searchChange.emit(value || '');
      });
  }
}
