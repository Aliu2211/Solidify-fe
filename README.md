# 🌍 Solidify

**Solidify** is a React-based web application designed to help **Tech-based SMEs (Small and Medium Enterprises)** achieve **Net Zero Carbon Emissions**.  
It provides tools, dashboards, and resources to guide businesses toward more sustainable operations.

---

## 🚀 Overview

Solidify begins with a **welcome page** that introduces the mission and purpose of the platform.  
From there, users can navigate to key pages such as **Login**, **Change Password**, and the **Dashboard**.

---

## 🧩 Features

### 🏠 Welcome Page

- Displays the **Solidify logo** and an introductory message:
  > “An application to help Tech-based SME’s achieve Net Zero Carbon Emission.”
- Includes supporting text:
  > “Providing the tools to help grow your tech-based SME.”
- Contains a **Proceed** button that routes users to the login page.

### 🔐 Login Page

- Allows users to access their accounts.
- Includes form validation and styled input fields.
- Provides navigation to password reset if needed.

### 🔑 Change Password Page

- Enables users to reset or update their account password securely.

### 📊 Dashboard

- Central hub for authenticated users.
- Displays key metrics, analytics, and sustainability tools (planned enhancements).

---

## 🧱 Project Structure

                        ┌───────────────────────┐
                        │      Solidify App     │
                        │     (App.jsx Root)    │
                        └──────────┬────────────┘
                                   │
                                   ▼
                      ┌──────────────────────────┐
                      │      Welcome Page        │
                      │  (Intro & Proceed Btn)   │
                      └──────────┬───────────────┘
                                 │
                     navigate("/login")
                                 │
                                 ▼
                      ┌──────────────────────────┐
                      │       Login Page         │
                      │  (User Authentication)   │
                      └──────────┬───────────────┘
                  ┌──────────────┴───────────────┐
                  │                              │

navigate("/change-password") navigate("/dashboard")
│ │
▼ ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│ Change Password Page │ │ Dashboard │
│ (Reset or Update Pass) │ │ (Insights & Analytics) │
└──────────────────────────┘ └──────────────────────────┘

---

## ⚙️ Technologies Used

| Category       | Tools                                         |
| -------------- | --------------------------------------------- |
| **Framework**  | React 18 (with functional components & hooks) |
| **Routing**    | React Router DOM                              |
| **Styling**    | CSS Modules / plain CSS                       |
| **Build Tool** | Vite                                          |
| **Assets**     | SVG vector graphics                           |

---

## 🧭 Navigation Flow

Routes are defined in [`main.jsx`](./src/main.jsx):

````jsx
<Routes>
  <Route path="/" element={<WelcomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/change-password" element={<ChangePasssword />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>


```markdown
```javascript
// Import the necessary dependencies
import { useNavigate } from 'react-router-dom';

// Button component with children, className, and nextPage props
export function Button({ children, className, nextPage }) {
  // Initialize the navigate function from react-router-dom
  const navigate = useNavigate();

  // Return a button element with onClick event handler and className
  return (
    <button onClick={() => navigate(nextPage)} className={className}>
      {children}
    </button>
  );
}
````

```

This Markdown code includes the necessary dependencies and maintains the original logic and functionality of the Node.js code. The comments are added to explain the purpose of each part of the code.

```
