# Aerozone 5.0 - Deep Project Analysis

Aerozone 5.0 is a modern, full-stack data visualization and business intelligence dashboard application. It facilitates uploading Excel data, processing it in the cloud via serverless functions, and displaying deep insights across various modules.

---

## 🏗️ 1. Architecture & Technology Stack

The project utilizes a decoupled but co-located monorepo structure, deploying as a full-stack site on Netlify.

### **Frontend Pipeline**
*   **Core:** React 19 + Vite 7 for blazing fast local dev and optimized builds.
*   **Routing:** `react-router-dom` v7.
*   **Styling:** TailwindCSS v4 with Vanilla CSS fallbacks, `clsx`, and `tailwind-merge`.
*   **Animations:** `framer-motion`, `gsap` (GreenSock), `lenis` for smooth scrolling, and `@lottiefiles/react` for vector animations.
*   **Visualizations:** 
    *   `highcharts` and `highcharts-react-official`
    *   `chart.js` w/ `react-chartjs-2` and `chartjs-plugin-zoom`
    *   `recharts`
    *   `plotly.js` via `react-plotly.js`
    *   `three.js`, `@react-three/fiber`, and `@react-three/drei` (Likely used for 3D visual blocks or advanced dashboard components in Orbit/Prism).

### **Backend Pipeline**
*   **Server Framework:** Node.js + Express 5.
*   **Serverless Wrapper:** `serverless-http` wraps the Express app so it runs identically in local dev and horizontally scaled Netlify Serverless Functions (`netlify/functions/api.js`).
*   **Database:** Firebase Firestore Admin SDK (`firebase-admin`).
*   **File Processing:** `multer` (multipart/form-data parsing) and `xlsx` (Excel file parsing in memory).

---

## 📂 2. Directory Structure

The repository is modularly unified, combining both frontend source and backend logic in a way Netlify can digest natively:
```text
Aerozone_5.O/
├── backend/            # Express Business Logic & Firebase Setup
│   ├── config/         # Firebase initialization (`firebase.js`)
│   ├── routes/         # Express endpoint definitions (`dataRoute.js`)
│   └── src/            # Express server configuration (`app.js`)
├── components/         # Shared & Module-Specific React UI Components
│   ├── MainChart/      # Base Dashboard Layout Elements (Sidebar, Navbar, DataTable)
│   ├── Orbit/          # Components dedicated to the Orbit dashboard view
│   ├── Prism/          # Components dedicated to the Prism analysis view
│   ├── Analysis[X]/    # Components for various analysis routes
│   └── plannerChecker/ # Components to track supplier planning and parts checking
├── netlify/
│   └── functions/      # Serverless Entry Point (api.js redirects to backend/src/app.js)
├── pages/              # Top-Level Router Views (Home, Orbit, Prism, Analysis, etc.)
├── public/             # Static Assets & Icons
├── src/                # Core Frontend setup (App.jsx, index.css, routing logic)
└── package.json        # Unified dependencies for React and Express
```

---

## 🔌 3. Data Flow & Backend Endpoints

The backend is entirely responsible for receiving large Excel uploads, normalizing the schema, batch-uploading it to Firestore, and returning targeted views.

**Core Endpoints (`backend/routes/dataRoute.js`):**

*   **`POST /upload-excel`**
    1.  Receives file buffer via `multer`.
    2.  Clears existing `excelData` collection iteratively in batches of 500 to sidestep Firestore constraints.
    3.  Parses the new Excel, iterating via `xlsx`.
    4.  Extracts 40+ columns of data (ReferenceB, Project, Item, OrderValue, etc.).
    5.  Computes a `UniqueCode` by merging `{RefNum}{ProjectCode}{ItemCode}`.
    6.  Batch uploads the cleansed rows into Firestore `excelData`.

*   **`GET /get-data` (Primary Joined Data)**
    *   Fetches the `excelData` collection.
    *   Fetches an `Indent_Quantity` collection.
    *   Performs a left intersection (join) based on `ItemCode` === `ITEM_CODE` to correlate incoming inventory data with required Indent quotas.

*   **`GET /prism` (Delta Analysis Route)**
    *   Groups data by `UniqueCode` from both databases.
    *   Calculates the required quantity minus the ordered quantity, returning a `Difference` metric per item.

*   **`GET /orbit` & `GET /analysis` & `GET /analysistwo`**
    *   Returns raw and slightly augmented snapshots (calculating derived fields like `Rate` logic directly in-flight).

---

## 🖥 4. Frontend Ecosystem & Layout

The entry point of the app dynamically orchestrates layout with centralized loaders and a collapsing sidebar grid system. 

### **App Shell & Routing (`src/App.jsx`)**
*   **Stateful Loading:** The `GlobalLoader` provides transition sequences when navigating between hefty analytical views. Components handle data loading states and pass it to parental props (`setDataLoading`).
*   **Sidebar Navigation:** Integrated deeply into `react-router-dom`, maintaining UI persistence between page switches.

### **Dashboard Modules (`pages/` and `components/`)**
The application splits its visualization tasks across several distinct modules:

1.  **Home (`/`):** The landing view outlining tool access.
2.  **Main Chart (`/main-chart`):** The primary data ingest and viewing area, containing the `Sidebar`, datatables, and multi-factor filtering functionality (`Filter2`, `DataTable2`).
3.  **Planner Checker (`/planner-checker`):** Connects to `DonutChart` elements focused heavily on planning statistics, supplier allocations (RMSupplier, BOISupplier), and tracking material receipts.
4.  **Orbit (`/orbit`), Prism (`/prism`), Analysis (`/analysis*`):** Analytical partitions serving different business needs. These pages process the specific slices of backend JSON drops. Prism handles requirement gaps (Difference), whereas Analysis likely computes financial variances (Order Line Values, Ratings).

### **Component Deep-Dive (`components/MainChart/`)**
*   **Rich Interactive Tables (`DataTable.jsx` / `DataTable2.jsx`)**: Core to verifying uploaded entries. Likely holds robust filtering logic relying on `Filter2.jsx`.
*   **Insights System (`ItemInsightsPopup.jsx`)**: A crucial overlay for inspecting single-item deep details (Supplier history, Sequence parsing, Inventory quantities).
*   **Unified Upload Pipeline (`UploadForm.jsx`)**: Allows triggering the `POST /upload-excel` route mapped safely to API bases locally or via absolute endpoints on Netlify.

---

## 🔒 5. Deployment Strategy & Summary

The project is built around **Netlify's Edge/Serverless** capabilities. By aliasing paths via Express and wrapping them inside `serverless-http`, the developer wrote a standard monolith Node.js app that operates seamlessly inside lambda serverless functions. 

The frontend proxy directs `/api/*` to the Lambda container. This minimizes server spin-up costs while effortlessly coping with heavy data processing intervals exclusively when a user uploads a sprawling `.xlsx` file.
