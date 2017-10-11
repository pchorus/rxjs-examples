fromInterval();
fromButtonClick();
fromInputWithDebounceTime();

/**
 * Create observable from interval.
 */
function fromInterval() {
  let subscription;

  document.getElementById('subscribe-interval').onclick = () => {
    subscription = Rx.Observable.interval(1000)
      .subscribe(val => {
        document.getElementById('interval-value').textContent = val;
      });
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

    subscription = Rx.Observable.fromEvent(button, 'click')
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

    subscription = Rx.Observable.fromEvent(input, 'input')
      .map(event => event.target.value)
      .debounceTime(500)
      .subscribe(val => {
        document.getElementById('input-value').textContent = val;
      });
  };

  document.getElementById('unsubscribe-input').onclick = () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}
