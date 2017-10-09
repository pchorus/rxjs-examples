const Observable = Rx.Observable;

/**
 * Creates objects from a csv file.
 * First line contains property names.
 * The other lines contain the data.
 *
 * Example:
 * A file containing
 *
 *    prop1;prop2;prop3
 *    1;2;3
 *    A;B;C
 *
 * leads to objects
 *
 *    {
 *      prop1: '1',
 *      prop2: '2',
 *      prop3: '3'
 *    }, {
 *      prop1: 'A',
 *      prop2: 'B',
 *      prop3: 'C'
 *    }
 *
 * @param csv {string} containing the csv input.
 * @returns {*|Observable<any>} emitting the resulting objects one by one.
 */
function createObjectsFromCsv(csv) {
  const csvLines$ = Observable.from(csv.split('\n'));

  // Create Observable for property names.
  let properties$ = csvLines$
    .first()
    .mergeMap(val => val.split(';'));

  // Map each data line of file to an object.
  return csvLines$
    .skip(1)
    .map(val => val.split(';'))
    .mergeMap(val =>
      // Merging property names and values of current line to an object
      Observable.zip(properties$, val)
        .reduce((acc, curr) => Object.assign(acc, { [curr[0]]: curr[1] }), {}));
}

/**
 * Creates objects from a csv file without using RxJS.
 * @param csv {string} containing the csv input.
 * @returns {Array} containing the resulting objects.
 */
function createObjectsFromCsvWithoutRx(csv) {
  const result = [];
  const csvLines = csv.split('\n');

  const propertyNames = csvLines[0].split(';');
  csvLines
    .filter((line, index) => index !== 0)
    .forEach(line => result.push(createObject(propertyNames, line.split(';'))));

  return result;
}

/**
 * Helper method to create an object.
 * @param propNames {Array} containing the property names
 * @param propValues {Array} containing the property values
 * @returns {{}} resulting object
 */
function createObject(propNames, propValues) {
  if (propNames.length === propValues.length) {
    let obj = {};

    for (let i = 0; i < propNames.length; ++i) {
      obj[propNames[i]] = propValues[i];
    }
    return obj;
  }
}
