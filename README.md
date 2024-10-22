# Receptionist and Doctor Management System

This Node.js application allows both receptionists and doctors to log in through a single route. Receptionists can register new patients and perform full CRUD operations (Create, Read, Update, Delete) on patient records, while doctors can view and update patient details.
## Features

- **Admin Features:**
  - Login System: A single login route for both receptionists and doctors.
  - Role-based Access:
  - Receptionist: Can register new patients, view all patient records, update patient information, and delete patient records.
  - Doctor: Can view all patient records and update specific patient details.
  - Authentication: JWT-based authentication to protect routes.
  - MongoDB: Database for storing user and patient data.

- **Tech Stack**
  - Backend: Node.js, Express.js
  - Database: MongoDB
  - Authentication: JWT (JSON Web Token)
  - Password Hashing: Bcrypt

