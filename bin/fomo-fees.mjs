#!/usr/bin/env node
import { compareFomoCodeTiers } from '../src/calculator.mjs';

const args = process.argv.slice(2);
function readArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] !== undefined ? args[idx + 1] : fallback;
}

const tradeSizeUsd = Number(readArg('--size', 500));
const tradesPerMonth = Number(readArg('--trades', 200));
const chain = String(readArg('--chain', 'solana'));

const results = compareFomoCodeTiers({ tradeSizeUsd, tradesPerMonth, chain });
const baseCost = results[0].monthlyNetCostUsd;

console.log(`\nFomo App Net-Fee Benchmark (Nov 2026) — Chain: ${chain.toUpperCase()}`);
console.log(`Scenario: ${tradesPerMonth} swaps/mo x $${tradeSizeUsd.toFixed(2)} = $${results[0].monthlyVolumeUsd.toLocaleString('en-US')} monthly volume\n`);
console.log(
  [
    'Tier / Referral Code'.padEnd(36),
    'In-App Fee'.padStart(12),
    'USDC Rebate'.padStart(13),
    'Net Cost'.padStart(12),
    'Net Rate'.padStart(10),
    'Saved/Mo'.padStart(11),
    '  Payout Cadence',
  ].join('')
);
console.log('-'.repeat(126));

for (const row of results) {
  const saved = baseCost - row.monthlyNetCostUsd;
  console.log(
    [
      row.label.padEnd(36),
      `$${row.monthlyInAppFeeUsd.toFixed(2)}`.padStart(12),
      `$${row.monthlyCashbackUsdc.toFixed(2)}`.padStart(13),
      `$${row.monthlyNetCostUsd.toFixed(2)}`.padStart(12),
      `${row.effectiveNetRatePct.toFixed(4)}%`.padStart(10),
      `$${saved.toFixed(2)}`.padStart(11),
      `  ${row.payoutStatus}`,
    ].join('')
  );
}

console.log('\nInvite link (JOIN2026): https://fomo.family/r/JOIN2026 | Browser calculator: https://fomoappreferral.com/fee-calculator/\n');
