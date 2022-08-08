import './button.css';

function ElementCreator(type:string, text?:string, classes?:string[], parent?:string|HTMLElement,
  inputtype?:string, data?:string[]):HTMLElement {
  const element = document.createElement(type);
  if (classes !== undefined) { classes?.forEach((e) => element.classList.add(e)); }
  element.innerHTML = text || '';
  if (data !== undefined && data[0] !== undefined && data[1] !== undefined) { element.setAttribute(`data-${data[0]}`, data[1]); }
  if (inputtype) {
    element.setAttribute('type', inputtype);
  }
  if (parent && typeof (parent) === 'string') {
    document.querySelector(parent)?.appendChild(element);
  } else if (parent && parent instanceof HTMLElement) {
    parent.appendChild(element);
  }

  return element;
}

export default ElementCreator;
