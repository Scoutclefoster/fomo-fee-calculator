/**
 * Zero-dependency fee & cashback calculator for the Fomo trading app (fomo.family).
 * Verified 17 November 2026 against official Fomo Help Center documentation:
 *  - Trading fees on fomo: https://help.fomo.family/en/articles/14436214-trading-fees-on-fomo
 *  - How referral codes & fee discounts work: https://help.fomo.family/en/articles/15171268-how-referral-codes-and-fee-discounts-work
 *  - Sending to another fomo user ($1.00 Send floor): https://help.fomo.family/en/articles/14436791-sending-to-another-fomo-user
 *  - Creator rewards & aggregated referral lines: https://help.fomo.family/en/articles/17832635-creator-rewards
 */

export const SUPPORTED_CHAINS = Object.freeze([
  'solana',
  'base',
  'bnb',
  'ethereum',
  'monad',
  'robinhood',
  'arc',
  'elysium',
]);

export const FOMO_MIN_SEND_USDC = 1.00;

export const CODE_PROFILES = Object.freeze({
  NO_CODE: {
    id: 'no_code',
    label: 'No Referral Code (0.50%)',
    hasCode: false,
    inAppFeePct: 0.50,
    cashbackOfFeesPct: 0,
    weeklyThresholdUsdc: null,
    inviteUrl: null,
  },
  STANDARD_10: {
    id: 'standard_10',
    label: 'Standard 10% Code (0.45%)',
    hasCode: true,
    inAppFeePct: 0.45,
    cashbackOfFeesPct: 0,
    weeklyThresholdUsdc: null,
    inviteUrl: null,
  },
  DEAL_12_5: {
    id: 'deal_12_5',
    label: 'Code DEAL (10% + 12.5% Cashback)',
    hasCode: true,
    inAppFeePct: 0.45,
    cashbackOfFeesPct: 12.5,
    weeklyThresholdUsdc: 50.0,
    inviteUrl: 'https://fomo.family/r/deal',
  },
  JOIN2026_15: {
    id: 'join2026_15',
    label: 'Code JOIN2026 (10% + 15% Cashback)',
    hasCode: true,
    inAppFeePct: 0.45,
    cashbackOfFeesPct: 15.0,
    weeklyThresholdUsdc: 25.0,
    inviteUrl: 'https://fomo.family/r/JOIN2026',
  },
});

/**
 * Computes Fomo's in-app spot fee for a single swap in USDC.
 */
export function calculateSingleSwapInAppFee({
  tradeSizeUsd,
  chain = 'solana',
  hasCode = true,
  lowestFeeSolanaRoute = true,
  loweredFeeMajorToken = false,
}) {
  if (typeof tradeSizeUsd !== 'number' || Number.isNaN(tradeSizeUsd) || tradeSizeUsd <= 0) {
    return 0;
  }
  const normChain = String(chain).trim().toLowerCase();
  if (!SUPPORTED_CHAINS.includes(normChain)) {
    throw new Error(`Unsupported Fomo chain "${chain}". Expected one of: ${SUPPORTED_CHAINS.join(', ')}`);
  }

  if (loweredFeeMajorToken) {
    return Number((tradeSizeUsd * 0.0005).toFixed(6));
  }

  const pctRate = hasCode ? 0.0045 : 0.0050;

  if (normChain === 'solana') {
    if (lowestFeeSolanaRoute) {
      if (tradeSizeUsd < 5.0) return 0.10;
      if (tradeSizeUsd < 47.50) return Number((tradeSizeUsd * 0.02).toFixed(6));
      if (tradeSizeUsd < 190.0) return 0.95;
      return Number((tradeSizeUsd * pctRate).toFixed(6));
    }
    return Math.max(0.95, Number((tradeSizeUsd * pctRate).toFixed(6)));
  }

  return Number((tradeSizeUsd * pctRate).toFixed(6));
}

/**
 * Evaluates monthly trading volume, in-app fees, USDC cashback, and payout cadence for a code profile.
 */
export function evaluateMonthlyCodeCost({
  profile = CODE_PROFILES.JOIN2026_15,
  tradeSizeUsd = 500,
  tradesPerMonth = 200,
  chain = 'solana',
  lowestFeeSolanaRoute = true,
}) {
  const normChain = String(chain).trim().toLowerCase();
  const perSwapFee = calculateSingleSwapInAppFee({
    tradeSizeUsd,
    chain: normChain,
    hasCode: profile.hasCode,
    lowestFeeSolanaRoute,
  });

  const monthlyVolumeUsd = tradeSizeUsd * tradesPerMonth;
  const monthlyInAppFeeUsd = perSwapFee * tradesPerMonth;
  const isSmallSolanaMinimum = normChain === 'solana' && lowestFeeSolanaRoute && tradeSizeUsd < 190;

  const monthlyCashbackUsdc = isSmallSolanaMinimum
    ? 0
    : monthlyInAppFeeUsd * (profile.cashbackOfFeesPct / 100);

  const monthlyNetCostUsd = monthlyInAppFeeUsd - monthlyCashbackUsdc;
  const effectiveNetRatePct = monthlyVolumeUsd > 0 ? (monthlyNetCostUsd / monthlyVolumeUsd) * 100 : 0;

  let payoutStatus = 'No cashback';
  if (profile.cashbackOfFeesPct > 0) {
    if (monthlyCashbackUsdc < FOMO_MIN_SEND_USDC) {
      payoutStatus = `Rolls over (< $${FOMO_MIN_SEND_USDC.toFixed(2)} Fomo in-app Send floor)`;
    } else if (profile.weeklyThresholdUsdc && monthlyCashbackUsdc >= profile.weeklyThresholdUsdc) {
      payoutStatus = `Weekly Sunday payout (>= $${profile.weeklyThresholdUsdc.toFixed(0)} USDC)`;
    } else {
      payoutStatus = `Monthly payout (>= $${FOMO_MIN_SEND_USDC.toFixed(2)} USDC)`;
    }
  }

  return {
    id: profile.id,
    label: profile.label,
    chain: normChain,
    tradeSizeUsd,
    tradesPerMonth,
    monthlyVolumeUsd: Number(monthlyVolumeUsd.toFixed(2)),
    inAppFeePerSwapUsd: Number(perSwapFee.toFixed(4)),
    monthlyInAppFeeUsd: Number(monthlyInAppFeeUsd.toFixed(2)),
    monthlyCashbackUsdc: Number(monthlyCashbackUsdc.toFixed(2)),
    monthlyNetCostUsd: Number(monthlyNetCostUsd.toFixed(2)),
    effectiveNetRatePct: Number(effectiveNetRatePct.toFixed(4)),
    gasCoveredByFomo: normChain === 'solana',
    payoutStatus,
  };
}

/**
 * Compares all four Fomo code tiers side by side for a given trade size, monthly trade count, and chain.
 */
export function compareFomoCodeTiers(options = {}) {
  return [
    evaluateMonthlyCodeCost({ ...options, profile: CODE_PROFILES.NO_CODE }),
    evaluateMonthlyCodeCost({ ...options, profile: CODE_PROFILES.STANDARD_10 }),
    evaluateMonthlyCodeCost({ ...options, profile: CODE_PROFILES.DEAL_12_5 }),
    evaluateMonthlyCodeCost({ ...options, profile: CODE_PROFILES.JOIN2026_15 }),
  ];
}
