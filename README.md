
# Student Audit Management System

## 1. Project Overview

The Student Audit Management System is a web application designed to help the Student Audit Unit manage audits and track findings for clubs, forums, units and hostels.

The system allows auditors to create audits, record findings, assign findings to responsible representatives and track each finding until it is resolved. It also provides role-based access, a dashboard, overdue highlighting and CSV export.

## 2. Features

- User login and session management.
- Three user roles: admin, auditor and representative.
- Admin management of users and audited units.
- Create and view audit records.
- Record findings with descriptions, severity, recommendations, responsible representatives and due dates.
- Filter findings by audit, audited unit and status.
- Update finding status from Open to In Progress to Resolved.
- Store status history, update notes, the responsible user and timestamps.
- Highlight overdue findings.
- Dashboard showing finding counts and recent findings.
- Export findings to a CSV file.
- Restrict representatives to findings and audits belonging to their own unit.
- Restrict status updates to the representative assigned to the finding.

## 3. Technology Stack

- Node.js
- Express.js
- EJS
- PostgreSQL
- pg-promise
- bcrypt
- express-session
- dotenv
- nodemon
- Postman for request and permission testing

## 4. Project Setup

### Prerequisites

Install Node.js, PostgreSQL, pgAdmin, Git and a code editor. Postman is needed for the API request tests.

### Step 1: Clone the repository

```bash
git clone https://github.com/thuktenyouzer-dev/student_audit.git
cd Student_Audit_Management_System
```


### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create the database

Open pgAdmin and create a PostgreSQL database named:

```text
audit_db
```

Select `audit_db` and run the SQL in these files in the following order:

1. `sql/schema.sql`
2. `sql/seed_units.sql`

### Step 4: Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and enter the correct PostgreSQL credentials and a private random session secret.

Example variable names:

```dotenv
PORT=3000
SESSION_SECRET=replace-with-your-own-random-secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=audit_db
DB_USER=postgres
DB_PASS=thuks1
```


### Step 5: Create the initial test accounts

Run:

```bash
npm run seed
```

This creates the initial development accounts when the seed script is configured and the accounts do not already exist.

### Step 6: Start the application

For development:

```bash
npm run dev
```

Or run the normal start command:

```bash
npm start
```

Open the application in your browser:

http://localhost:3000

## 5. Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express server |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASS` | PostgreSQL password |


## 6. Roles and Development Test Accounts

The application has three roles.

| Role | Permissions |
|---|---|
| Admin | Manage users and audited units, view audits and findings, and access the overall dashboard |
| Auditor | Create audits and findings, assign representatives, view records and export findings |
| Representative | View records for their own unit and update findings assigned to them |

The lab guide provides these development test accounts:

| Role | Email | Development password |
|---|---|---|
| Admin | `admin@audit.test` | `Admin@12345` |
| Auditor | `auditor@audit.test` | `Auditor@12345` |
| Representative | `rep@audit.test` | `Rep@12345` |


## 7. Database Design

The database contains five main tables:

| Table | Purpose |
|---|---|
| `audited_units` | Stores clubs, forums, units and hostels |
| `users` | Stores account details, password hashes, roles and unit assignments |
| `audits` | Stores audit details and the audited unit |
| `findings` | Stores findings, severity, recommendations, assignment, status and due date |
| `status_updates` | Stores the history of finding status changes |

### Main relationships

- One audited unit can have many audits.
- One audited unit can have many representatives.
- One audit can have many findings.
- One finding can have many status updates.
- Users can create audits, be assigned findings and record status updates.

### Entity Relationship Diagram (ERD)

Add the ERD image produced for this project to the `docs` folder and link it here. For example, if the image is saved as `docs/ERD.png`, use:

![Student Audit Management System ERD](docs/ERD.png)

## 8. Testing with Postman

The Postman collection is stored in the `docs` folder.

It contains requests for login, dashboard access, user management, audit creation, finding creation, finding filters, finding details, status updates, CSV export and logout.

Import the exported Postman collection into Postman. Start the server and log in with the appropriate test account before running protected requests.

Test the permissions of all three roles, including requests made while logged out.

## 9. Team Members and Responsibilities

Update this table to match your team's actual contributions.

| Team member | Responsibility |
|---|---|
| Tashi Tshering | Database and integration |
| Yeshi Tshomo | Authentication |
| Deki Choden | Audited units and audits |
| Tandin Wangchuk | Findings |
| Thukten Yoezer | Status workflow |
| Susel Rai | Testing and documentation |

## 10. Security Notes

- Passwords are hashed with bcrypt.
- Access to routes is controlled by authentication and role checks.
- Representatives are restricted to their own unit.
- Only the representative assigned to a finding can update its status.
- Database queries use parameters to help prevent SQL injection.
- The `.env` file must not be committed to GitHub.
- Replace the development test passwords and session secret before deploying the system.

## 11. Future Improvements

Possible future enhancements include automated tests, a JWT-based JSON API, notifications, evidence uploads and deployment.
