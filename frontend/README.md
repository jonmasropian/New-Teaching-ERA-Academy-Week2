# ERA Tech Solutions — Help Desk Frontend

Frontend for the ERA Academy Week 2 backend course.
Built with React + Vite + Tailwind CSS.

## Prerequisites
- Node.js installed
- Your backend server running on port 3000

## Setup
1. git clone [repo-url]
2. cd ERA-HelpDesk-Week2/frontend
3. npm install
4. cp .env.example .env
5. Confirm .env contains: VITE_API_URL=http://localhost:3000
6. npm run dev
7. Open browser at http://localhost:5173

## Notes
- The backend must be running before starting the frontend
- Do not commit your .env file
- Default test login: admin@eratech.com

## Day 5 Demo Flow
1. Start your backend: npm run dev
2. Start this frontend: npm run dev
3. Open http://localhost:5173
4. Log in with your test credentials
5. Dashboard shows welcome message, ticket stats, recent activity
6. Click Submit Ticket and create a new support ticket
7. Click All Tickets and see your ticket in the list
8. Click View Details on any ticket
9. Top section shows MySQL ticket data
10. Middle section shows MongoDB technician notes
11. Bottom section shows MongoDB activity logs
12. Add a note and watch it appear immediately
13. Notice the database labels — MySQL and MongoDB
    both powering the same page
