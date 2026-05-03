# Solidify — User Manual (User + Admin)

**Applies to repository:** `Aliu2211/Solidify-fe`  
**Deployed frontend:** https://solidify-fe.vercel.app  
**Last updated:** 2026-05-03 12:15:33  

---

## Table of Contents

1. [About Solidify](#1-about-solidify)
2. [Who This Manual Is For](#2-who-this-manual-is-for)
3. [System Requirements](#3-system-requirements)
4. [Accessing the App](#4-accessing-the-app)
5. [Account, Login & Security](#5-account-login--security)
6. [Understanding the Layout](#6-understanding-the-layout)
7. [Dashboard (Home)](#7-dashboard-home)
8. [Carbon Entry](#8-carbon-entry)
9. [Sustainability Choices](#9-sustainability-choices)
10. [Library](#10-library)
11. [News](#11-news)
12. [Chat](#12-chat)
13. [Find SME](#13-find-sme)
14. [Settings & Profile](#14-settings--profile)
15. [Admin Portal](#15-admin-portal)
16. [Troubleshooting & FAQs](#16-troubleshooting--faqs)
17. [Quick Reference (URLs)](#17-quick-reference-urls)

---

## 1) About Solidify

**Solidify** is a sustainability-focused web platform built to help **tech-based SMEs** track, understand, and reduce their **carbon emissions** on a journey toward **Net Zero**.

From the user side, Solidify provides:
- A **dashboard** with sustainability insights
- A workflow to **log carbon entries**
- **Resources** (Sustainability Choices + Library)
- **News** updates
- **Chat** for communication/support

From the admin side, Solidify provides tools to manage:
- Users
- Organizations
- Courses/knowledge content
- News
- Library resources

---

## 2) Who This Manual Is For

This manual is written for:
- **End Users** (SME members using Solidify to track sustainability)
- **Administrators** (admins managing users and content)

If you only want one version (User-only or Admin-only), you can split this file later into two manuals.

---

## 3) System Requirements

### 3.1 Supported browsers
Use a modern, up-to-date browser:
- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

### 3.2 Network requirements
Solidify depends on a backend API. If the backend is unreachable, some pages may load but show no data.

---

## 4) Accessing the App

### 4.1 Open the deployed application
1. Visit: https://solidify-fe.vercel.app
2. You will see the **Welcome** screen.
3. Click **Proceed** to go to the login screen.

### 4.2 Using direct links
You can also navigate directly if you know the URL path (see [Quick Reference](#17-quick-reference-urls)).

---

## 5) Account, Login & Security

### 5.1 Logging in
1. Open `/login`
2. Enter your identifier (email/username depending on backend configuration) and password.
3. Submit.
4. If successful, you will be taken to the authenticated part of the app.

> Tip: If you try to open a protected page while logged out, you will be redirected back to `/login`.

### 5.2 Forgot password
If you can’t remember your password:
1. Open `/forgot-password`
2. Enter the email address on your account
3. Submit and check your inbox for reset instructions

### 5.3 Reset password
1. Open `/reset-password`
2. Paste the reset token (from the email) and choose a new password
3. Submit
4. After reset, return to `/login` and sign in

### 5.4 Change password (while logged in)
1. Open `/change-password`
2. Enter your current password
3. Enter a new password
4. Save

### 5.5 Session & security notes (important)
- Solidify uses access/refresh tokens stored in the browser to keep you signed in.
- If your session expires, the app may automatically redirect you back to login.
- For admin pages, Solidify verifies that your account role is `admin`.

---

## 6) Understanding the Layout

### 6.1 Header
Most logged-in pages show a header that typically contains:
- The **Solidify logo** (click to return to Home)
- A **Search** bar
- **Tabs** (main navigation)
- Your **Profile** section

### 6.2 Mobile layout
On smaller screens the navigation may collapse into a mobile menu.

---

## 7) Dashboard (Home)

**URL:** `/home`

The dashboard is the main landing page after login and provides a summary of your progress.

### 7.1 Welcome section
At the top you should see:
- A time-based greeting (Good Morning/Afternoon/Evening)
- Your name (if your profile data is available)
- Quick actions to get started

### 7.2 Quick actions
- **Add Carbon Entry** → takes you to `/carbon-entry`
- **View Resources** → takes you to `/sustainability-choices`

### 7.3 Statistics cards
The dashboard shows key metrics such as:
- **Total Emissions** (kg CO₂)
- **Sustainability Level** (e.g., level 1/3, 2/3, 3/3)
- **Monthly Average** emissions
- **Goal Progress** percentage

If you are a new user and no data exists yet, these values may display as 0 or show guidance like “Add entries to track”.

### 7.4 Sustainability roadmap
The roadmap panel:
- Shows how many milestones are completed
- Displays a progress bar
- May allow you to toggle “View Details” to see milestone descriptions

### 7.5 Latest sustainability news
The dashboard also includes a “Latest News” preview.
- Click **View All** to open the full news section.

---

## 8) Carbon Entry

**URL:** `/carbon-entry`

The Carbon Entry page is where you log emission-related activity.

### 8.1 Typical workflow
1. Open Carbon Entry
2. Fill out the form fields (activity, quantity, date/category depending on what’s shown)
3. Submit the entry
4. Return to Dashboard to see updated totals/trends (if available)

### 8.2 Tips for accurate tracking
- Enter entries regularly (daily/weekly)
- Be consistent with units and categories
- If you make a mistake, check whether the UI provides editing/deletion (depends on backend + UI availability)

---

## 9) Sustainability Choices

**URL:** `/sustainability-choices`

This section provides curated sustainability actions and guidance.

What you can do here typically includes:
- Browsing recommended sustainability practices
- Reviewing guidance materials
- Using the section as a “learning hub” to improve your sustainability level

---

## 10) Library

**URLs:**
- `/library` (list)
- `/library/:id` (details)

The Library contains longer-form learning resources.

### 10.1 Library list
Use this page to browse available items.

### 10.2 Library detail
Open a specific item to read/view it in full.

---

## 11) News

**URLs:**
- `/news` (list)
- `/news/:slug` (article detail)

### 11.1 News list
Use this page to browse sustainability news. Articles may include:
- Title
- Category
- Summary
- Image

### 11.2 News detail
Select an article to read the full story.

---

## 12) Chat

**URL:** `/chat`

Chat enables real-time messaging. In many cases it uses a socket connection so messages can update instantly.

### 12.1 Basic usage
1. Open Chat
2. Select a user/conversation (if prompted)
3. Type and send your message

### 12.2 Common issues
- If you are logged out, Chat will redirect to login.
- If the backend/socket server is down, Chat may not connect.

---

## 13) Find SME

**URL:** `/find-SME`

This section is intended to help you find SMEs/experts (depending on how the backend is configured).

Typical actions:
- Searching
- Filtering
- Selecting a profile or contact option

---

## 14) Settings & Profile

**URL:** `/settings`

This section contains account-level controls.

What you may find here:
- Profile information
- Preferences (if enabled)
- Account/security actions

> Note: The exact options depend on what your backend enables for your user role.

---

## 15) Admin Portal

The admin portal is only accessible to authenticated users with role `admin`.

### 15.1 Admin login
**URL:** `/admin/login`

If your account is admin-enabled, log in here to access the admin dashboard.

### 15.2 Admin dashboard
**URL:** `/admin`

The admin dashboard contains tools for managing the platform:
- **Overview** (default)
- **Users** (`/admin/users`)
- **Courses** (`/admin/courses`)
- **Library** (`/admin/library`)
- **News** (`/admin/news`)
- **Organizations** (`/admin/organizations`)

### 15.3 Admin access behavior
If you attempt to open `/admin` without admin privileges:
- You may see an “Access Denied” message
- You will be redirected back to the normal user dashboard (`/home`)

---

## 16) Troubleshooting & FAQs

### 16.1 I keep getting redirected to Login
Cause: you are not authenticated, your token expired, or the backend rejected your session.

Fix:
1. Go to `/login` and log in again.
2. If you forgot your password, use `/forgot-password`.

### 16.2 The app loads but shows no data
Cause: backend API is unreachable, blocked by CORS, or returning errors.

Fix:
- Check your internet connection
- Try again later
- If you run locally, confirm the backend URL and that the backend server is running

### 16.3 A page says Not Found (404)
Cause: the URL is wrong or the route does not exist.

Fix:
- Use the navigation tabs
- Go to `/home`

### 16.4 Chat doesn’t connect
Cause: socket server is down or blocked.

Fix:
- Refresh the page
- Log out and log back in
- Confirm backend/socket endpoints are running

---

## 17) Quick Reference (URLs)

### Public
- `/` — Welcome
- `/login` — User login
- `/forgot-password` — Request reset
- `/reset-password` — Reset password
- `/change-password` — Change password

### Protected (login required)
- `/home` — Dashboard
- `/carbon-entry` — Carbon entry
- `/sustainability-choices` — Sustainability resources
- `/library` — Library
- `/library/:id` — Library detail
- `/news` — News list
- `/news/:slug` — News detail
- `/chat` — Chat
- `/find-SME` — Find SME
- `/settings` — Settings

### Admin (admin role required)
- `/admin/login` — Admin login
- `/admin` — Admin dashboard
- `/admin/users`
- `/admin/courses`
- `/admin/library`
- `/admin/news`
- `/admin/organizations`