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
import { from, zip } from 'rxjs';
import { first, map, mergeMap, reduce, skip } from 'rxjs/operators';

export function createObjectsFromCsv(csv: string) {
  const csvLines$ = from(csv.split('\n'));

  // Create Observable for property names.
  let properties$ = csvLines$.pipe(
    first(),
    mergeMap(val => from(val.split(';')))
  );

  // Map each data line of file to an object.
  return csvLines$.pipe(
    skip(1),
    map(val => val.split(';')),
    mergeMap(val =>
      // Merging property names and values of current line to an object
      zip(properties$, from(val)).pipe(
        reduce(
          (acc, [currentLeft, currentRight]) =>
            Object.assign(acc, { [currentLeft]: currentRight }),
          {}
        )
      )
    )
  );
}

/**
 * Creates objects from a csv file without using RxJS.
 * @param csv {string} containing the csv input.
 * @returns {Array} containing the resulting objects.
 */
export function createObjectsFromCsvWithoutRx(csv: string) {
  const result: any = [];
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
function createObject(propNames: string[], propValues: string[]) {
  if (propNames.length === propValues.length) {
    let obj: any = {};

    for (let i = 0; i < propNames.length; ++i) {
      obj[propNames[i]] = propValues[i];
    }
    return obj;
  }
}
