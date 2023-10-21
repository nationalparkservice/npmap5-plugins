import { HelperOptions } from "handlebars";

/**
 * Generates a nested HTML list (ul or ol) from a JSON string or object.
 *
 * @param input - The JSON string or object to convert to a list.
 * @param options - The Handlebars options object. If options.hash.ul is true, all lists will be unordered.
 * @returns {HTMLElement | undefined} - The root element of the generated HTML list, or undefined if the input is null, undefined, or an empty string.
 */
export default function jsonAsList(input: string | any, options: HelperOptions): HTMLElement | undefined {
  // Return undefined if the input is null, undefined, or an empty string.
  if (input === null || input === undefined || input === '') {
    return undefined;
  }

  // If the input is not already an object, attempt to parse it as JSON.
  let obj = typeof input === 'object' ? input : {};
  try {
    if (typeof input !== 'object') {
      obj = JSON.parse(input);
    }
  } catch (e) {
    obj = {};
  }

  // Create a new ordered list (ol) if the input is an array and options.hash.ul isn't true; otherwise create an unordered list (ul).
  const list = document.createElement(Array.isArray(obj) && !options.hash.ul ? 'ol' : 'ul');

  // Iterate over the key-value pairs of the input object.
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const li = document.createElement('li');

    // Don't include the key in the list item if the input object is an array, since arrays are inherently ordered.
    const keyString = Array.isArray(obj) ? '' : `${key}: `;

    // If the value is a non-null object, recursively generate a nested list for it.
    if (typeof value === 'object') {
      li.innerHTML = keyString;
      let item = jsonAsList(value, options);
      if (item) li.appendChild(item);
    } else {
      // If the value is not an object, include it directly in the list item.
      li.innerHTML = `${keyString}${value}`;
    }

    // Add the list item to the list.
    list.appendChild(li);
  });

  return list.children.length > 0 ? list : undefined;
}