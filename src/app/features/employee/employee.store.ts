import { Injectable, signal } from '@angular/core';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeStore {
  private employeesSignal = signal<Employee[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public readonly employees = this.employeesSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  setEmployees(employees: Employee[]) {
    this.employeesSignal.set(employees);
  }

  updateEmployee(updatedEmployee: Employee) {
    this.employeesSignal.update((employees) => {
      return employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
    });
  }

  setLoading(isLoading: boolean) {
    this.loadingSignal.set(isLoading);
  }

  setError(error: string | null) {
    this.errorSignal.set(error);
  }

  clearError() {
    this.errorSignal.set(null);
  }
}
