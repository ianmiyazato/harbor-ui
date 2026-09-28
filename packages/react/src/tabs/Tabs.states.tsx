import type { DocumentedState, PreviewState } from '../internal/states';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

export interface TabsExampleProps {
  /** Which tab is selected. @default 'overview' */
  defaultValue?: string;
  /** Previewed pseudo-state, applied to the "Activity" tab. */
  preview?: PreviewState;
  /** Disable the "Archived" tab. */
  disabledTab?: boolean;
}

/** The example the docs states row, a11y tests and screenshots all render. */
export function TabsExample({
  defaultValue = 'overview',
  preview,
  disabledTab = false,
}: TabsExampleProps) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity" data-preview={preview}>
          Activity
        </Tab>
        <Tab value="archived" disabled={disabledTab}>
          Archived
        </Tab>
      </TabList>
      <TabPanel value="overview">Three open pull requests, one release this week.</TabPanel>
      <TabPanel value="activity">Ada merged “Token contrast report” two hours ago.</TabPanel>
      <TabPanel value="archived">Nothing archived yet.</TabPanel>
    </Tabs>
  );
}

export const tabsStates: DocumentedState<TabsExampleProps>[] = [
  { name: 'default', props: {} },
  { name: 'hover', props: {}, preview: 'hover' },
  { name: 'focus-visible', props: {}, preview: 'focus-visible' },
  { name: 'active', props: {}, preview: 'active' },
  { name: 'selected', props: { defaultValue: 'activity' } },
  { name: 'disabled', props: { disabledTab: true } },
];
