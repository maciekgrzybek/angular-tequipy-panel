import { Injectable, computed, signal } from '@angular/core';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeStore {
  private employeesSignal = signal<Employee[]>([]);
  private currentEmployeeSignal = signal<Employee | null>(null);

  public readonly employees = this.employeesSignal.asReadonly();
  public readonly currentEmployee = this.currentEmployeeSignal.asReadonly();

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
}
