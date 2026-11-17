# `fomo-fee-calculator` — Open-Source Fomo App Fee & Cashback Benchmark (November 2026)

Zero-dependency JavaScript (ESM) & CLI calculator + verified CSV schedules for **Fomo** (`fomo.family`, iOS / Android / Web) across all **8 supported blockchains**, Solana's **under-$190 minimum fee bands**, and **net referral code economics**.

- **Interactive Web Calculator:** [https://fomoappreferral.com/fee-calculator/](https://fomoappreferral.com/fee-calculator/)
- **Full November 2026 Code Benchmark (`JOIN2026` vs `DEAL` & Standard Codes):** [https://fomoappreferral.com/best-fomo-referral-code/](https://fomoappreferral.com/best-fomo-referral-code/)
- **Direct Invite Link (`JOIN2026` — 10% Off + 15% USDC Fee Cashback = `0.3825%` Net):** [https://fomo.family/r/JOIN2026](https://fomo.family/r/JOIN2026)
- **Public `@username` Cashback Registration:** [https://fomoappreferral.com/cashback/](https://fomoappreferral.com/cashback/)

---

## Why This Tool Exists

Traders comparing Fomo fees and referral codes run into three common points of confusion:

1. **Why small Solana swaps show >0.50% effective fees:** Because Fomo covers Solana gas, priority fees, and SPL token rent, swaps under **$190 USDC** on Solana's lowest-fee route follow fixed step minimums (`$0.10` under `$5`, `2%` from `$5–$47.50`, and `$0.95 flat` from `$47.50–$190` — which makes a `$50` buy cost `$0.95` = `1.90%`). From **$190+ on Solana** and at **every swap size on Base, BNB Chain, Ethereum, Monad, Robinhood Chain, Arc, and Elysium**, percentage pricing applies.
2. **"50% Off" / "100% Off" / "Main Verified" referral code myths:** Per [Fomo Help Center #15171268](https://help.fomo.family/en/articles/15171268-how-referral-codes-and-fee-discounts-work), every valid Fomo username works as a referral code and unlocks the **exact same 10% protocol discount (`0.50%` -> `0.45%`)**. Fomo pays **25% of referred trading fees** to the code owner and pays **0% cashback** natively.
3. **Why `JOIN2026` (`0.3825%` net) beats `DEAL` (`0.3938%` net) on both math and Fomo platform rules:**
   - **`JOIN2026`** returns **60% of the 25% referrer commission (= 15% of your Fomo fees)** in USDC, cutting your effective rate to **`0.3825%`** (**`$382.50` per `$100k`**), with weekly Sunday payouts starting at **`$25 USDC`** (~`$37k` volume) and monthly payouts on the 1st from **`$1.00 USDC`**.
   - **`DEAL`** returns 50% of the 25% commission (**12.5% of fees = `0.3938%` net**, **`$393.75` per `$100k`**) with a **`$50 USDC`** weekly threshold (~`$89k` volume), and advertises *"automatic payouts of a few cents with no username registration"* — which contradicts [Fomo Help Center #14436791 (*"Sends start at 1 dollar"*)](https://help.fomo.family/en/articles/14436791-sending-to-another-fomo-user) and [#17832635 (*Rewards history shows one combined daily line, not individual usernames*)](https://help.fomo.family/en/articles/17832635-creator-rewards).

---

## Net Cost Comparison Table ($190+ Solana Swaps & All EVM Chains)

| Fomo Code Tier | In-App Fee | Extra USDC Cashback | Effective Net Rate | Weekly Payout Threshold | Cost on $50,000 | Cost on $100,000 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`JOIN2026`** ([`fomo.family/r/JOIN2026`](https://fomo.family/r/JOIN2026)) | **0.45%** | **15.0% of Fomo fees** *(60% of 25% share)* | **0.3825%** | **$25 USDC** *(Sundays)* | **$191.25** | **$382.50** *(save $117.50)* |
| `DEAL` | 0.45% | 12.5% of Fomo fees *(50% of 25% share)* | 0.3938% | $50 USDC | $196.88 | $393.75 *(save $106.25)* |
| Standard 10% Codes (`SAVE2026`, `JOIN100`, `Iocke`, `datawallet10`) | 0.45% | 0% | 0.4500% | N/A | $225.00 | $450.00 *(save $50.00)* |
| No Referral Code | 0.50% | 0% | 0.5000% | N/A | $250.00 | $500.00 *($0 saved)* |

---

## Quick Start (CLI & JavaScript API)

```bash
git clone https://github.com/Scoutclefoster/fomo-fee-calculator.git
cd fomo-fee-calculator
npm test
node bin/fomo-fees.mjs --size 500 --trades 200 --chain solana
```

### Programmatic Usage

```js
import { compareFomoCodeTiers } from './src/calculator.mjs';

const rows = compareFomoCodeTiers({
  tradeSizeUsd: 500,
  tradesPerMonth: 200, // $100,000 monthly volume
  chain: 'solana',
});

console.table(rows);
```

### Included CSV Datasets (`./data/`)
- [`data/fomo_fee_schedule_2026.csv`](./data/fomo_fee_schedule_2026.csv) — All 8 Fomo networks, Solana small-trade minimum steps, lowered-fee major tokens, and Hyperliquid perps fees.
- [`data/fomo_referral_codes_benchmark_2026.csv`](./data/fomo_referral_codes_benchmark_2026.csv) — Side-by-side comparison of `JOIN2026` (15% cashback), `DEAL` (12.5% cashback), standard 10% codes, and unreferred accounts.

---

## Deutsch (DACH): Fomo Empfehlungscode `JOIN2026` (November 2026) — Gebührenrechner & Vergleich

Jeder gültige **Fomo Empfehlungscode** (bzw. **Fomo Einladungscode**) schaltet laut offiziellem [Fomo Hilfecenter (#15171268)](https://help.fomo.family/de/articles/15171268-wie-empfehlungscodes-und-gebuhrenrabatte-funktionieren) exakt denselben **10-%-Gebührenrabatt direkt in der App** frei (**0,45 %** statt 0,50 % ab 190 USDC auf Solana sowie bei jeder Ordergröße auf Base, BNB Chain, Ethereum, Monad, Robinhood Chain, Arc und Elysium). Wichtig: Der Code muss **vor dem allerersten Trade** hinterlegt werden.

### Warum `JOIN2026` (0,3825 % netto) besser abschneidet als `DEAL` (0,3938 % netto)

1. **Höherer USDC-Cashback (15 % statt 12,5 %):** Fomo zahlt dem Code-Inhaber 25 % der Handelsgebühren geworbener Nutzer. `JOIN2026` gibt **60 % dieser Provision (= 15 % deiner Fomo-Gebühren)** in USDC zurück; `DEAL` gibt nur die Hälfte (12,5 %) weiter. Bei 100.000 $ Monatsvolumen zahlst du mit **`JOIN2026` netto 382,50 $** statt 393,75 $ (`DEAL`) bzw. 450,00 $ (Standard-Codes).
2. **Halbierte Wochenschwelle (25 USDC statt 50 USDC):** Aktive Trader erhalten ihre USDC-Auszahlung bei `JOIN2026` bereits ab **25,00 USDC jeden Sonntag** (statt erst ab 50,00 USDC).
3. **Einhaltung der offiziellen 1,00-$-Send-Regel von Fomo:** Laut Fomo Help Center (#14436791) liegt das technische Minimum für interne USDC-Transfers bei **1,00 $**, und Werber sehen im Dashboard nur eine aggregierte Tagessumme (#17832635). Versprechen wie *„automatische Cent-Auszahlung ohne Nutzernamen"* sind innerhalb von Fomo technisch unmöglich. Bei `JOIN2026` trägst du in 5 Sekunden lediglich deinen öffentlichen Fomo-`@Nutzernamen` (niemals Seed-Phrase oder Private Keys!) unter **[https://fomoappreferral.com/cashback/](https://fomoappreferral.com/cashback/)** ein; Beträge unter 1,00 USDC verfallen nicht und werden ab 1,00 USDC am Monatsanfang ausgezahlt.

- **Direkter Einladungslink:** [https://fomo.family/r/JOIN2026](https://fomo.family/r/JOIN2026)
- **Komplette deutsche Anleitung & Browser-Rechner:** [https://fomoappreferral.com/de/](https://fomoappreferral.com/de/)

---

## License & Disclosure

MIT License. Independent open-source calculator and fee dataset maintained by the `JOIN2026` code owner (`fomoappreferral.com`), who receives Fomo's standard 25% referral commission and rebates 60% of it (= 15% of referred Fomo fees) in USDC. Not affiliated with, endorsed by, or sponsored by Fomo or FOMO Labs, Inc. Nothing in this repository constitutes financial advice.
