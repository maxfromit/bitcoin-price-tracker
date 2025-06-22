# Bitcoin Price Tracker

A full-stack Nuxt 3 application for tracking and visualizing historical Bitcoin prices with automated daily updates.
Data is fetched from Coindesk API

---

## 🚀 Quick Start

1. **Clone the repository**

2. **Copy environment variables**

   ```
   cp .env.example .env
   ```

3. **Start the project with Docker Compose**

   ```
   docker-compose up --build
   ```

   > The build usually takes less than a minute.

4. **Open in your browser**
   ```
   http://localhost:3000/
   ```

---

## 🗄️ Backend

- **Database:** PostgreSQL
- **ORM:** Drizzle
- **Location:** `/server`

### How it works

1. **Initial Data Fetch**

   - On server startup, the plugin `populateBitcoinPrice.ts` fetches historical Bitcoin prices from the Coindesk API and populates the database.
   - This uses the `fetchTransformAndInsertBitcoinPrices` function (without arguments).

2. **Daily Updates**
   - A scheduled task (`dailyUpdate.ts`) runs every day at **23:59 UTC**.
   - It fetches and inserts only the latest 5 days of data (`fetchTransformAndInsertBitcoinPrices(5)`).
   - Duplicate entries are ignored at the database level (upsert logic), so no extra date checks are needed.

---

## 🖥️ Frontend

- **Framework:** Nuxt 3
- **UI:** Nuxt UI (for inputs, popovers, etc.)
- **Charts:** Highcharts
- **Location:** `/app`

### Features

- **Period Selection:**  
  Users can select a predefined period (day, week, month, year) or set a custom period (in days) up to today.
- **Date Range Picker:**
  - Only available dates are clickable (`cursor-pointer` only on valid dates).
  - Out-of-range dates are disabled in the calendar.
  - If the start date is set after the end date, the end date is automatically adjusted.
- **Chart Display:**
  - Shows one price per day.
  - Year is hidden on the x-axis if the selected period is a year or less.
- **Responsive Design:**
  - The layout is adaptive and works well on mobile devices.

---

## 🛠️ Tech Stack

- Nuxt 3
- PostgreSQL
- Drizzle ORM
- Highcharts
- Nuxt UI
- Docker & Docker Compose

---

## License

MIT
