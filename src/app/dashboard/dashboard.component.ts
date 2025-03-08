import { Component, inject, OnInit, effect, signal } from '@angular/core';
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

  // Create signals for the component state
  private searchTermSignal = signal<string>('');
  dataSource = signal<Employee[]>([]);

  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'equipment',
    'status',
  ];

  constructor() {
    // Set up effect to update dataSource when employees signal or search term changes
    effect(() => {
      const employees = this.employeeService.employees();
      const searchTerm = this.searchTermSignal();

      if (!searchTerm) {
        this.dataSource.set(employees);
        return;
      }

      const filteredEmployees = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );

      this.dataSource.set(filteredEmployees);
    });
  }

  ngOnInit(): void {
    // Refresh employees data when component initializes
    this.employeeService.refreshEmployees().subscribe();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTermSignal.set(searchTerm);
  }
}
