import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { OffboardingFormComponent } from './offboarding-form/offboarding-form.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
  },
  {
    path: 'employee/:userId',
    component: EmployeeComponent,
    title: 'Employee',
  },
  {
    path: 'employee/:userId/offboard',
    component: OffboardingFormComponent,
    title: 'Offboard Employee',
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
