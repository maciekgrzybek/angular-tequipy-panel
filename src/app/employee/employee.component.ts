import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../features/employee/employee.service';
import { Employee } from '../features/employee/employee';

@Component({
  selector: 'app-employee',
  imports: [RouterLink],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  private readonly route = inject(ActivatedRoute);
  employeeService = inject(EmployeeService);
  employee: Employee | null = null;

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];
    this.employeeService.getEmployeeById(userId).subscribe((employee) => {
      this.employee = employee;
    });
  }
}
