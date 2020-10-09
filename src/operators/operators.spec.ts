import { from, Observable, of } from 'rxjs';
import {
  filter,
  groupBy,
  map,
  mergeMap,
  pluck,
  reduce,
  repeatWhen,
} from 'rxjs/operators';

describe('operator', () => {
  it('map()', () => {
    const result: number[] = [];

    from([1, 2, 3, 4, 5])
      .pipe(map(x => 10 * x))
      .subscribe(val => result.push(val));

    expect(result).toEqual([10, 20, 30, 40, 50]);
  });

  it('filter()', () => {
    const result: number[] = [];

    from([1, 2, 3, 4, 5])
      .pipe(filter(val => val > 2))
      .subscribe(val => result.push(val));

    expect(result).toEqual([3, 4, 5]);
  });

  it('reduce()', () => {
    from([1, 2, 3, 4, 5])
      .pipe(reduce((acc, val) => acc + val, 0))
      .subscribe(val => expect(val).toEqual(15));
  });

  it('mergeMap()', () => {
    const result: number[] = [];

    const first$ = from([1, 2, 3]);
    const second$ = from([4, 5]);

    const both$ = new Observable<Observable<number>>(observer => {
      observer.next(first$);
      observer.next(second$);
      observer.complete();
    });

    both$.pipe(mergeMap(val => val)).subscribe(val => result.push(val));

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('groupBy()', () => {
    const result: any[] = [];

    from([
      { id: 'first', value: 1 },
      { id: 'second', value: 2 },
      { id: 'third', value: 3 },
      { id: 'fourth', value: 4 },
      { id: 'fifth', value: 5 },
    ])
      .pipe(
        groupBy(val => val.value % 2),
        mergeMap(group => group.pipe(reduce((acc, val) => acc + val.value, 0)))
      )
      .subscribe(groupVal => result.push(groupVal));

    // First value is sum of odd numbers (9) and second value is sum of even numbers (6).
    expect(result).toEqual([9, 6]);
  });

  it('pluck()', () => {
    const result: any[] = [];

    from([
      { id: 'first', value: 100 },
      { id: 'second', value: 200 },
      { id: 'third', value: 300 },
    ])
      .pipe(
        pluck('value') // same as: .map(val => val.value)
      )
      .subscribe(val => result.push(val));

    expect(result).toEqual([100, 200, 300]);
  });

  it('repeatWhen()', () => {
    const result: number[] = [];

    let counter = 0;
    const values$ = of(1, 2, 3);

    // repeatWhen() takes a function that has an observable as argument.
    // The function's return value is an observable as well.
    // If this observable calls next(), the stream will resubscribe to the source observable.
    // If this observable calls complete(), it does not resubscribe to the source observable.
    // Important things to know:
    // - The returning observable must be connected to the input observable ("notifications" in my example),
    //   i.e. the returned observable must be connected via an operator (e.g. flatMap) to the input observable or it must return itself.
    // - The returning observable does only emit a single value or complete.

    const toRepeatOrNotToRepeat$ = new Observable(observer => {
      counter++;
      counter < 2 ? observer.next() : observer.complete();
    });

    values$
      .pipe(
        repeatWhen(notifications =>
          notifications.pipe(mergeMap(() => toRepeatOrNotToRepeat$))
        )
      )
      .subscribe(val => result.push(val));

    expect(result).toEqual([1, 2, 3, 1, 2, 3]);
  });
});
