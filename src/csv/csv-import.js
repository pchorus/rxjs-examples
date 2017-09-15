const Observable = Rx.Observable;

function createObjectsFromCsvByObservable(csv) {
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
      Observable.zip(properties$, val)
        .reduce((acc, curr) => Object.assign(acc, { [curr[0]]: curr[1] }), {}));
}

function createObjectsFromCsvByLoop(csv) {
  const result = [];
  const csvLines = csv.split('\n');

  const propertyNames = csvLines[0].split(';');

  for (let i = 1; i < csvLines.length; ++i) {
    const propertyValues = csvLines[i].split(';');
    result.push(createObject(propertyNames, propertyValues));
  }

  return result;
}

function createObject(propNames, propValues) {
  if (propNames.length === propValues.length) {
    let obj = {};

    for (let i = 0; i < propNames.length; ++i) {
      obj[propNames[i]] = propValues[i];
    }
    return obj;
  }
}
