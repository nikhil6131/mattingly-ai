# Project Write-Up — Mattingly Warehouse Analytics & AI Decision Support System

**Mattingly Inaugural AI & Operations Hackathon 2026**
**Result: Top 10 Finalist (of 20 participants, Victoria-wide)**
**Build time: 7 days**

---

## 1. The Brief

Mattingly is a consulting firm that operates a warehouse servicing 30 customers across six industries — FMCG, Consumer Goods, Healthcare, Retail, Industrial and Wholesale. For the hackathon, participants were given two months of real warehouse operational data and challenged to build something that helps management make better decisions — explicitly *"build something useful, not something impressive."*

The deliverable had to be practical, usable, scalable and actionable — something a non-technical operations manager could open and act on.

---

## 2. The Data

The dataset contained 15 working sheets covering Month 1 (January) and Month 2 (February) 2026:

- **Revenue** (M1/M2) — every transaction, charge type, rate and revenue amount
- **Labour** (M1/M2) — every activity, hours worked, labour cost
- **Activities** (M1/M2) — customer activity volumes
- **Exceptions** (M1/M2) — billing and operational exceptions by type
- **Inventory** (M1/M2) — stock holdings and days in storage
- **Customer Master** — 30 customers with industries, contract types and internal archetypes
- **Customer Pricing & Standard Pricing** — contract rates
- **Cost Allocation & Management Allocation Cost** — fixed and management overheads
- **Product Master** and **Data Dictionary**

---

## 3. Methodology

### 3.1 Establishing profitability per customer

The core analytical task was calculating true profitability for each customer. Costs were allocated as follows:

- **Labour costs** — allocated by activity volume (a customer generating more warehouse activities is assigned proportionally more labour cost)
- **Fixed costs** — allocated by revenue share
- **Management costs** — taken directly from the Management Allocation sheet

```
Customer Net Margin % = (Revenue − Allocated Costs) / Revenue × 100
```

This activity-based allocation is what surfaces the real story: a customer can generate high revenue but still be unprofitable if they consume disproportionate labour relative to what they pay.

### 3.2 Flagging critical customers

Customers were flagged based on net margin:

- **Critical** — margin below 30%
- **Healthy** — margin 30–79%
- **Star** — margin above 79%

The 30% threshold was not arbitrary — it sat in a natural gap in the data. The three lowest customers sit at 17%, 28% and 28%, while the next customer jumps to 64%. No customer falls between 30% and 63%, making 30% a defensible, data-driven cut-off.

### 3.3 Quantifying at-risk revenue

At-risk revenue was calculated as the combined Month 1 revenue of all customers flagged Critical:

```
At Risk Revenue = CALCULATE(
    SUM('M1 Revenue'[Revenue]),
    FILTER('Customer Profitability', [Flag] = "Critical")
)
```

This produced **$417,935** — the Month 1 revenue of the three critical customers, representing revenue that is either unsustainable at current pricing or potentially unrecovered due to billing failures.

---

## 4. Key Findings

### Finding 1 — Risk is concentrated
Only 3 of 30 customers carried all $417,935 of at-risk revenue. The other 27 were healthy. This reframed the problem from "the business has a margin problem" to "three specific customers need three specific interventions."

### Finding 2 — Charlie Medical: a billing failure, not an operational one
35,991 exceptions (96% of all exceptions in the dataset) came from Charlie Medical — and **all of them in Month 1, zero in Month 2**. This asymmetry was the single most important insight: an ongoing operational problem would appear in both months. Month 1 only indicated a one-time billing/data failure, changing the recommended action from process improvement to a retrospective billing audit.

### Finding 3 — Bravo FMCG: Scale Without Return
Bravo generated the highest activity volume in the portfolio (422,913 units) but returned only 17.28% margin. With zero exceptions, the issue was purely commercial — contract rates below the cost of service. The fix is renegotiation, not operational change.

### Finding 4 — Delta Manufacturing: double risk
Delta combined a low margin (27.84%) with 1,505 operational exceptions (Returns, Rework, Urgent Orders) consistent across both months — requiring both commercial and operational intervention.

### Finding 5 — Labour waste
9,241 hours were spent on Rework and Returns — non-value-adding activity. At the standard labour rate of $47.50/hour, that is $438,937 over two months.

### Finding 6 — Growth opportunity
Echo Imports delivered 84.57% margin on $891K revenue via a Storage Heavy contract (low labour intensity). The clearest candidate for relationship expansion.

---

## 5. The Build

### Pages 1–4: Analytics layer (Power BI)
Standard Power BI report pages built on the Excel data model with DAX measures, surfacing the findings above through KPI cards, ranked tables, an exception matrix and operational charts.

### Page 5: AI Assistant
A live chatbot embedded into Power BI via the HTML Content visual. The full dataset context is embedded in the system prompt, so the AI answers any question using the actual numbers. Hosted on Netlify, calling the Groq API through a serverless function that keeps the API key server-side.

### Page 6: Action Centre
A priority actions table plus six one-click AI-generated management plans (Full Plan, Leakage Recovery, Critical Customers, Operational Efficiency, Growth Opportunities, Quick Wins), and an automated email alert system via EmailJS that sends a pre-populated management briefing.

---

## 6. Technical Decisions

**Why Groq over Power BI Copilot** — Copilot requires a Premium licence (~AUD $25/user/month). Without it, I built equivalent capability using Groq's llama-3.3-70b model and a serverless integration. The architecture maps directly to Copilot, so production migration requires no redesign.

**Why Netlify** — Power BI Service blocks outbound API calls from embedded iframes (CORS). Hosting the AI pages on a separate Netlify domain with serverless functions solved this, while keeping API keys off the client.

**Why activity-based cost allocation** — Allocating labour by activity volume rather than revenue share is what reveals the true profitability picture and exposes the Scale Without Return pattern.

---

## 7. Business Value

- **$417,935** in immediately addressable at-risk revenue
- **$94,659** directly recoverable through a Charlie Medical billing audit (cleanest, fastest win — no negotiation required)
- **~$2.6M annualised** in non-value-adding labour cost as a reduction target
- **Growth upside** from investing in high-margin customers like Echo Imports

---

## 8. What I'd Do Next

1. **Migrate to Power BI Copilot** in a production environment with a Premium licence
2. **Connect recommendations to live DAX measures** so the Action Centre updates automatically as new data arrives (current limitation: it's a point-in-time snapshot)
3. **Multi-warehouse scalability** via a location slicer
4. **Automated scheduled alerts** — a weekly performance email without manual triggering
5. **Validate cost allocation** with the finance team before acting commercially, since the margin figures depend on the allocation methodology

---

## 9. Reflection

The most valuable lesson was that the gap between data and action is where the real value sits. Most businesses have dashboards. Very few have a system that tells management exactly what to do. Building the Action Centre — the layer that converts analysis into a specific, owned, costed action — was what made this more than "another dashboard."

The judges (Andrew Maxwell, Mick O'Neil, Andy Derrick) noted the dashboard and AI bot were detailed and that the submission identified many of the issues they were looking for contestants to uncover.

---

*Nik Chhetri — June 2026*
