import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        ({ DashboardComponent }) => DashboardComponent
      ),
    title: 'Dashboard',
  },
  {
    path: 'employee/:userId',
    loadComponent: () =>
      import('./employee/employee.component').then(
        ({ EmployeeComponent }) => EmployeeComponent
      ),
    title: 'Employee',
  },
  {
    path: 'employee/:userId/offboard',
    loadComponent: () =>
      import('./offboarding-form/offboarding-form.component').then(
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
