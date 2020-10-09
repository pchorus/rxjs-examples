const { fromEvent, interval } = rxjs;
const { debounceTime, switchMap, takeUntil } = rxjs.operators;


fromInterval();
fromButtonClick();
fromInputWithDebounceTime();
dragAndDrop();

/**
 * Create observable from interval.
 */
function fromInterval() {
  let subscription;

  document.getElementById('subscribe-interval').onclick = () => {
    subscription = interval(1000)
      .subscribe(val => document.getElementById('interval-value').textContent = val);
  };

  document.getElementById('unsubscribe-interval').onclick = () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}

/**
 * Create observable from button click event.
 */
function fromButtonClick() {
  let clickCount = 0;
  let subscription;

  // Create hot observable from button click.
  document.getElementById('subscribe-click').onclick = () => {
    const button = document.getElementById('button');

    subscription = fromEvent(button, 'click')
      .subscribe(() => {
        ++clickCount;
        document.getElementById('click-count').textContent = clickCount;
      });
  };

  document.getElementById('unsubscribe-click').onclick = () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}

/**
 * Create observable from key inputs in text input with a debounce time.
 */
function fromInputWithDebounceTime() {
  let subscription;

  // Create hot observable from button click.
  document.getElementById('subscribe-input').onclick = () => {
    const input = document.getElementById('input');

    subscription = fromEvent(input, 'input').pipe(
      rxjs.operators.map(event => {
        console.log(event);
        return event.target.value;
      }),
      debounceTime(500)
    ).subscribe(val => document.getElementById('input-value').textContent = val);
  };

  document.getElementById('unsubscribe-input').onclick = () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}

/**
 * Drag & Drop
 */
function dragAndDrop() {
  const elem = document.querySelector( "#dragdrop" );

  const dragStart$ = fromEvent(elem, 'mousedown');
  const dragMove$ = fromEvent(document, 'mousemove');
  const dragEnd$ = fromEvent(document, 'mouseup');

  dragStart$.pipe(
    switchMap(() => dragMove$.pipe(takeUntil(dragEnd$)))
  ).subscribe(event => {
      const { x, y } = elem.getBoundingClientRect();
      elem.style.left = (x + event.movementX) + 'px';
      elem.style.top = (y + event.movementY) + 'px';
    });
}
