import { combineLatest, forkJoin, interval, of, timer, zip } from 'rxjs';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

const createTestScheduler = () =>
  new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

describe('combination operator marble test', () => {
  it('combineLatest combines latest values of multiple streams', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----b------(c|)', { a: 'A0', b: 'A1', c: 'A2' });
      const b$ = cold(' -a-b-----(c|)', { a: 'B0', b: 'B1', c: 'B2' });
      const expected = '-v-w--x--y---(z|)';
      const values = {
        v: ['A0', 'B0'],
        w: ['A0', 'B1'],
        x: ['A1', 'B1'],
        y: ['A1', 'B2'],
        z: ['A2', 'B2'],
      };

      expectObservable(combineLatest([a$, b$])).toBe(expected, values);
    });
  });

  it('combineLatest for synchronous observables combines latest values of multiple streams', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-b-(c|)', { a: 'A0', b: 'A1', c: 'A2' });
      const b$ = cold(' ---------a---b---(c|)', {
        a: 'B0',
        b: 'B1',
        c: 'B2',
      });
      const expected = '---------x---y---(z|)';
      const values = {
        x: ['A2', 'B0'],
        y: ['A2', 'B1'],
        z: ['A2', 'B2'],
      };
      expectObservable(combineLatest([a$, b$])).toBe(expected, values);
    });
  });

  it('forkJoin combines last values of multiple streams', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-b---(c|)');
      const b$ = cold(' x--y-(z|)');
      const expected = '------(r|)';
      const values = {
        r: ['c', 'z'],
      };
      expectObservable(forkJoin([a$, b$])).toBe(expected, values);
    });
  });

  it('zip combines values of multiple streams as long as every stream has values and no stream is completed', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----(b|)');
      const b$ = cold(' -i-j-(k|)');
      const expected = '-x----(y|)';
      const values = {
        x: ['a', 'i'],
        y: ['b', 'j'],
      };
      expectObservable(zip(a$, b$)).toBe(expected, values);
    });
  });

  it('withLatestFrom combines observable values with latest value of second observable', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----b---c-(d|)');
      const b$ = cold(' --i-j---(k|)');
      const expected = '------x---y-(z|)';
      const values = {
        x: ['b', 'j'],
        y: ['c', 'k'],
        z: ['d', 'k'],
      };
      expectObservable(a$.pipe(withLatestFrom(b$))).toBe(expected, values);
    });
  });
});

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

    const a$ = makeInterval('A', 0, 30);
    const b$ = makeInterval('B', 20, 20);

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
