import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Employee } from './employee';
import { Observable, tap, switchMap, map, catchError, of } from 'rxjs';
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
  public readonly currentEmployee = this.store.currentEmployee;

  constructor() {
    this.getAllEmployees();
  }

  refreshEmployees(): Observable<Employee[]> {
    return this.getAllEmployees();
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
      tap((employees) => {
        this.store.setEmployees(employees);
      }),
      catchError((error) => {
        console.error('Error fetching employees:', error);
        throw error;
      })
    );
  }

  private getEmployeeById(id: string): Observable<Employee> {
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
      this.store.setCurrentEmployee(existingEmployee);
      return of(existingEmployee);
    } else {
      return this.getEmployeeById(id).pipe(
        tap((employee) => {
          this.store.setCurrentEmployee(employee);
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
          this.store.setCurrentEmployee(updatedEmployee);
          this.store.updateEmployee(updatedEmployee);

          return this.refreshEmployees().pipe(map(() => updatedEmployee));
        }),
        catchError((error) => {
          console.error(`Error offboarding employee with id ${id}:`, error);
          throw error;
        })
      );
  }
}
