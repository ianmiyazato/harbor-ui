import { Badge, Button, Switch } from '@ianmiyazato/harbor-react';

/** Static Harbor components for the home tiles: real markup and CSS, no hydration. */
export function ButtonStates() {
  return (
    <div className="specimen-grid">
      {(
        [
          ['default', {}],
          ['hover', { 'data-preview': 'hover' }],
          ['focus', { 'data-preview': 'focus-visible' }],
          ['loading', { loading: true }],
        ] as const
      ).map(([name, props]) => (
        <div key={name} className="specimen">
          <span className="specimen-label">{name}</span>
          <Button variant="primary" size="sm" {...props}>
            Publish
          </Button>
        </div>
      ))}
    </div>
  );
}

export function ThemeCard() {
  return (
    <div className="mini-card">
      <div className="mini-row">
        <strong>Invoice #1042</strong>
        <Badge tone="success" dot>
          Paid
        </Badge>
      </div>
      <p className="mini-muted">Settled on 12 Sep · 3 items</p>
      <div className="mini-row">
        <Switch label="Email receipt" defaultChecked />
      </div>
      <div className="mini-row">
        <Button size="sm">Download</Button>
        <Button size="sm" variant="primary">
          Send
        </Button>
      </div>
    </div>
  );
}
