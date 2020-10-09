import { from, fromEvent, of, range } from 'rxjs';

describe('create observable', () => {
  it('from array should work', () => {
    let result: number[] = [];
    from([1, 2, 3, 4, 5]).subscribe(val => result.push(val));
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('from range should work', () => {
    let result: number[] = [];
    range(10, 3).subscribe(val => result.push(val));
    expect(result).toEqual([10, 11, 12]);
  });

  it('from single value should work', () => {
    let result: any[] = [];
    const obj = {
      firstname: 'John',
      lastname: 'Doe'
    };
    of(obj).subscribe(val => result.push(val));
    expect(result).toEqual([{
      firstname: 'John',
      lastname: 'Doe'
    }]);
  });

  it('from click event should work', () => {
    const button = document.createElement('BUTTON');

    let clickCount = 0;
    fromEvent(button, 'click').subscribe(() => {
      ++clickCount;
    });

    button.click();
    button.click();

    expect(clickCount).toEqual(2);
  });

  // xit('from debounced input event should work', () => {
  //   const input = document.createElement('INPUT') as HTMLInputElement;
  //   let inputValue: any;
  //
  //   fromEvent(input, 'input').subscribe(val => {
  //     inputValue = val;
  //   });
  //
  //   input.keys('abc');
  //
  //   expect(inputValue).toEqual('abc');
  // });

});
