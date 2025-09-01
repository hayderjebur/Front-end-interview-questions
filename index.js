// classNames('foo', 'bar'); // 'foo bar'
// classNames('foo', { bar: true }); // 'foo bar'
// classNames({ 'foo-bar': true }); // 'foo-bar'
// classNames({ 'foo-bar': false }); // ''
// classNames({ foo: true }, { bar: true }); // 'foo bar'
// classNames({ foo: true, bar: false, qux: true }); // 'foo qux'
// classNames('a', ['b', { c: true, d: false }]); // 'a b c'
// classNames(
//   'foo',
//   { bar: true, duck: false },
//   'baz',
//   { quux: true }
// ); // 'foo bar baz quux'
// classNames(null, false, 'bar', undefined, { baz: null }, ''); // 'bar'

export default function classNames(...args) {
  const classes = [];

  args.forEach((arg) => {
    // Ignore falsey values.
    if (!arg) {
      return;
    }

    const argType = typeof arg;

    // Handle string and numbers.
    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
      return;
    }

    // Handle arrays.
    if (Array.isArray(arg)) {
      classes.push(classNames(...arg));
      return;
    }

    // Handle objects.
    if (argType === 'object') {
      for (const key in arg) {
        // Only process non-inherited keys.
        if (Object.hasOwn(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
      return;
    }
  });

  return classes.join(' ');
}
// -----------------------------------------------------------------------------
// Promisify Any Function | Solution | Facebook
function promisify(callback) {
  // The promisify function takes a callback-based function as input
  return function (...args) {
    // It returns a new function that, when called, returns a Promise
    return new Promise((resolve, reject) => {
      // This callback handles the asynchronous result of the original function
      function customCallback(error, result) {
        if (error) {
          // If the original function calls the callback with an error, reject the Promise
          reject(error);
        } else {
          // If there's no error, resolve the Promise with the result
          resolve(result);
        }
      }

      // Invoke the original function with the provided arguments and the custom callback
      // The 'callback.call(this, ...args, customCallback)' ensures that 'this' context is preserved
      // and the customCallback is passed as the last argument to the original function
      callback.call(this, ...args, customCallback);
    });
  };
}
//-----------------------------------------------------------------------------
//  Auto Suggest Search List
// Handler for input changes to implement autocomplete functionality
const onChangeHandler = (e) => {
  if (!input || !resultsContainer) return;

  // Clear previous suggestions
  resultsContainer.innerHTML = '';

  // Get the current input value and convert it to lowercase for case-insensitive comparison
  const inputValue = e.target.value.toLowerCase();

  // Use the fetchResults function to get the full list of names and then filter it
  // based on the current input value
  const filteredResults = fetchResults(api).filter((name) =>
    name.toLowerCase().includes(inputValue)
  );

  // Iterate over the filtered results to create and display suggestion elements
  filteredResults.forEach((name) => {
    // Create a new div element for each matching result
    const resultElement = document.createElement('div');
    // Set the text content of the div to the name
    resultElement.textContent = name;
    // Append the div to the results container, making it visible as a suggestion
    resultsContainer.appendChild(resultElement);

    // Add an event listener to each suggestion for click interaction
    resultElement.addEventListener('click', () => {
      // On click, update the input field with the selected name
      input.value = name;
      // Clear the suggestions
      resultsContainer.innerHTML = '';
    });
  });
};
