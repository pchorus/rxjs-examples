/**
 * Create observable from an array.
 * @returns {Observable<any>}
 */
function fromArray() {
  const array = [1, 2, 3, 4, 5];
  return Rx.Observable.from(array);
}

/**
 * Create observable from range of sequential numbers.
 * @returns {Observable<number>}
 */
function fromRange() {
  return Rx.Observable.range(10, 3);
}

/**
 * Create observable from a single value.
 * @returns {Observable<any>}
 */
function fromSingleValue() {
  const obj = {
    firstname: 'John',
    lastname: 'Doe'
  };
  return Rx.Observable.of(obj);
}

/**
 * Create observable from button click event.
 * @param button button for which click events should emit values.
 * @returns {Observable<any>}
 */
function fromClickEvent(button) {
  return Rx.Observable.fromEvent(button, 'click');
}

/**
 *
 * @param input
 * @returns {*|Observable<any>}
 */
function fromInputEvent(input) {
  return Rx.Observable.fromEvent(input, 'input');
}
