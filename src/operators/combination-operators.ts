import { combineLatest, forkJoin, interval, of, timer, zip } from 'rxjs';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';

describe('combination operator', () => {
  it('combineLatest combines latest values of multiple streams', done => {
    const actual: string[][] = [];

    const makeInterval = (char: string) =>
      interval(10).pipe(
        map(val => `${char}${val}`),
        take(3)
      );

    const a$ = makeInterval('A');
    const b$ = makeInterval('B');

    combineLatest([a$, b$])
      .pipe(tap(val => actual.push(val)))
      .subscribe({
        complete: () => {
          const expected = [
            ['A0', 'B0'],
            ['A1', 'B0'],
            ['A1', 'B1'],
            ['A2', 'B1'],
            ['A2', 'B2'],
          ];
          expect(actual).toEqual(expected);
          done();
        },
      });
  });

  it('combineLatest for synchronous observables combines latest values of multiple streams', done => {
    const actual: string[][] = [];

    const a$ = of('A0', 'A1', 'A2');
    const b$ = of('B0', 'B1', 'B2');

    combineLatest([a$, b$])
      .pipe(tap(val => actual.push(val)))
      .subscribe({
        complete: () => {
          const expected = [
            ['A2', 'B0'],
            ['A2', 'B1'],
            ['A2', 'B2'],
          ];
          expect(actual).toEqual(expected);
          done();
        },
      });
  });

  it('forkJoin combines last values of multiple streams', () => {
    const actual: string[][] = [];

    const a$ = of('A0', 'A1', 'A2');
    const b$ = of('B0', 'B1', 'B2');

    forkJoin([a$, b$]).subscribe(val => actual.push(val));

    const expected = [['A2', 'B2']];
    expect(actual).toEqual(expected);
  });

  it('zip combines values of multiple streams as long as every stream has values and no stream is completed', () => {
    const actual: string[][] = [];

    const a$ = of('A0', 'A1');
    const b$ = of('B0', 'B1', 'B2');

    zip(a$, b$).subscribe(val => actual.push(val));

    const expected = [
      ['A0', 'B0'],
      ['A1', 'B1'],
    ];

    expect(actual).toEqual(expected);
  });

  it('withLatestFrom combines sync observable values with latest value of second observable', () => {
    const actual: string[][] = [];

    const a$ = of('A0', 'A1');
    const b$ = of('B0', 'B1', 'B2');

    a$.pipe(withLatestFrom(b$)).subscribe(val => actual.push(val));

    const expected = [
      ['A0', 'B2'],
      ['A1', 'B2'],
    ];

    expect(actual).toEqual(expected);
  });

  it('withLatestFrom combines async observable values with latest value of second observable', done => {
    const actual: string[][] = [];

    const makeInterval = (char: string, dueTime: number, period: number) =>
      timer(dueTime, period).pipe(
        map(val => `${char}${val}`),
        take(3)
      );

    const a$ = makeInterval('A', 0, 2);
    const b$ = makeInterval('B', 3, 1);

    a$.pipe(
      withLatestFrom(b$),
      tap(val => actual.push(val))
    ).subscribe({
      complete: () => {
        const expected = [
          ['A1', 'B0'],
          ['A2', 'B2'],
        ];
        expect(actual).toEqual(expected);
        done();
      },
    });
  });
});
