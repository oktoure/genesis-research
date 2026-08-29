# Genesis Research Framework - September 2026

## Objective

Genesis should function as a live investment process, not a collection of unrelated charts. Every post must move the reader through the same chain:

**Fact -> interpretation -> policy reaction -> cross-asset transmission -> trade -> risk -> update.**

The website should make the current view visible at a glance while preserving the dated evidence that created it.

## Research products

### 1. Daily Insight

Use for one economic release, policy communication, or unscheduled market event.

- One primary message.
- One chart or one synchronized two-panel chart.
- 120-220 words.
- First paragraph: what changed versus expectations and prior data.
- Second paragraph: why it matters for the reaction function.
- Final paragraph: cross-asset implication and what would invalidate it.

### 2. Weekly View

Use at the end of each week to consolidate the regime.

- Growth, inflation, policy, liquidity, and risk appetite scorecard.
- Recommendation table: asset, stance, horizon, catalyst, invalidation.
- Explicit changes from the prior week.
- Links only to evidence published before the weekly view.

### 3. Macro Thesis

Use when several releases combine into a persistent investment view.

- Three to five charts, each answering a different question.
- Base case, upside scenario, downside scenario.
- Transmission sequence and expected lag.
- Trade expression, preferred instrument, and expected horizon.

### 4. Trading Idea

Use before taking risk.

- Asset and direction.
- Macro catalyst.
- Technical structure and entry zone.
- Target, stop, invalidation, and holding horizon.
- Conditions required before execution.

### 5. Execution Update

Use after entry and whenever the position changes.

- Timestamped entry, size state, and reference price.
- What changed since the idea.
- Target progress and risk adjustment.
- Partial profit, stop movement, exit, or invalidation.

## Chart families

Every chart should belong to one of six jobs. Mixing jobs without a clear reason weakens the message.

1. **Release chart** - actual, consensus, prior, and revisions.
2. **Leading-to-hard-data chart** - a leading series against the outcome it is expected to predict.
3. **Reaction-function chart** - growth and inflation inputs against rates or policy expectations.
4. **Transmission chart** - policy expectations into yields, dollar, equities, and gold.
5. **Valuation or positioning chart** - risk premium, flows, positioning, or relative valuation.
6. **Execution chart** - price structure, entry, stop, target, and invalidation.

## Visual chart standard

- One message per panel.
- Maximum two panels unless the post is a Macro Thesis.
- All synchronized panels must use the same date range and recession windows.
- Narrative callouts use 8 px type, no more than six words, and no more than two lines.
- Reserve whitespace for callouts; do not place them directly over the most volatile portion of a series.
- When legacy placement cannot be changed, use a subtle white backing so the series cannot cross the text.
- Keep legends at the top left and units at the upper edges.
- Use a consistent color role: charcoal for the primary series, blue or emerald for comparison, amber for inflation, red only for risk or adverse direction.
- Sources, transformations, leads/lags, standardization, and recession definitions must be explicit.
- Never combine panels with incompatible sample periods without making the difference visually explicit.

## Editorial writing standard

### Headline

Five to ten words. State the conclusion, not the chart construction.

### Summary

One bold sentence containing the investable conclusion.

### Body

1. **Evidence:** actual, expected, prior, revision, and breadth.
2. **Mechanism:** how the evidence changes growth, inflation, or policy.
3. **Transmission:** rates, curve, dollar, equities, commodities, and volatility.
4. **Action:** stance, horizon, catalyst, and invalidation.

Avoid unsupported certainty. Distinguish observed facts, interpretation, and forecast.

## September operating rhythm

### Before the week

- Publish the calendar and the current base case.
- Record the expected market reaction for upside and downside surprises.
- Identify the asset and technical levels that will express the view.

### After each release

- Publish a Daily Insight within the event window.
- Update the Story Line only if the release changes the regime.
- Update the Trading Idea only if the trade conditions change.

### End of week

- Publish a Weekly View with recommendation changes.
- Archive invalidated ideas explicitly rather than silently replacing them.
- Carry open positions into the next week with updated risk.

## Website information architecture

The homepage should expose three live lanes:

1. **Macro Regime** - latest Story Line conclusion.
2. **Portfolio Expression** - latest Trading Idea.
3. **Execution & Risk** - latest Trading Execution update.

The chronological feed remains the evidence archive. New posts update the live lanes automatically without rewriting older history.

## Next engineering priorities

1. Add structured post fields for horizon, stance, conviction, catalyst, and invalidation.
2. Add a weekly recommendation matrix and changes-versus-prior view.
3. Add chart templates for the six chart families.
4. Add automatic series-to-callout collision measurement during SVG export.
5. Add a publishing checklist that blocks missing sources, mismatched dates, or non-chronological links.
6. Add a scenario and trade-state model shared by the dashboard, Telegram interface, and website.
