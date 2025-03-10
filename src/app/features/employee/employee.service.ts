import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Employee } from './employee';
import {
  Observable,
  tap,
  switchMap,
  map,
  catchError,
  of,
  finalize,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeStore } from './employee.store';

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
  private store = inject(EmployeeStore);

  public readonly employees = this.store.employees;
  public readonly loading = this.store.loading;
  public readonly error = this.store.error;

  getEmployeeById(id: string): Employee | null {
    return this.employees().find((emp) => emp.id === id) || null;
  }

  refreshEmployees(): Observable<Employee[]> {
    return this.getAllEmployees();
  }

  getAllEmployees(): Observable<Employee[]> {
    this.store.setLoading(true);
    this.store.clearError();

    return this.http.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
      tap((employees) => {
        this.store.setEmployees(employees);
      }),
      catchError((error) => {
        this.store.setError(
          'Failed to load employees. Please try again later.'
        );
        console.error('Error fetching employees:', error);
        throw error;
      }),
      finalize(() => this.store.setLoading(false))
    );
  }

  private fetchEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`).pipe(
      catchError((error) => {
        this.store.setError(
          'Failed to load employee details. Please try again later.'
        );
        console.error(`Error fetching employee with id ${id}:`, error);
        throw error;
      })
    );
  }

  getEmployeeByIdOptimized(id: string): Observable<Employee> {
    const existingEmployee = this.employees().find((emp) => emp.id === id);

    if (existingEmployee) {
      return of(existingEmployee);
    } else {
      this.store.setLoading(true);
      this.store.clearError();

      return this.fetchEmployeeById(id).pipe(
        tap((employee) => {
          if (!this.employees().some((emp) => emp.id === employee.id)) {
            this.store.setEmployees([...this.employees(), employee]);
          }
        }),
        catchError((error) => {
          this.store.setError(
            'Failed to load employee details. Please try again later.'
          );
          console.error(`Error fetching employee with id ${id}:`, error);
          throw error;
        }),
        finalize(() => this.store.setLoading(false))
      );
    }
  }

  offboardEmployee(
    id: string,
    offboardingData: OffboardingRequestBody
  ): Observable<Employee> {
    this.store.setLoading(true);
    this.store.clearError();

    return this.http
      .post<Employee>(
        `${this.apiUrl}/employees/${id}/offboard`,
        offboardingData
      )
      .pipe(
        switchMap((updatedEmployee) => {
          this.store.updateEmployee(updatedEmployee);
          return this.refreshEmployees().pipe(map(() => updatedEmployee));
        }),
        catchError((error) => {
          this.store.setError(
            'Failed to offboard employee. Please try again later.'
          );
          console.error(`Error offboarding employee with id ${id}:`, error);
          throw error;
        }),
        finalize(() => this.store.setLoading(false))
      );
  }
}
