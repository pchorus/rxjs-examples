import { EMPTY, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

describe('error handling tests', () => {
  it('should correctly execute catchError operator on throwError', () => {
    of(1, 2)
      .pipe(
        mergeMap(value =>
          value >= 2
            ? throwError(() => new Error('Value is less than 2!'))
            : of(value)
        ),
        catchError(err => {
          console.log('Error catched!', err);
          return EMPTY;
        })
      )
      .subscribe(console.log);
  });

  it('should correctly execute catchError operator on plain throw Error within operator', () => {
    of(1, 2)
      .pipe(
        map(value => {
          if (value >= 2) {
            throw new Error('Value is less than 2!');
          }
          return value;
        }),
        catchError(err => {
          console.log('Error catched!', err);
          return EMPTY;
        })
      )
      .subscribe(console.log);
  });
});
