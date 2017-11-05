// Observables are functions that take an observer.
// Operators are functions that take an observable and return another observable.

/////////////////////////////
// Observables with functions

const observable = (observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
};

function map(observable, fn) {
  return observer => {
    observable({
      next: val => observer.next(fn(val)),
      complete: () => observer.complete()
    });
  };
}

/////////////////////////////
// Observables with classes

class Observable {

  constructor(observableFn) {
    this.subscribe = observableFn;
  }

  map(mapFn) {
    return new Observable(observer => {
      return this.subscribe({
        next: val => observer.next(mapFn(val)),
        complete: () => observer.complete()
      });
    });
  }
}

const values$ = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete(1);
});
