import { Employee, EmployeeStatus, Equipment } from './employee';

export class EmployeeBuilder {
  private employee: Employee = {
    id: '1',
    name: 'John Doe',
    department: 'Engineering',
    status: 'ACTIVE',
    email: 'john.doe@example.com',
    equipments: [
      { id: '1', name: 'Laptop' },
      { id: '2', name: 'Monitor' },
    ],
  };

  public withName(name: string) {
    this.employee.name = name;
    return this;
  }

  public withEmail(email: string) {
    this.employee.email = email;
    return this;
  }

  public withDepartment(department: string) {
    this.employee.department = department;
    return this;
  }

  public withStatus(status: EmployeeStatus) {
    this.employee.status = status;
    return this;
  }

  public withEquipments(equipments: Equipment[]) {
    this.employee.equipments = equipments;
    return this;
  }

  public build() {
    return this.employee;
  }
}
