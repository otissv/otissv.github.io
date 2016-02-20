'us strict';

module.exports = function addClass (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }

  return element;
}
