import { Pipe, PipeTransform } from '@angular/core';
import { Equipment } from '../employee/employee';

@Pipe({
  name: 'equipmentList',
  standalone: true,
})
export class EquipmentListPipe implements PipeTransform {
  transform(equipments: Equipment[] | undefined): string {
    if (!equipments || equipments.length === 0) {
      return 'None';
    }

    return equipments.map((equipment) => equipment.name).join(', ');
  }
}
