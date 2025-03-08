import { Component, inject } from '@angular/core';
import { Employee } from '../features/employee/application/employee';
import { EmployeeService } from '../features/employee/application/employee.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  employeeService = inject(EmployeeService);
  employees: Employee[] = [];

  ngOnInit(): void {
    this.employeeService
      .getAllEmployees()
      .subscribe((employees) => (this.employees = employees));
  }
}
