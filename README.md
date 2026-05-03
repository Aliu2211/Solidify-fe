# 🌍 Solidify — Frontend (Development Branch)

> Helping Tech-Based SMEs Achieve Net Zero Carbon Emission  
> **Branch:** `dev` — Active development version

This repository hosts the **frontend (React)** implementation of **Solidify**, a sustainability platform that enables small and medium-sized tech enterprises to track, reduce, and manage their carbon emissions.

The **`dev` branch** contains the latest, in-progress updates, UI refinements, and experimental features before merging into the `main` branch.

---

## 🚧 Branch Summary: `dev`

| Purpose                                   | Status                      |
| ----------------------------------------- | --------------------------- |
| Active development and feature testing    | ✅ Ongoing                  |
| Latest updates before production          | 🔄 Frequently updated       |
| May include unstable or experimental code | ⚠️ Use for development only |

---

## 📖 Table of Contents

- [Overview](#overview)
- [Current Features (Dev Branch)](#current-features-dev-branch)
- [Tech Stack](#tech-stack)
- [Installation (Dev Setup)](#installation-dev-setup)
- [Branch Workflow](#branch-workflow)
- [Project Structure](#project-structure)
- [Routing Overview](#routing-overview)
- [Components in Progress](#components-in-progress)
- [Styling & UI Standards](#styling--ui-standards)
- [Development Notes](#development-notes)
- [Roadmap (Upcoming Features)](#roadmap-upcoming-features)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

---

## 🧭 Overview

**Solidify** is a sustainability-focused web platform for SMEs to monitor and manage their carbon footprint.  
It provides insights, visualization tools, and sustainability tracking for better environmental accountability.

---

## ✨ Current Features (Dev Branch)

- ⚡ **React + Vite setup** with optimized development workflow
- 🔐 **Authentication flow** — login, password reset/change
- 🧭 **Routing system** with React Router
- 📊 **Dashboard layout** and placeholder widgets
- 🧩 Modular architecture with reusable components
- 🎨 Responsive UI design via CSS Modules
- 🧱 Folder refactor for scalability and component reusability
- 🧪 Experimental UI section for image scroll and analytics cards

---

## 🧰 Tech Stack

| Category        | Technology                                   |
| --------------- | -------------------------------------------- |
| Framework       | [React 18](https://react.dev/)               |
| Build Tool      | [Vite](https://vitejs.dev/)                  |
| Routing         | [React Router DOM](https://reactrouter.com/) |
| Styling         | CSS Modules / Plain CSS                      |
| Package Manager | npm or yarn                                  |
| State Handling  | Local state (React Hooks)                    |
| Version Control | Git + GitHub                                 |

---

## 🛠 Installation (Dev Setup)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aliu2211/Solidify-fe.git
   cd Solidify-fe
   ```

2. **Switch to the `dev` branch**

   ```bash
   git checkout dev
   ```

3. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   ```bash
   http://localhost:5173
   ```

---

## 🔄 Branch Workflow

```bash
main         # Stable production branch
└── dev      # Active development branch
    ├── feature/ui-refactor
    ├── feature/dashboard
    ├── feature/image-scroll
    └── ...
```

> ⚠️ All new features and bug fixes should branch off `dev`.
> Once tested and stable, `dev` merges into `main` for deployment.

---

## 🧩 Project Structure

```
Solidify-fe/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, icons, etc.
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main pages (Welcome, Login, Dashboard)
│   ├── routes/            # App routing logic
│   ├── styles/            # CSS Modules or global styles
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🗺 Routing Overview

| Route              | Component        | Purpose             |
| ------------------ | ---------------- | ------------------- |
| `/`                | `WelcomePage`    | Landing screen      |
| `/login`           | `LoginPage`      | Authentication      |
| `/change-password` | `ChangePassword` | Password reset flow |
| `/dashboard`       | `Dashboard`      | Main user dashboard |

Example route snippet:

```jsx
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
```

---

## 🧱 Components in Progress

**Existing:**

- `Header.jsx` – Navigation bar
- `Footer.jsx` – Footer section
- `Button.jsx` – Reusable button styles
- `Card.jsx` – For dashboard info and stats

**Under Development:**

- `ImageScroller.jsx` – Horizontal scrollable gallery using CSS `calc()` and scroll-snap
- `EmissionChart.jsx` – Visualization for emission data
- `StatsOverview.jsx` – Metrics summary component

### Example Horizontal Scroll CSS

```css
.scroller {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
}
.scroller-item {
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: calc(100% / 3);
}
```

---

## 🎨 Styling & UI Standards

- **CSS Modules** for scoped styles
- Global variables defined in `:root`

  ```css
  :root {
    --primary-color: #57eb55;
    --text-color: #1a1a1a;
  }
  ```

- **Layout principles**

  - Use `display: grid` or `flex` for layout
  - Responsive with `minmax()` and `calc()`
  - Consistent border radius, spacing, and shadows

- **Naming convention:**
  Components → `PascalCase`
  Classes → `camelCase`

---

## 🧑‍💻 Development Notes

- Always run `npm run lint` before committing
- Maintain accessibility (semantic HTML + ARIA)
- Optimize and lazy-load large images
- Use `.env` files for sensitive configs
- Use `React.StrictMode` during dev for debugging

---

## 🧭 Roadmap (Upcoming Features)

| Feature                    | Description                                | Status         |
| -------------------------- | ------------------------------------------ | -------------- |
| 🌿 Carbon Tracker          | Visualize real-time emissions data         | 🧩 In progress |
| 🧮 Analytics Dashboard     | Graphs & charts for sustainability metrics | 🔄 Planned     |
| 📈 Horizontal Image Scroll | Showcase sustainability efforts            | ✅ Prototype   |
| 👥 User Profiles           | Manage user-specific sustainability goals  | 🔄 Planned     |
| 🗄 Data Persistence         | Backend API integration                    | 🚧 Under setup |
| 🧑‍💼 Admin Panel             | Management dashboard for organizations     | 🕓 Scheduled   |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit and push your changes

   ```bash
   git push origin feature/your-feature-name
   ```

4. Submit a pull request to `dev` branch

---

## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

## 👥 Authors

| Name                         | GitHub Profile                                     | Role                             |
| ---------------------------- | -------------------------------------------------- | -------------------------------- |
| **Aliu Tijani**        | [github.com/Aliu2211](https://github.com/Aliu2211) | Project Lead / Backend Developer |
| **Graham Kyeremanteng**      | [github.com/kyerrman](https://github.com/kyerrman) | Frontend Developer               |
| **Jehiel Britstot Houmanou** | [github.com/jaymannn](https://github.com/jaymannn) | Frontend Developer / UI designer |

---

> 🧠 _This document applies to the `dev` branch of the Solidify frontend repository.
> For production-ready instructions, refer to the `main` branch README._
