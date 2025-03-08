import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../features/employee/employee.service';
import { Employee } from '../features/employee/employee';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { NgIf, NgFor } from '@angular/common';
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
    NgIf,
    NgFor,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  private readonly route = inject(ActivatedRoute);
  employeeService = inject(EmployeeService);

  // We'll keep this for backward compatibility with the template
  get employee(): Employee | null {
    return this.employeeService.currentEmployee();
  }

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];

    // Use the optimized method from the service
    this.employeeService.getEmployeeByIdOptimized(userId).subscribe();
  }
}
