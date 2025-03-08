import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EmployeeService, OffboardingRequestBody } from './employee.service';
import { Employee } from './employee';
import { environment } from '../../../environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load employees on initialization', () => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        department: 'Engineering',
        status: 'ACTIVE',
        email: 'john@example.com',
        equipments: [],
      },
    ];

    // The service makes a request during initialization
    const req = httpMock.expectOne(`${apiUrl}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);

    // Check if the signal has been updated
    expect(service.employees()).toEqual(mockEmployees);
  });

  it('should get all employees and update signal', () => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        department: 'Engineering',
        status: 'ACTIVE',
        email: 'john@example.com',
        equipments: [],
      },
      {
        id: '2',
        name: 'Jane Smith',
        department: 'HR',
        status: 'ACTIVE',
        email: 'jane@example.com',
        equipments: [],
      },
    ];

    service.getAllEmployees().subscribe((employees) => {
      expect(employees).toEqual(mockEmployees);
      expect(service.employees()).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne(`${apiUrl}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should get employee by id', () => {
    const mockEmployee: Employee = {
      id: '1',
      name: 'John Doe',
      department: 'Engineering',
      status: 'ACTIVE',
      email: 'john@example.com',
      equipments: [],
    };

    service.getEmployeeById('1').subscribe((employee) => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`${apiUrl}/employees/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  it('should offboard employee and refresh the employee list without returning data', () => {
    // Setup initial employees in the signal
    const initialEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        department: 'Engineering',
        status: 'ACTIVE',
        email: 'john@example.com',
        equipments: [],
      },
      {
        id: '2',
        name: 'Jane Smith',
        department: 'HR',
        status: 'ACTIVE',
        email: 'jane@example.com',
        equipments: [],
      },
    ];

    // Mock the initial GET request that happens in the constructor
    const initReq = httpMock.expectOne(`${apiUrl}/employees`);
    initReq.flush(initialEmployees);

    // Offboarding data
    const offboardingData: OffboardingRequestBody = {
      reason: 'Left company',
      returnDate: '2023-12-31',
      notes: 'Voluntary resignation',
    };

    // Updated employee after offboarding (from the API response)
    const updatedEmployee: Employee = {
      id: '1',
      name: 'John Doe',
      department: 'Engineering',
      status: 'OFFBOARDED',
      email: 'john@example.com',
      equipments: [],
    };

    // Refreshed employee list that might include additional changes from the server
    const refreshedEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        department: 'Engineering',
        status: 'OFFBOARDED',
        email: 'john@example.com',
        equipments: [],
      },
      {
        id: '2',
        name: 'Jane Smith',
        department: 'HR',
        status: 'ACTIVE',
        email: 'jane@example.com',
        equipments: [],
      },
      // A new employee that was added on the server
      {
        id: '3',
        name: 'New Person',
        department: 'Marketing',
        status: 'ACTIVE',
        email: 'new@example.com',
        equipments: [],
      },
    ];

    // Call offboardEmployee
    service.offboardEmployee('1', offboardingData).subscribe(() => {
      // We don't expect any return value, just check if the signal has been updated
      expect(service.employees()).toEqual(refreshedEmployees);

      // Verify the offboarded employee status
      const offboardedEmployee = service
        .employees()
        .find((emp) => emp.id === '1');
      expect(offboardedEmployee?.status).toBe('OFFBOARDED');

      // Verify the new employee is included
      const newEmployee = service.employees().find((emp) => emp.id === '3');
      expect(newEmployee).toBeTruthy();
    });

    // Verify the offboarding request
    const offboardReq = httpMock.expectOne(`${apiUrl}/employees/1/offboard`);
    expect(offboardReq.request.method).toBe('POST');
    expect(offboardReq.request.body).toEqual(offboardingData);
    offboardReq.flush(updatedEmployee);

    // Verify the refresh request
    const refreshReq = httpMock.expectOne(`${apiUrl}/employees`);
    expect(refreshReq.request.method).toBe('GET');
    refreshReq.flush(refreshedEmployees);
  });

  it('should refresh employees and update signal', () => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        department: 'Engineering',
        status: 'ACTIVE',
        email: 'john@example.com',
        equipments: [],
      },
    ];

    service.refreshEmployees().subscribe((employees) => {
      expect(employees).toEqual(mockEmployees);
      expect(service.employees()).toEqual(mockEmployees);
    });

    // Skip the initial request from constructor
    httpMock.expectOne(`${apiUrl}/employees`).flush([]);

    // Handle the refresh request
    const refreshReq = httpMock.expectOne(`${apiUrl}/employees`);
    expect(refreshReq.request.method).toBe('GET');
    refreshReq.flush(mockEmployees);
  });
});
