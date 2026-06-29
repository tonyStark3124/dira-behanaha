# 🏠 Dira Behanaha — דירה בהנחה Analyzer

A Next.js dashboard for analyzing Israeli government **subsidized housing lotteries** (מחיר למשתכן / דירה בהנחה).

Visualizes the **profit potential vs. win probability** for each lottery, helping participants make smarter decisions about where to register.

---

## What it does

- Pulls lottery data (currently via manual CSV input, automation planned) and displays each lottery as a scored opportunity
- Calculates **win probability** based on registered applicants ÷ available units
- Estimates **profit** based on the gap between the subsidized price and the market price in that area
- Combines both into a **composite score** so you can compare lotteries at a glance
- Lets you filter by city, price range, and adjust the profit/probability weighting to match your priorities

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| Charts | Recharts |
| Deploy | Netlify |

## Features

- 📊 KPI cards — top opportunity, best odds, highest profit
- 📈 Charts grid — scatter plot of profit vs. probability across all lotteries
- 🏙️ City comparison panel with sortable table
- 📱 Mobile-optimized layout with city ranking cards
- 🌙 Dark / light mode toggle
- ⚖️ Adjustable weighting slider (prioritize profit vs. probability)
- 💰 Price range filter

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Data

Lottery data lives in `data/lottery_data.csv`. Currently updated manually from [dira.moch.gov.il](https://dira.moch.gov.il).  
Planned: automated scraper via `/app/api/lotteries/route.ts`.

## Roadmap

- [ ] Automated data fetching from dira.moch.gov.il
- [ ] Historical lottery results tracking
- [ ] Email alerts for new lotteries matching your filters

## License

MIT

