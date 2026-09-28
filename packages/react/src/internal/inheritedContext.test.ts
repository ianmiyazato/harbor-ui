import { afterEach, describe, expect, it } from 'vitest';
import { applyInheritedContext, readInheritedContext } from './inheritedContext';

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

describe('applyInheritedContext', () => {
  it('writes the anchor context onto a portalled node without overriding its own motion', () => {
    document.body.innerHTML =
      '<div data-theme="hc" data-motion="reduced" data-timescale style="--hb-timescale: 5"><button id="a"></button></div><div id="p"></div><div id="q" data-motion="full"></div>';
    const anchor = document.getElementById('a');
    const portal = document.getElementById('p') as HTMLElement;
    applyInheritedContext(portal, anchor);
    expect(portal).toHaveAttribute('data-theme', 'hc');
    expect(portal).toHaveAttribute('data-motion', 'reduced');
    expect(portal).toHaveAttribute('data-timescale', '');
    expect(portal.style.getPropertyValue('--hb-timescale')).toBe('5');
    const own = document.getElementById('q') as HTMLElement;
    applyInheritedContext(own, anchor);
    expect(own).toHaveAttribute('data-motion', 'full');
  });
});
