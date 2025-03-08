import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];
  }
}
