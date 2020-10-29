import { concat, merge, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  concatAll,
  concatMap,
  exhaust,
  map,
  mergeAll,
  mergeMap,
  toArray,
} from 'rxjs/operators';

const createTestScheduler = () =>
  new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

describe('flattening operator marble test', () => {
  it('merge combines values of multiple streams', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----b------(c|)', { a: 'A0', b: 'A1', c: 'A2' });
      const b$ = cold(' -a-b-----(c|)', { a: 'B0', b: 'B1', c: 'B2' });
      const expected = 'uv-w--x--y---(z|)';
      const values = {
        u: 'A0',
        v: 'B0',
        w: 'B1',
        x: 'A1',
        y: 'B2',
        z: 'A2',
      };

      expectObservable(merge(a$, b$)).toBe(expected, values);
      expectObservable(of(a$, b$).pipe(mergeAll())).toBe(expected, values);
    });
  });

  it('mergeMap emits values of second stream', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----b-----(c|)');
      const b$ = cold(' x---y---(z|)', { x: 1, y: 2, z: 3 });
      //                      x---y---(z|)
      //                            x---y---(z|)
      const expected = 'a---b-c-d-e-f-g-h---(i|)';
      const values = {
        a: 'a1',
        b: 'a2',
        c: 'b1',
        d: 'a3',
        e: 'b2',
        f: 'c1',
        g: 'b3',
        h: 'c2',
        i: 'c3',
      };

      expectObservable(
        a$.pipe(mergeMap(aVal => b$.pipe(map(bVal => aVal + bVal))))
      ).toBe(expected, values);
    });
  });

  it('concat combines values of multiple streams', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----b------(c|)', { a: 'A0', b: 'A1', c: 'A2' });
      const b$ = cold(' -a-b-----(c|)', { a: 'B0', b: 'B1', c: 'B2' });
      const expected = 'u-----v------wx-y-----(z|)';
      const values = {
        u: 'A0',
        v: 'A1',
        w: 'A2',
        x: 'B0',
        y: 'B1',
        z: 'B2',
      };

      expectObservable(concat(a$, b$)).toBe(expected, values);
      expectObservable(of(a$, b$).pipe(concatAll())).toBe(expected, values);
    });
  });

  it('concatMap emits values of second stream', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable }) => {
      const a$ = cold(' a-----b-----(c|)');
      const b$ = cold(' x---y---(z|)', { x: 1, y: 2, z: 3 });
      //                        x---y---(z|)
      //                                x---y---(z|)
      const expected = 'a---b---(cd)e---(fg)h---(i|)';
      const values = {
        a: 'a1',
        b: 'a2',
        c: 'a3',
        d: 'b1',
        e: 'b2',
        f: 'b3',
        g: 'c1',
        h: 'c2',
        i: 'c3',
      };

      expectObservable(
        a$.pipe(concatMap(aVal => b$.pipe(map(bVal => aVal + bVal))))
      ).toBe(expected, values);
    });
  });

  it('exhaust combines values of multiple streams', () => {
    const testScheduler = createTestScheduler();
    testScheduler.run(({ cold, expectObservable, hot }) => {
      const a$ = cold(' a-b------(c|)', { a: 'A0', b: 'A1', c: 'A2' });
      const b$ = cold('      a-b-----(c|)', { a: 'B0', b: 'B1', c: 'B2' });
      const c$ = cold('               a---b-(c|)', {
        a: 'C0',
        b: 'C1',
        c: 'C2',
      });
      const e1 = hot('  x----y--------(z|)', { x: a$, y: b$, z: c$ });
      const expected = 'u-v------w----x---y-(z|)';
      const values = {
        u: 'A0',
        v: 'A1',
        w: 'A2',
        x: 'C0',
        y: 'C1',
        z: 'C2',
      };

      expectObservable(e1.pipe(exhaust())).toBe(expected, values);
    });
  });
});

describe('flattening operator test', () => {
  it('mergeMap emits values of second stream', () => {
    let result: string[] = [];
    const a$ = of('a', 'b', 'c');
    a$.pipe(
      mergeMap(aVal => of(aVal + '1', aVal + '2', aVal + '3')),
      toArray()
    ).subscribe(values => (result = values));

    expect(result).toEqual([
      'a1',
      'a2',
      'a3',
      'b1',
      'b2',
      'b3',
      'c1',
      'c2',
      'c3',
    ]);
  });
});
