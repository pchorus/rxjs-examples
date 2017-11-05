/* global describe, it */
describe('observable', () => {

  describe('function implementation', () => {

    it('should emit three values', () => {
      const values = [];
      let completed = false;

      observable({
        next: val => values.push(val),
        complete: () => completed = true
      });

      expect(values).toEqual([1, 2, 3]);
      expect(completed).toBeTruthy();
    });

    it('should map three values', () => {
      const values = [];
      let completed = false;

      const mappedObservable = map(observable, x => x * 2);

      mappedObservable({
        next: val => values.push(val),
        complete: () => completed = true
      });

      expect(values).toEqual([2, 4, 6]);
      expect(completed).toBeTruthy();
    });

  });

  describe('class implementation', () => {

    it('should emit three values', () => {
      const values = [];
      let completed = false;

      values$.subscribe({
        next: val => values.push(val),
        complete: () => completed = true
      });

      expect(values).toEqual([1, 2, 3]);
      expect(completed).toBeTruthy();
    });

    it('should map three values', () => {
      const values = [];
      let completed = false;

      values$
        .map(x => x * 2)
        .subscribe({
          next: val => values.push(val),
          complete: () => completed = true
        });

      expect(values).toEqual([2, 4, 6]);
      expect(completed).toBeTruthy();
    });

    it('should emit interval values', (done) => {
      const values = [];

      const subscription = Observable.interval(500)
        .subscribe({
          next: val => {
            values.push(val);
            if (val === 3) {
              subscription.unsubscribe();
              expect(values).toEqual([1, 2, 3]);
              done();
            }
          }
        });
    })

  });
});