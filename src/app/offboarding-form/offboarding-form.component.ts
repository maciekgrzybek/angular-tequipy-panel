import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  EmployeeService,
  OffboardingRequestBody,
} from '../features/employee/employee.service';
import { Employee } from '../features/employee/employee';
import { switchMap, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-offboarding-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './offboarding-form.component.html',
  styleUrl: './offboarding-form.component.css',
})
export class OffboardingFormComponent implements OnInit {
  offboardingForm!: FormGroup;
  employeeId!: string;
  isSubmitting = false;

  get employee(): Employee | null {
    return this.employeeService.currentEmployee();
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('userId') || '';

    if (!this.employeeId) {
      this.snackBar.open('Employee ID not found', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
      return;
    }
    this.initForm();
    this.loadEmployeeData();
  }

  private initForm(): void {
    this.offboardingForm = this.fb.group({
      address: this.fb.group({
        streetLine1: ['', Validators.required],
        country: ['', Validators.required],
        postalCode: ['', Validators.required],
        receiver: ['', Validators.required],
      }),
      notes: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\+[0-9]{9,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private loadEmployeeData(): void {
    this.employeeService
      .getEmployeeByIdOptimized(this.employeeId)
      .pipe(
        tap((employee) => {
          if (employee.status === 'OFFBOARDED') {
            this.snackBar.open('This employee is already offboarded', 'Close', {
              duration: 5000,
            });
            return;
          }

          if (employee.email) {
            this.offboardingForm.patchValue({
              email: employee.email,
              address: {
                ...this.offboardingForm.value.address,
                receiver: employee.name,
              },
            });
          }
        })
      )
      .subscribe({
        error: (error) => {
          this.snackBar.open('Error loading employee data', 'Close', {
            duration: 3000,
          });
          console.error('Error loading employee:', error);
        },
      });
  }

  onSubmit(): void {
    if (this.employee?.status === 'OFFBOARDED') {
      this.snackBar.open('This employee is already offboarded', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.offboardingForm.invalid) {
      this.markFormGroupTouched(this.offboardingForm);
      return;
    }

    this.isSubmitting = true;
    const offboardingData: OffboardingRequestBody = this.offboardingForm.value;

    this.employeeService
      .offboardEmployee(this.employeeId, offboardingData)
      .subscribe({
        next: () => {
          this.snackBar.open('Employee offboarded successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error offboarding employee', 'Close', {
            duration: 3000,
          });
          console.error('Offboarding error:', error);
        },
      });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/employee', this.employeeId]);
  }
}
