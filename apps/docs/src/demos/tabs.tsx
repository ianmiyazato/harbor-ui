import { Tab, TabList, TabPanel, Tabs } from '@ianmiyazato/harbor-react';
import s from './demo.module.css';

export function Playground() {
  return (
    <Tabs defaultValue="overview">
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="billing" disabled>
          Billing
        </Tab>
      </TabList>
      <TabPanel value="overview">Three open pull requests and one release this week.</TabPanel>
      <TabPanel value="activity">Ada merged “Token contrast report” two hours ago.</TabPanel>
      <TabPanel value="settings">Visibility: public. Default branch: main.</TabPanel>
      <TabPanel value="billing">Billing is managed by your organization.</TabPanel>
    </Tabs>
  );
}

export const Do = () => (
  <Tabs defaultValue="a">
    <TabList aria-label="Views">
      <Tab value="a">Overview</Tab>
      <Tab value="b">Activity</Tab>
    </TabList>
    <TabPanel value="a" className={s.caption}>
      Two views of one project.
    </TabPanel>
    <TabPanel value="b" />
  </Tabs>
);

export const Dont = () => (
  <Tabs defaultValue="a">
    <TabList aria-label="Checkout">
      <Tab value="a">1. Cart</Tab>
      <Tab value="b">2. Shipping</Tab>
      <Tab value="c">3. Payment</Tab>
    </TabList>
    <TabPanel value="a" className={s.caption}>
      Steps in a sequence.
    </TabPanel>
    <TabPanel value="b" />
    <TabPanel value="c" />
  </Tabs>
);
