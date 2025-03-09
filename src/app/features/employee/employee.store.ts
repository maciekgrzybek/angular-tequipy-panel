import { Injectable, computed, signal } from '@angular/core';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeStore {
  private employeesSignal = signal<Employee[]>([]);
  private currentEmployeeSignal = signal<Employee | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public readonly employees = this.employeesSignal.asReadonly();
  public readonly currentEmployee = this.currentEmployeeSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  setEmployees(employees: Employee[]): void {
    this.employeesSignal.set(employees);
  }

  setCurrentEmployee(employee: Employee | null): void {
    this.currentEmployeeSignal.set(employee);
  }

  updateEmployee(updatedEmployee: Employee): void {
    this.employeesSignal.update((employees) => {
      return employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
    });

    if (this.currentEmployee()?.id === updatedEmployee.id) {
      this.currentEmployeeSignal.set(updatedEmployee);
    }
  }

  setLoading(isLoading: boolean): void {
    this.loadingSignal.set(isLoading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
