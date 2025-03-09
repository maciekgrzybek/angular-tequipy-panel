import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../features/employee/employee.service';
import { Employee } from '../features/employee/employee';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  private readonly router = inject(Router);

  readonly loading = this.employeeService.loading;
  readonly error = this.employeeService.error;

  // We'll keep this for backward compatibility with the template
  get employee(): Employee | null {
    return this.employeeService.currentEmployee();
  }

  ngOnInit() {
    this.loadEmployee();
  }

  loadEmployee() {
    const userId = this.route.snapshot.params['userId'];
    this.employeeService.getEmployeeByIdOptimized(userId).subscribe();
  }

  retryLoading() {
    this.loadEmployee();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
