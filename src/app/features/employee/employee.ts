export type EmployeeStatus = 'ACTIVE' | 'OFFBOARDED';

export interface Employee {
  id: string;
  name: string;
  department: string;
  status: EmployeeStatus;
  email: string;
  equipments: Equipment[];
}

export interface Equipment {
  id: string;
  name: string;
}
