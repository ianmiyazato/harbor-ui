import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import type { TabsProps } from './Tabs';

function Example(props: Omit<TabsProps, 'children'>) {
  return (
    <Tabs defaultValue="overview" {...props}>
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="archived" disabled>
          Archived
        </Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel</TabPanel>
      <TabPanel value="activity">Activity panel</TabPanel>
      <TabPanel value="archived">Archived panel</TabPanel>
      <TabPanel value="settings">Settings panel</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('exposes a named tablist, tabs and the active tabpanel', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview panel');
  });

  it('switches panels on click', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('moves with arrow keys, skips disabled tabs, wraps, and supports Home/End', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('moves focus from the active tab into the panel with Tab', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('follows value when controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Example value="overview" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(onValueChange).toHaveBeenCalledWith('settings');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    rerender(<Example value="settings" onValueChange={onValueChange} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings panel');
  });

  describe('indicator', () => {
    const geometry: Record<string, [number, number]> = {
      Overview: [0, 96],
      Activity: [96, 88],
      Archived: [184, 92],
      Settings: [276, 90],
    };
    beforeEach(() => {
      vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        return geometry[this.textContent ?? '']?.[0] ?? 0;
      });
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        if (this.getAttribute('role') === 'tablist') return 400;
        return geometry[this.textContent ?? '']?.[1] ?? 0;
      });
    });
    afterEach(() => vi.restoreAllMocks());

    it('slides under the active tab using transform-only custom properties', async () => {
      const user = userEvent.setup();
      render(<Example />);
      const list = screen.getByRole('tablist');
      expect(list).toHaveAttribute('data-indicator-ready');
      expect(list.style.getPropertyValue('--hb-tab-x')).toBe('0px');
      expect(list.style.getPropertyValue('--hb-tab-scale')).toBe('0.24');
      await user.click(screen.getByRole('tab', { name: 'Activity' }));
      expect(list.style.getPropertyValue('--hb-tab-x')).toBe('96px');
      expect(list.style.getPropertyValue('--hb-tab-scale')).toBe('0.22');
    });
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    const { container } = render(<Example />);
    expect(container.firstElementChild).toHaveAttribute('data-motion', 'reduced');
  });
});
