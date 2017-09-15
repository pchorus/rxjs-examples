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

  it('should import via observables', () => {
    const result = [];
    createObjectsFromCsvByObservable(csv).subscribe(obj => result.push(obj));

    expect(result).toEqual(expected);
  });

  it('should import via for loops correctly', () => {
    expect(createObjectsFromCsvByLoop(csv)).toEqual(expected);
  });
});
