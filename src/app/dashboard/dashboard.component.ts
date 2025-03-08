import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../features/employee/employee';
import { EmployeeService } from '../features/employee/employee.service';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { EquipmentListPipe } from '../features/equipment/equipment-list.pipe';
import { SearchBarComponent } from '../design-system/search-bar/search-bar.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatTableModule, EquipmentListPipe, SearchBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  employeeService = inject(EmployeeService);
  dataSource: Employee[] = [];
  allEmployees: Employee[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'equipment',
    'status',
  ];

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((employees) => {
      this.allEmployees = employees;
      this.dataSource = employees;
    });
  }

  onSearchChange(searchTerm: string): void {
    if (!searchTerm) {
      this.dataSource = this.allEmployees;
      return;
    }

    searchTerm = searchTerm.toLowerCase();
    this.dataSource = this.allEmployees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
    );
  }
}
