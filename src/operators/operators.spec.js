/* global describe, it */
describe('operator', () => {
  it('map()', () => {
    const result = [];

    Rx.Observable.from([1, 2, 3, 4, 5])
      .map(x => 10 * x)
      .subscribe(val => result.push(val));

    expect(result).toEqual([10, 20, 30, 40, 50]);
  });

  it('filter()', () => {
    const result = [];

    Rx.Observable.from([1, 2, 3, 4, 5])
      .filter(val => val > 2)
      .subscribe(val => result.push(val));

    expect(result).toEqual([3, 4, 5]);
  });

  it('reduce()', () => {
    Rx.Observable.from([1, 2, 3, 4, 5])
      .reduce((acc, val) => acc + val, 0)
      .subscribe(val => expect(val).toEqual(15));
  });

  it('mergeMap()', () => {
    const result = [];

    const first$ = Rx.Observable.from([1, 2, 3]);
    const second$ = Rx.Observable.from([4, 5]);

    const both$ = Rx.Observable.create(observer => {
      observer.next(first$);
      observer.next(second$);
      observer.complete();
    });

    both$
      .mergeMap(val => val)
      .subscribe(val => result.push(val));

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('groupBy()', () => {
    const result = [];

    Rx.Observable.from([
      { id: 'first', value: 1 },
      { id: 'second', value: 2 },
      { id: 'third', value: 3 },
      { id: 'fourth', value: 4 },
      { id: 'fifth', value: 5 },
    ])
      .groupBy(val => val.value % 2)
      .mergeMap(group => {
        return group.reduce((acc, val) => acc + val.value, 0)
      })
      .subscribe(groupVal => result.push(groupVal));

    // First value is sum of odd numbers (9) and second value is sum of even numbers (6).
    expect(result).toEqual([9, 6]);
  });

  it('pluck()', () => {
    const result = [];

    Rx.Observable.from([
      { id: 'first', value: 100 },
      { id: 'second', value: 200 },
      { id: 'third', value: 300 },
    ])
      .pluck('value') // same as: .map(val => val.value)
      .subscribe(val => result.push(val));

    expect(result).toEqual([100, 200, 300]);
  });
});
