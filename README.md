# School Manager

**School Manager** is a web-based application designed to streamline the management of school operations, including course administration and student registrations. Built with modern web technologies, it offers an intuitive interface for both administrators and students.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Admin Functionality**:

  - Create, update, and delete courses.
  - View all registered students for each course.
  - Manage course enrollment efficiently.

- **Student Functionality**:
  - Browse available courses.
  - Register for desired courses.
  - View and manage their enrolled courses.

## Technologies Used

- **Frontend**:

  - [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) for fast development and build tooling
  - [Tailwind CSS](https://tailwindcss.com/) for styling

- **Backend**:
  - [Firebase](https://firebase.google.com/) for authentication and Firestore as the database

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Terry-Magnus/School-Manager.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd School-Manager
   ```

3. **Install dependencies**:

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

4. **Configure Firebase**:

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Set up Firestore and Authentication.
   - Obtain your Firebase configuration and replace the placeholder in the project.

5. **Start the development server**:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Usage

- **Admin**:

  - Log in using admin credentials.
  - Navigate to the "Courses" section to manage courses.
  - Use the interface to add, edit, or delete courses.
  - Upload Student results

- **Student**:
  - Register or log in using student credentials.
  - Browse available courses and register for desired ones.
  - View registered courses in the "My Courses" section.
  - View results from registered courses.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```

3. Make your changes.
4. Commit your changes:

   ```bash
   git commit -m "Description of changes"
   ```

5. Push to your branch:

   ```bash
   git push origin feature-name
   ```

6. Open a Pull Request detailing your changes.

## License

This project is licensed under the [MIT License](LICENSE).

### Concerns I face while building

- Admins viewing general results while students view only their results
- Preventing students from registering a course twice
- Admins having the option to edit/delete a course and result
- Pagination
- Adding timestamps
- Debouncing search since volume of courses and students could become very large
