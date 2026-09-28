/**
 * Editorial content for each component page. Everything numeric (contrast, target size, props,
 * tokens) is looked up at build time from test data and the TypeScript source, never typed here.
 */
export interface ComponentDoc {
  slug: string;
  name: string;
  /** The one-line usage rule at the top of the page. */
  rule: string;
  summary: string;
  /** Built on a Radix primitive. */
  radix?: boolean;
  /** Contrast pair the fact reports (lowest ratio across themes), or a note when none applies. */
  contrast: { fg: string; bg: string; label: string } | { note: string };
  /** Target size fact: a size token and the selector the e2e test measures, or a note. */
  target: { token: string; selector: string; label: string } | { note: string };
  snippet: string;
}

export const componentDocs: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    rule: 'Use one primary per view.',
    summary: 'Four variants, three sizes and a loading state that never changes the width.',
    contrast: { fg: 'color.text.on-action', bg: 'color.action.primary', label: 'Label on primary' },
    target: {
      token: 'size.control.md',
      selector: '[data-testid="loading-demo"]',
      label: 'Default height',
    },
    snippet: `import { Button } from '@ianmiyazato/harbor-react';

<Button variant="primary" loading={saving} onClick={save}>
  Save changes
</Button>`,
  },
  {
    slug: 'icon-button',
    name: 'IconButton',
    rule: 'Icon-only actions still need a name: aria-label is required by the type.',
    summary:
      'A square Button for toolbars. Pair it with a Tooltip so sighted users get the name too.',
    contrast: { fg: 'color.text.on-action', bg: 'color.action.primary', label: 'Icon on primary' },
    target: {
      token: 'size.control.md',
      selector: '[data-icon-only]',
      label: 'Square, default size',
    },
    snippet: `import { IconButton, Tooltip } from '@ianmiyazato/harbor-react';

<Tooltip content="Copy link">
  <IconButton aria-label="Copy link" icon={<LinkIcon />} variant="ghost" />
</Tooltip>`,
  },
  {
    slug: 'input',
    name: 'Input',
    rule: 'Always a visible label. Placeholders are examples, not labels.',
    summary: 'Label, hint, error and an optional character count, wired with aria-describedby.',
    contrast: { fg: 'color.border.strong', bg: 'color.surface.raised', label: 'Field boundary' },
    target: { token: 'size.control.md', selector: 'input', label: 'Field height' },
    snippet: `import { Input } from '@ianmiyazato/harbor-react';

<Input
  label="Work email"
  hint="We only use it for sign-in."
  error={invalid ? 'Enter a full email address.' : undefined}
  type="email"
/>`,
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    rule: 'For independent choices that are submitted later. Settings that apply at once use Switch.',
    summary: 'A native checkbox under a token-styled box, with a mixed state for “select all”.',
    contrast: {
      fg: 'color.control.checked',
      bg: 'color.surface.default',
      label: 'Checked box on page',
    },
    target: { token: 'size.target.min', selector: 'label', label: 'Whole row is the target' },
    snippet: `import { Checkbox } from '@ianmiyazato/harbor-react';

<Checkbox
  label="Select all"
  checked={some ? 'indeterminate' : all}
  onCheckedChange={toggleAll}
/>`,
  },
  {
    slug: 'switch',
    name: 'Switch',
    rule: 'For settings that apply immediately. A switch never needs a Save button.',
    summary:
      'A role="switch" button with a real label and a thumb that moves on the snappy spring.',
    contrast: {
      fg: 'color.control.thumb',
      bg: 'color.control.track',
      label: 'Thumb on track (off)',
    },
    target: { token: 'size.icon.lg', selector: '[role="switch"]', label: '42 × 24 track' },
    snippet: `import { Switch } from '@ianmiyazato/harbor-react';

<Switch
  label="Autosave drafts"
  description="Saves every 30 seconds."
  checked={autosave}
  onCheckedChange={setAutosave}
/>`,
  },
  {
    slug: 'badge',
    name: 'Badge',
    rule: 'Short status only, and never color alone: the text carries the meaning.',
    summary:
      'Five tones, each a text/background pair in the contrast matrix, outlined in high contrast.',
    contrast: {
      fg: 'color.status.success.fg',
      bg: 'color.status.success.bg',
      label: 'Success text on fill',
    },
    target: { note: 'Not interactive, so no target size applies.' },
    snippet: `import { Badge } from '@ianmiyazato/harbor-react';

<Badge tone="success" dot>Paid</Badge>`,
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    rule: 'Match the final layout exactly, so nothing shifts when the content arrives.',
    summary:
      'Text, rectangle and circle placeholders with a transform-only shimmer that stops for reduced motion.',
    contrast: {
      note: 'Decorative and hidden from assistive tech; the loading region carries aria-busy.',
    },
    target: { note: 'Not interactive, so no target size applies.' },
    snippet: `import { Skeleton } from '@ianmiyazato/harbor-react';

<section aria-busy={loading} aria-label="Profile">
  {loading ? <Skeleton shape="text" lines={3} /> : <Bio />}
</section>`,
  },
  {
    slug: 'select',
    name: 'Select',
    rule: 'One choice from roughly 5–15 known options. Fewer than five: show them all.',
    summary:
      'Radix Select with label, hint and error: typeahead, keyboard and screen-reader support.',
    radix: true,
    contrast: {
      fg: 'color.text.default',
      bg: 'color.surface.overlay',
      label: 'Option text in the menu',
    },
    target: { token: 'size.control.md', selector: '[role="combobox"]', label: 'Trigger height' },
    snippet: `import { Select } from '@ianmiyazato/harbor-react';

<Select
  label="Office"
  placeholder="Choose an office"
  options={offices}
  value={office}
  onValueChange={setOffice}
/>`,
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    rule: 'Switch between views of the same thing. Never use tabs for sequential steps.',
    summary:
      'Radix Tabs with automatic activation and one indicator that slides on transform only.',
    radix: true,
    contrast: { fg: 'color.text.muted', bg: 'color.surface.default', label: 'Inactive tab label' },
    target: { token: 'size.control.md', selector: '[role="tab"]', label: 'Tab height' },
    snippet: `import { Tab, TabList, TabPanel, Tabs } from '@ianmiyazato/harbor-react';

<Tabs defaultValue="overview">
  <TabList aria-label="Project">
    <Tab value="overview">Overview</Tab>
    <Tab value="activity">Activity</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
</Tabs>`,
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    rule: 'Interrupt only for decisions that block progress, with a clear title and a way out.',
    summary:
      'Radix Dialog: focus moves in and is trapped, Escape closes, focus returns, scroll locks.',
    radix: true,
    contrast: {
      fg: 'color.text.muted',
      bg: 'color.surface.overlay',
      label: 'Description in the dialog',
    },
    target: { token: 'size.control.md', selector: 'button', label: 'Trigger and footer actions' },
    snippet: `import { Button, Dialog, DialogClose } from '@ianmiyazato/harbor-react';

<Dialog
  title="Delete “Q3 launch”?"
  description="This removes the project for everyone."
  trigger={<Button variant="danger">Delete project</Button>}
  footer={
    <>
      <DialogClose asChild><Button>Cancel</Button></DialogClose>
      <Button variant="danger" onClick={remove}>Delete</Button>
    </>
  }
/>`,
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    rule: 'Supplementary hints only. Never put essential or interactive content in a tooltip.',
    summary: 'Radix Tooltip: opens on hover and focus, dismisses with Escape, stays while hovered.',
    radix: true,
    contrast: { fg: 'color.text.inverse', bg: 'color.surface.inverse', label: 'Tooltip text' },
    target: { token: 'size.control.md', selector: '[data-icon-only]', label: 'Trigger size' },
    snippet: `import { IconButton, Tooltip } from '@ianmiyazato/harbor-react';

<Tooltip content="Share">
  <IconButton aria-label="Share" icon={<ShareIcon />} />
</Tooltip>`,
  },
  {
    slug: 'toast',
    name: 'Toast',
    rule: 'Confirm what just happened and offer an undo. Errors that need action belong inline.',
    summary:
      'Queued Radix toasts that announce politely, pause on hover and focus, and support undo.',
    radix: true,
    contrast: { fg: 'color.text.muted', bg: 'color.surface.overlay', label: 'Description text' },
    target: { token: 'size.control.sm', selector: 'button', label: 'Undo and dismiss controls' },
    snippet: `import { ToastProvider, useToast } from '@ianmiyazato/harbor-react';

const { toast } = useToast();
toast({
  title: 'Message archived',
  action: { label: 'Undo', altText: 'Undo archive', onAction: restore },
});`,
  },
];

export const docFor = (slug: string) => {
  const doc = componentDocs.find((d) => d.slug === slug);
  if (!doc) throw new Error(`No component doc for ${slug}`);
  return doc;
};
