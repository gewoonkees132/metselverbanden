// Small helpers to build the page's elements.

const SVG_NS = 'http://www.w3.org/2000/svg';

function apply(node, attrs, children) {
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.setAttribute('class', value);
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function el(tag, attrs, ...children) {
  return apply(document.createElement(tag), attrs, children);
}

export function svg(tag, attrs, ...children) {
  return apply(document.createElementNS(SVG_NS, tag), attrs, children);
}
