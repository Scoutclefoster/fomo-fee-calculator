import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSingleSwapInAppFee,
  evaluateMonthlyCodeCost,
  compareFomoCodeTiers,
  CODE_PROFILES,
} from '../src/calculator.mjs';

test('Solana small-trade minimum bands match Fomo Help Center Article #14436214', () => {
  assert.equal(calculateSingleSwapInAppFee({ tradeSizeUsd: 3, chain: 'solana', hasCode: true }), 0.10);
  assert.equal(calculateSingleSwapInAppFee({ tradeSizeUsd: 25, chain: 'solana', hasCode: true }), 0.50);
  assert.equal(calculateSingleSwapInAppFee({ tradeSizeUsd: 50, chain: 'solana', hasCode: true }), 0.95);
  assert.equal(calculateSingleSwapInAppFee({ tradeSizeUsd: 189, chain: 'solana', hasCode: true }), 0.95);
  assert.equal(calculateSingleSwapInAppFee({ tradeSizeUsd: 200, chain: 'solana', hasCode: false }), 1.00);
  assert.equal(calculateSingleSwapInAppFee({ tradeSizeUsd: 200, chain: 'solana', hasCode: true }), 0.90);
});

test('$100,000 monthly volume benchmark compares JOIN2026 (0.3825%) vs DEAL (0.3938%) vs Standard (0.45%)', () => {
  const rows = compareFomoCodeTiers({ tradeSizeUsd: 500, tradesPerMonth: 200, chain: 'solana' });
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));

  assert.equal(byId.no_code.monthlyNetCostUsd, 500.00);
  assert.equal(byId.standard_10.monthlyNetCostUsd, 450.00);
  assert.equal(byId.deal_12_5.monthlyNetCostUsd, 393.75);
  assert.equal(byId.join2026_15.monthlyNetCostUsd, 382.50);
  assert.equal(byId.join2026_15.monthlyCashbackUsdc, 67.50);
  assert.equal(byId.join2026_15.effectiveNetRatePct, 0.3825);
});

test('Fomo $1.00 USDC in-app Send floor rolls over sub-$1 balances cleanly', () => {
  const tiny = evaluateMonthlyCodeCost({
    profile: CODE_PROFILES.JOIN2026_15,
    tradeSizeUsd: 250,
    tradesPerMonth: 2, // $500 vol -> $2.25 fee -> $0.3375 cashback (< $1.00 Send minimum)
    chain: 'base',
  });
  assert.equal(tiny.monthlyCashbackUsdc, 0.34);
  assert.match(tiny.payoutStatus, /Rolls over/);

  const weekly = evaluateMonthlyCodeCost({
    profile: CODE_PROFILES.JOIN2026_15,
    tradeSizeUsd: 1000,
    tradesPerMonth: 40, // $40k vol -> $180 fee -> $27 USDC cashback (>= $25 Sunday threshold)
    chain: 'base',
  });
  assert.equal(weekly.monthlyCashbackUsdc, 27.00);
  assert.match(weekly.payoutStatus, /Weekly Sunday payout/);
});
