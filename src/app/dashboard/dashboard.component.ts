import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { Employee } from '../features/employee/employee';
import { EmployeeService } from '../features/employee/employee.service';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentListPipe } from '../features/equipment/equipment-list.pipe';
import { SearchBarComponent } from '../design-system/search-bar/search-bar.component';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    EquipmentListPipe,
    SearchBarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  employeeService = inject(EmployeeService);

  // Create signals for the component state
  private searchTermSignal = signal<string>('');
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signal for filtered data
  readonly filteredEmployees = computed(() => {
    const employees = this.employeeService.employees();
    const searchTerm = this.searchTermSignal();

    if (!searchTerm) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Public readonly accessors
  readonly dataSource = computed(() => this.filteredEmployees());
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'equipment',
    'status',
  ];

  constructor() {
    // No need for effect here as we're using computed signals
  }

  ngOnInit(): void {
    // Refresh employees data when component initializes
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.employeeService
      .refreshEmployees()
      .pipe(
        catchError((error) => {
          this.errorSignal.set(
            'Failed to load employees. Please try again later.'
          );
          console.error('Error loading employees:', error);
          throw error;
        }),
        finalize(() => this.loadingSignal.set(false))
      )
      .subscribe();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTermSignal.set(searchTerm);
  }

  retryLoading(): void {
    this.loadEmployees();
  }
}
