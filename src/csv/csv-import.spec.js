/* global describe, it */
describe('csv-import', () => {
  const csv = `prop1;prop2;prop3
1;2;3
A;B;C`;

  const expected = [{
    prop1: '1',
    prop2: '2',
    prop3: '3'
  }, {
    prop1: 'A',
    prop2: 'B',
    prop3: 'C'
  }];

  it('should import correctly', () => {
    const result = [];
    createObjectsFromCsv(csv).subscribe(obj => result.push(obj));

    expect(result).toEqual(expected);
  });

  it('should import without RxJS correctly', () => {
    expect(createObjectsFromCsvWithoutRx(csv)).toEqual(expected);
  });
});
