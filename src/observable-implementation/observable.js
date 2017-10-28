// Observables are functions that take an observer
// Operators are functions that take an observable and return another observable

// ---1---2---3|
// map(val => val * 2)
// ---2---4---6|

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

observable({
  next: val => console.log(val),
  complete: () => console.log('complete')
});

const mappedObservable = map(observable, x => x * 2);

mappedObservable({
  next: val => console.log(val),
  complete: () => console.log('complete')
});

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

values$.subscribe({
  next: val => console.log(val),
  complete: () => console.log('complete')
});

const mappedValues$ = values$.map(x => x * 2);

mappedValues$.subscribe({
  next: val => console.log(val),
  complete: () => console.log('complete')
});
