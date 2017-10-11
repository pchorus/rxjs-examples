/* global describe, it */
describe('create observable', () => {
  it('from array should work', () => {
    let result = [];
    fromArray().subscribe(val => result.push(val));
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('from range should work', () => {
    let result = [];
    fromRange().subscribe(val => result.push(val));
    expect(result).toEqual([10, 11, 12]);
  });

  it('from single value should work', () => {
    let result = [];
    fromSingleValue().subscribe(val => result.push(val));
    expect(result).toEqual([{
      firstname: 'John',
      lastname: 'Doe'
    }]);
  });

  it('from click event should work', () => {
    const button = document.createElement('BUTTON');

    let clickCount = 0;
    fromClickEvent(button).subscribe(() => {
      ++clickCount;
    });

    button.click();
    button.click();

    expect(clickCount).toEqual(2);
  });

  xit('from debounced input event should work', () => {
    const input = document.createElement('INPUT');
    let inputValue = '';

    fromInputEvent(input).subscribe(val => {
      inputValue = val;
    });

    input.keys('abc');

    expect(inputValue).toEqual('abc');
  });

});
