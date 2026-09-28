import { afterEach, describe, expect, it } from 'vitest';
import { readInheritedContext } from './inheritedContext';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('readInheritedContext', () => {
  it('returns nothing without an anchor or settings', () => {
    expect(readInheritedContext(null)).toEqual({});
    document.body.innerHTML = '<button id="a"></button>';
    expect(readInheritedContext(document.getElementById('a'))).toEqual({});
  });

  it('copies the nearest theme and motion preference', () => {
    document.body.innerHTML =
      '<div data-theme="light"><div data-theme="dark" data-motion="reduced"><button id="a"></button></div></div>';
    expect(readInheritedContext(document.getElementById('a'))).toEqual({
      'data-theme': 'dark',
      'data-motion': 'reduced',
    });
  });

  it('copies a scoped slow-motion timescale', () => {
    document.body.innerHTML =
      '<div data-timescale style="--hb-timescale: 5"><button id="a"></button></div>';
    expect(readInheritedContext(document.getElementById('a'))).toEqual({
      'data-timescale': '',
      style: { '--hb-timescale': '5' },
    });
  });
});
