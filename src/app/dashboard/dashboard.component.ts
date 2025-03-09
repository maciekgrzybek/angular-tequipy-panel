import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { EmployeeService } from '../features/employee/employee.service';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentListPipe } from '../features/equipment/equipment-list.pipe';
import { SearchBarComponent } from '../design-system/search-bar/search-bar.component';

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

  private searchTermSignal = signal<string>('');

  readonly loading = this.employeeService.loading;
  readonly error = this.employeeService.error;

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

  readonly dataSource = computed(() => this.filteredEmployees());

  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'equipment',
    'status',
  ];

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe();
  }

  onSearchChange(searchTerm: string) {
    this.searchTermSignal.set(searchTerm);
  }

  retryLoading() {
    this.loadEmployees();
  }
}
