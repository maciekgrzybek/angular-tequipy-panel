import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Employee } from './employee';
import { Observable, tap, switchMap, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OffboardingRequestBody {
  address: {
    streetLine1: string;
    country: string;
    postalCode: string;
    receiver: string;
  };
  notes?: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = environment.apiUrl;

  // Use functional injection instead of constructor injection
  private http = inject(HttpClient);

  // Signal to store the list of employees
  private employeesSignal = signal<Employee[]>([]);

  // Signal to store the currently selected employee
  private currentEmployeeSignal = signal<Employee | null>(null);

  // Public readonly accessor for the employees signal
  public readonly employees = this.employeesSignal.asReadonly();

  // Public readonly accessor for the current employee signal
  public readonly currentEmployee = this.currentEmployeeSignal.asReadonly();

  // Computed signal for active employees
  public readonly activeEmployees = computed(() =>
    this.employeesSignal().filter((emp) => emp.status === 'ACTIVE')
  );

  // Computed signal for offboarded employees
  public readonly offboardedEmployees = computed(() =>
    this.employeesSignal().filter((emp) => emp.status === 'OFFBOARDED')
  );

  constructor() {
    // Initialize employees on service creation
    this.getAllEmployees();
  }

  // Public method to refresh employees data
  refreshEmployees(): Observable<Employee[]> {
    return this.getAllEmployees();
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
      tap((employees) => {
        this.employeesSignal.set(employees);
      }),
      catchError((error) => {
        console.error('Error fetching employees:', error);
        return of([]);
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching employee with id ${id}:`, error);
        throw error;
      })
    );
  }

  getEmployeeByIdOptimized(id: string): Observable<Employee> {
    // First check if the employee is already available locally
    const existingEmployee = this.employees().find((emp) => emp.id === id);

    if (existingEmployee) {
      // Set the current employee signal and return as Observable
      this.currentEmployeeSignal.set(existingEmployee);
      return of(existingEmployee);
    } else {
      // Fetch from API if not available locally
      return this.getEmployeeById(id).pipe(
        tap((employee) => {
          // Update the current employee signal with the fetched data
          this.currentEmployeeSignal.set(employee);
        }),
        catchError((error) => {
          console.error(`Error fetching employee with id ${id}:`, error);
          throw error;
        })
      );
    }
  }

  offboardEmployee(
    id: string,
    offboardingData: OffboardingRequestBody
  ): Observable<Employee> {
    return this.http
      .post<Employee>(
        `${this.apiUrl}/employees/${id}/offboard`,
        offboardingData
      )
      .pipe(
        // Capture the updated employee from the offboarding response
        switchMap((updatedEmployee) => {
          // Update the current employee signal
          this.currentEmployeeSignal.set(updatedEmployee);

          // First update the specific employee in the signal list
          this.employeesSignal.update((employees) => {
            return employees.map((emp) =>
              emp.id === updatedEmployee.id ? updatedEmployee : emp
            );
          });

          // Then refresh the entire list to ensure we have the most up-to-date data
          return this.refreshEmployees().pipe(
            // Return the original updated employee from the offboarding response
            map(() => updatedEmployee)
          );
        }),
        catchError((error) => {
          console.error(`Error offboarding employee with id ${id}:`, error);
          throw error;
        })
      );
  }
}
