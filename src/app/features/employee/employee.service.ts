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

  private http = inject(HttpClient);

  private employeesSignal = signal<Employee[]>([]);
  private currentEmployeeSignal = signal<Employee | null>(null);
  public readonly employees = this.employeesSignal.asReadonly();
  public readonly currentEmployee = this.currentEmployeeSignal.asReadonly();

  public readonly activeEmployees = computed(() =>
    this.employeesSignal().filter((emp) => emp.status === 'ACTIVE')
  );

  public readonly offboardedEmployees = computed(() =>
    this.employeesSignal().filter((emp) => emp.status === 'OFFBOARDED')
  );

  constructor() {
    this.getAllEmployees();
  }

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
        throw error;
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
    const existingEmployee = this.employees().find((emp) => emp.id === id);

    if (existingEmployee) {
      this.currentEmployeeSignal.set(existingEmployee);
      return of(existingEmployee);
    } else {
      return this.getEmployeeById(id).pipe(
        tap((employee) => {
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
        switchMap((updatedEmployee) => {
          this.currentEmployeeSignal.set(updatedEmployee);

          this.employeesSignal.update((employees) => {
            return employees.map((emp) =>
              emp.id === updatedEmployee.id ? updatedEmployee : emp
            );
          });

          return this.refreshEmployees().pipe(map(() => updatedEmployee));
        }),
        catchError((error) => {
          console.error(`Error offboarding employee with id ${id}:`, error);
          throw error;
        })
      );
  }
}
