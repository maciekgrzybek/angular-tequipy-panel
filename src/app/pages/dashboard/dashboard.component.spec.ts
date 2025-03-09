import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { EmployeeService } from '../../features/employee/employee.service';
import { provideRouter } from '@angular/router';
import { Employee } from '../../features/employee/employee';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { EmployeeBuilder } from '../../features/employee/employee.builder';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let fixtures: Awaited<ReturnType<typeof getFixtures>>;

  beforeEach(waitForAsync(async () => {
    fixtures = await getFixtures();
  }));

  it('displays employees in the table when data is loaded', async () => {
    const employees = [
      new EmployeeBuilder()
        .withName('Mr Bean')
        .withEmail('mr.bean@example.com')
        .withDepartment('Comedy')
        .withStatus('ACTIVE')
        .withEquipments([
          { id: '1', name: 'Laptop' },
          { id: '2', name: 'Monitor' },
        ])
        .build(),
      new EmployeeBuilder().build(),
    ];

    await fixtures.render();
    await fixtures.then.loader.isVisible();

    fixtures.given.employees(employees);

    await fixtures.then.table.hasRows(employees.length);
    await fixtures.then.table
      .hasRow(0)
      .withColumnText([
        'Mr Bean',
        'mr.bean@example.com',
        'Comedy',
        'Laptop, Monitor',
        'ACTIVE',
      ]);
  });

  it('shows error message and allows retry', async () => {
    await fixtures.render();
    fixtures.given.errorFromServer();

    await fixtures.then.errorMessage.isVisible();

    await fixtures.when.retryButtonClicked();

    const employees = [
      new EmployeeBuilder().build(),
      new EmployeeBuilder().build(),
    ];
    fixtures.given.employees(employees);

    await fixtures.then.table.hasRows(employees.length);
  });

  it('filters employees by name', async () => {
    const employees = [
      new EmployeeBuilder()
        .withName('Mr Bean')
        .withEmail('mr.bean@example.com')
        .withDepartment('Comedy')
        .withStatus('ACTIVE')
        .withEquipments([
          { id: '1', name: 'Laptop' },
          { id: '2', name: 'Monitor' },
        ])
        .build(),
      new EmployeeBuilder()
        .withName('Hulk Hogan')
        .withEmail('hulk.hogan@example.com')
        .withDepartment('Wrestling')
        .withStatus('OFFBOARDED')
        .withEquipments([
          { id: '1', name: 'Axe' },
          { id: '2', name: 'Belt' },
        ])
        .build(),
    ];

    await fixtures.render();
    fixtures.given.employees(employees);

    await fixtures.then.table.hasRows(employees.length);
    await fixtures.when.filterEmployees('hog');
    await fixtures.then.table.hasRows(1);
    await fixtures.then.table
      .hasRow(0)
      .withColumnText([
        'Hulk Hogan',
        'hulk.hogan@example.com',
        'Wrestling',
        'Axe, Belt',
        'OFFBOARDED',
      ]);
  });

  it('filters employees by department', async () => {
    const employees = [
      new EmployeeBuilder()
        .withName('Mr Bean')
        .withEmail('mr.bean@example.com')
        .withDepartment('Comedy')
        .withStatus('ACTIVE')
        .withEquipments([
          { id: '1', name: 'Laptop' },
          { id: '2', name: 'Monitor' },
        ])
        .build(),
      new EmployeeBuilder()
        .withName('Hulk Hogan')
        .withEmail('hulk.hogan@example.com')
        .withDepartment('Wrestling')
        .withStatus('OFFBOARDED')
        .withEquipments([
          { id: '1', name: 'Axe' },
          { id: '2', name: 'Belt' },
        ])
        .build(),
    ];

    await fixtures.render();
    fixtures.given.employees(employees);

    await fixtures.then.table.hasRows(employees.length);
    await fixtures.when.filterEmployees('wres');
    await fixtures.then.table.hasRows(1);
    await fixtures.then.table
      .hasRow(0)
      .withColumnText([
        'Hulk Hogan',
        'hulk.hogan@example.com',
        'Wrestling',
        'Axe, Belt',
        'OFFBOARDED',
      ]);
  });

  it('filters employees based on search term', async () => {
    const employees = [
      new EmployeeBuilder().withName('Mr Bean').build(),
      new EmployeeBuilder().withName('Hulk Hogan').build(),
    ];

    await fixtures.render();
    fixtures.given.employees(employees);

    await fixtures.then.table.hasRows(employees.length);
    await fixtures.when.filterEmployees('something that does not exist');
    await fixtures.then.emptyState.isVisible();
  });
});

async function getFixtures() {
  await TestBed.configureTestingModule({
    imports: [DashboardComponent],
    providers: [
      EmployeeService,
      { provide: ComponentFixtureAutoDetect, useValue: true },
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
    ],
  }).compileComponents();
  const httpTestingController = TestBed.inject(HttpTestingController);

  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let loader: HarnessLoader;

  return {
    render: () => {
      fixture = TestBed.createComponent(DashboardComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      return { fixture, component, loader };
    },
    given: {
      employees: (data: Employee[] = []) => {
        const req = httpTestingController.expectOne(
          `${environment.apiUrl}/employees`
        );
        req.flush(data);

        fixture.detectChanges();
      },
      errorFromServer: () => {
        const req = httpTestingController.expectOne(
          `${environment.apiUrl}/employees`
        );
        req.error(new ProgressEvent('Failed!'), {
          status: 500,
          statusText: 'Internal Server Error',
        });
        fixture.detectChanges();
      },
    },
    when: {
      retryButtonClicked: async () => {
        const retryButton = await loader.getHarness(MatButtonHarness);
        await retryButton.click();
        fixture.detectChanges();
      },
      filterEmployees: async (searchTerm: string) => {
        const searchBar = await loader.getHarness(MatInputHarness);
        await searchBar.setValue(searchTerm);
        fixture.detectChanges();
      },
    },
    then: {
      loader: {
        isVisible: async () => {
          const element = await loader.getHarness(MatProgressSpinnerHarness);
          expect(element).toBeTruthy();
        },
      },
      errorMessage: {
        isVisible: async () => {
          const element = fixture.debugElement.query(
            By.css('.error-container')
          );
          expect(element).toBeTruthy();
        },
      },
      emptyState: {
        isVisible: async () => {
          const element = fixture.debugElement.query(By.css('.empty-state'));
          expect(element).toBeTruthy();
        },
      },
      table: {
        hasRows: async (count: number) => {
          const table = await loader.getHarness(MatTableHarness);
          const rows = await table.getRows();
          expect(rows.length).toBe(count);
        },
        hasRow: (row: number) => {
          return {
            withColumnText: async (columns: string[]) => {
              const table = await loader.getHarness(MatTableHarness);
              const rows = await table.getRows();
              const rowToCheck = rows[row];
              const cells = await rowToCheck.getCells();

              for (let i = 0; i < cells.length; i++) {
                const text = await cells[i].getText();
                expect(text).toBe(columns[i]);
              }
            },
          };
        },
      },
    },
  };
}
