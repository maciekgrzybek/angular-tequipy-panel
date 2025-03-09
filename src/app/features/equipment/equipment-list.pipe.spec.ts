import { EquipmentListPipe } from './equipment-list.pipe';
import { Equipment } from '../employee/employee';

describe('EquipmentListPipe', () => {
  const testCases = [
    { equipments: undefined, expected: 'None' },
    { equipments: [], expected: 'None' },
    { equipments: [{ id: '1', name: 'Laptop' }], expected: 'Laptop' },
    {
      equipments: [
        { id: '1', name: 'Laptop' },
        { id: '2', name: 'Monitor' },
      ],
      expected: 'Laptop, Monitor',
    },
    {
      equipments: [
        { id: '1', name: 'Laptop' },
        { id: '2', name: 'Monitor' },
        { id: '3', name: 'Keyboard' },
      ],
      expected: 'Laptop, Monitor, Keyboard',
    },
  ];

  testCases.forEach((testCase) => {
    it(`should transform ${testCase.equipments} to "${testCase.expected}"`, () => {
      const pipe = new EquipmentListPipe();
      expect(pipe.transform(testCase.equipments)).toBe(testCase.expected);
    });
  });
});
