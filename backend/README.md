# ERA Tech Solutions — Help Desk Backend
 
A REST API for an IT Help Desk / Support Ticket System built during ERA Academy Week 2.
This backend powers a full-stack help desk application using two databases:
MySQL for structured relational data and MongoDB for flexible document-based data.
 
## Tech Stack
- Node.js
- Express
- MySQL (mysql2)
- MongoDB (native driver)
- dotenv
- cors
- nodemon (development)
 
## Database Design
 
### MySQL — helpdesk_db
Stores structured, relational business data.
 
| Table              | Description                              |
|--------------------|------------------------------------------|
| departments        | Company departments (IT, HR, Finance...) |
| users              | Employees and IT staff with roles        |
| tickets            | Support tickets with priority and status |
| ticket_assignments | History of ticket assignments            |
 
### MongoDB — helpdesk_db
Stores flexible, document-based support data.
 
| Collection    | Description                               |
|---------------|-------------------------------------------|
| ticket_notes  | Technician notes added to tickets         |
| activity_logs | System event logs (login, ticket created) |
 
## API Routes
 
### Auth
| Method | Route  | Description                         |
|--------|--------|-------------------------------------|
| POST   | /login | Login and return user info and role |
 
### Departments (MySQL)
| Method | Route        | Description         |
|--------|--------------|---------------------|
| GET    | /departments | Get all departments |
 
### Users (MySQL)
| Method | Route  | Description                 |
|--------|--------|-----------------------------|
| GET    | /users | Get all users (no password) |
| POST   | /users | Create a new user           |
 
### Tickets (MySQL)
| Method | Route                | Description                        |
|--------|----------------------|------------------------------------|
| GET    | /tickets             | Get all tickets                    |
| GET    | /tickets/open        | Get only open tickets              |
| GET    | /tickets/details     | Get all tickets with joined names  |
| GET    | /tickets/:id         | Get one ticket by ID               |
| GET    | /tickets/:id/details | Get one ticket with joined names   |
| POST   | /tickets             | Create a ticket + auto MongoDB log |
 
### Ticket Notes (MongoDB)
| Method | Route                   | Description              |
|--------|-------------------------|--------------------------|
| GET    | /ticket-notes           | Get all ticket notes     |
| GET    | /ticket-notes/:ticketId | Get notes for one ticket |
| POST   | /ticket-notes           | Add a note to a ticket   |
 
### Activity Logs (MongoDB)
| Method | Route          | Description                  |
|--------|----------------|------------------------------|
| GET    | /activity-logs | Get all logs (newest first)  |
| POST   | /activity-logs | Create a manual activity log |
 
## Setup
 
### Prerequisites
- Node.js installed
- MySQL running with the helpdesk_db database created
- MongoDB running locally
 
### Installation
1. Clone the repo:
```
git clone https://github.com/YOUR-USERNAME/ERA-HelpDesk-Week2.git
cd ERA-HelpDesk-Week2/backend
```
2. Install dependencies:
```
npm install
```
3. Create a .env file in the backend folder with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=helpdesk_db
MONGO_URI=mongodb://127.0.0.1:27017
```
4. Start the development server:
```
npm run dev
```
Server runs at http://localhost:3000
 
## Test Credentials
| Role     | Email              | Password   |
|----------|--------------------|------------|
| IT Staff | admin@eratech.com  | Admin@123  |
| IT Staff | sarah@eratech.com  | Sarah@123  |
| Employee | john@eratech.com   | John@1234  |
| Employee | lisa@eratech.com   | Lisa@1234  |
| Employee | marcus@eratech.com | Marcus@123 |
 
## Frontend
The frontend is a React + Vite + Tailwind CSS application in the frontend/ folder of this repo.
Start the backend first, then:
```
cd ../frontend
npm install
```
Create a .env file in the frontend folder with:
```
VITE_API_URL=http://localhost:3000
```
Then run:
```
npm run dev
```
Frontend runs at http://localhost:5173
 
## Password Rules
New user passwords must:
- Be at least 8 characters long
- Contain at least one special character: ! @ # $ %
 
## Built During
ERA Academy — Backend Development Course — Week 2