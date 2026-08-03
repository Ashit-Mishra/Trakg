# Trakg

A role-based Attendance Management System built with Spring Boot. The application provides secure authentication, academic management, teacher assignment, and attendance tracking for educational institutions.

## Features

- JWT Authentication & Role-Based Authorization
- Academic Session Management
- Department Management
- Semester Management
- Subject Management
- Class Section Management
- Teacher Management
- Student Management
- Teacher–Subject Assignment
- Attendance Management
- Teacher Dashboard
- Student Dashboard
- User Enable/Disable

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven

### Database
- MySQL

### Authentication
- JWT (JSON Web Token)

## Project Structure

```
src/main/java
├── config
├── controller
├── dto
├── entity
├── enums
├── repository
├── security
├── service
└── util
```

## API Modules

- Authentication
- Academic Sessions
- Departments
- Semesters
- Subjects
- Class Sections
- Teachers
- Students
- Teacher Subject Assignments
- Attendance
- User Management

## Roles

### Admin

- Manage Academic Sessions
- Manage Departments
- Manage Semesters
- Manage Subjects
- Manage Class Sections
- Create Teachers
- Create Students
- Assign Teachers to Subjects
- Enable/Disable Users

### Teacher

- View Profile
- View Assigned Subjects
- Mark Attendance
- View Attendance History
- Update Attendance

### Student

- View Profile
- View Overall Attendance
- View Subject-wise Attendance

## Running Locally

Clone the repository

```bash
git clone https://github.com/your-username/Trakg.git
```

Navigate to the project

```bash
cd Trakg
```

Configure your MySQL database in `application.properties`.

Run the project

```bash
mvn spring-boot:run
```

The application will start on

```
http://localhost:8080
```

## Future Improvements

- Frontend (React)
- Docker Support
- Swagger Documentation
- Global Exception Handling
- Unit & Integration Tests

## License

This project is developed for learning purposes.
