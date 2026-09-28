# Mutation spot-check (Stryker)

`pnpm mutation` runs Stryker 10 with the Vitest runner on `Button.tsx` and `Dialog.tsx`
(`stryker.config.json`). Measured 2026-09-28.

| Run                                             | Button | Dialog | Total                                               |
| ----------------------------------------------- | ------ | ------ | --------------------------------------------------- |
| First run, M6                                   | 67.86% | 50.00% | 60.00%                                              |
| After adding the tests the survivors pointed at | 96.30% | 77.27% | **87.76%** (43 killed, 6 survived, 1 runtime error) |

The first run found real, unguarded behavior rather than cosmetic gaps: an idle button must not
announce itself as busy, a loading submit button must not submit its form, the default loading label,
and a dialog must inherit its trigger's local theme and render no empty body, footer or dangling
`aria-describedby`. Those are now tests. The remaining Dialog survivors are an empty `useCallback`
dependency array and the object spread that omits `aria-describedby`, whose mutants render the same DOM.
