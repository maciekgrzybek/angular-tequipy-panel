import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        ({ DashboardComponent }) => DashboardComponent
      ),
    title: 'Dashboard',
  },
  {
    path: 'employee/:userId',
    loadComponent: () =>
      import('./pages/employee/employee.component').then(
        ({ EmployeeComponent }) => EmployeeComponent
      ),
    title: 'Employee',
  },
  {
    path: 'employee/:userId/offboard',
    loadComponent: () =>
      import('./pages/offboarding-form/offboarding-form.component').then(
        ({ OffboardingFormComponent }) => OffboardingFormComponent
      ),
    title: 'Offboard Employee',
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
