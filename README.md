# 📚 NEU Library Visitor Log System

A modern, web-based visitor logging system designed specifically for the **New Era University Library**. This application streamlines the check-in process for students, faculty, and staff while providing administrators with powerful real-time data analytics.

🔗 **Live Demo:** [https://neulibrarylog-9b85a.web.app)

---

## ✨ Key Features

* **Secure Authentication**: Strict domain restriction—exclusive access for users with `@neu.edu.ph` email addresses via Google OAuth.
* **Role-Based Access**: Specialized interfaces for **Visitors** (entry logging) and **Administrators** (comprehensive data management).
* **Real-Time Analytics**: Live monitoring of entry statistics, including total visit counts and breakdowns by role (Student, Faculty, Staff).
* **Advanced Data Filtering**: Capability to filter logs by specific date ranges, colleges (e.g., CCS, CBA, CAS), or visit purposes (e.g., Research, Reading).
* **Professional Reporting**: Integrated **Export to PDF** feature using `jspdf-autotable` for one-click report generation.
* **Account Management**: Admin power to block/unblock specific users to maintain library security.

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Backend/Database**: Firebase Firestore (NoSQL)
* **Authentication**: Firebase Auth (Google OAuth 2.0)
* **Hosting**: Firebase Hosting
* **Tools**: jsPDF & AutoTable (Reporting), CSS3 (Responsive Design)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v14 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/kristinefaithbarsalote-sv/neu-library-log.git](https://github.com/kristinefaithbarsalote-sv/neu-library-log.git)
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment**:
    Create a `.env` file in the root directory and add your Firebase configuration keys.

4.  **Launch the App**:
    ```bash
    npm start
    ```

---

## 🔐 Administrative Access

To evaluate the administrative dashboard and management features, use one of the authorized accounts listed below:

| Authorized Admin Email | Access Method |
| :--- | :--- |
| `jcesperanza@neu.edu.ph` | NEU Google Login / NEU Password |
| `kassandra.valmoria@neu.edu.ph` | NEU Google Login / NEU Password |

> **Note**: For security purposes, ensure you are logged into your institutional Google account before attempting the "Google Admin Login." 

---
