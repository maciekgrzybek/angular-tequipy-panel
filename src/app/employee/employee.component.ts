import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../features/employee/employee.service';
import { Employee } from '../features/employee/employee';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);

  // Add signals for loading and error states
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly accessors
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // We'll keep this for backward compatibility with the template
  get employee(): Employee | null {
    return this.employeeService.currentEmployee();
  }

  ngOnInit() {
    this.loadEmployee();
  }

  loadEmployee(): void {
    const userId = this.route.snapshot.params['userId'];

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.employeeService
      .getEmployeeByIdOptimized(userId)
      .pipe(
        catchError((error) => {
          this.errorSignal.set(
            'Failed to load employee details. Please try again later.'
          );
          console.error('Error loading employee:', error);
          throw error;
        }),
        finalize(() => this.loadingSignal.set(false))
      )
      .subscribe();
  }

  retryLoading(): void {
    this.loadEmployee();
  }
}
