# KM100 MacroSync (Laravel 11 & React Vite)

Comprehensive Multi-Branch Inventory and Scanned Receipt Management System with role-based access control, dual-table synchronization, and zero-lag scoped caching.

---

## 🏛️ System Architecture

* **Backend (`/BACKEND`):**
  * **Framework:** Laravel 11 with PHP 8.3+
  * **Database:** MySQL 8.4 (`km100`) with InnoDB transactions
  * **Authentication:** Laravel Sanctum (Stateful Session Cookie + Bearer Token)
  * **API Version:** RESTful `/api/v1` endpoints with role-based branch scoping
  * **OCR & AI:** Integrated Google Gemini 1.5 Flash Vision & Tesseract OCR pipelines

* **Frontend (`/FRONTEND`):**
  * **Framework:** React 19 SPA with Vite
  * **Styling:** React Native for Web with unified responsive themes
  * **Caching:** Client-side user/branch scoped cache (`petc_cache_v3`) for 0ms account switching
  * **API Client:** Dedicated REST adapter connecting exclusively to Laravel `/api/v1`

---

## 🚀 Quick Start (Windows)

Use the pre-configured root batch scripts:

* **Start Everything (Backend + Frontend + Browser):**
  ```cmd
  start-all.bat
  ```
* **Start Backend Only (`http://127.0.0.1:8000`):**
  ```cmd
  start-backend.bat
  ```
* **Start Frontend Only (`http://localhost:3000`):**
  ```cmd
  start-frontend.bat
  ```
* **Supabase-to-MySQL Migration Tool:**
  ```cmd
  transfer-supabase-to-mysql.bat
  ```

---

## 🔒 Branch Access & Role Scoping

| Account Role | Branch Access | Document Scope |
| :--- | :--- | :--- |
| **Administrator** | All Branches | Full system access to all documents, audit logs, and employee creation |
| **Employee Staff** | **Knoah Mari** | Exclusively filtered to Knoah Mari branch expense receipts |
| **Employee Staff** | **Red Goose** | Exclusively filtered to Red Goose branch expense receipts |
| **Employee Staff** | **PETC** | Exclusively filtered to PETC branch expense & sales receipts |

---

## 📦 Environment Setup

1. **Backend:**
   * Copy `BACKEND/.env.example` to `BACKEND/.env`
   * Configure MySQL database credentials (`DB_DATABASE=km100`)
   * Run migrations: `php artisan migrate`

2. **Frontend:**
   * Copy `FRONTEND/.env.example` to `FRONTEND/.env`
   * Set `VITE_API_URL=http://localhost:8000/api/v1`
   * Run `npm install` and `npm run dev`
