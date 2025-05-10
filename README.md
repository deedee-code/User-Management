# User-Management

This is a Node.js-based application that provides user authentication features, including user registration, login, password reset via OTP, and email notifications using `nodemailer`.

## Features

- **User Registration**: Allows users to register with their first name, last name, email, and password.
- **User Login**: Authenticates users with email and password.
- **Forget Password**: Sends a 6-digit OTP to the user's email for password reset.
- **Verify OTP and Reset Password**: Verifies the OTP and allows users to reset their password.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- Postman (for API testing)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eduCentral

2. Install Dependencies:
    ```bash
    npm install

3. Crate a .env file in the root directory and add the following environment variables:
    ```bash
    PORT=3000
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-password-or-app-password

4. Start the server
    ```bash
    npm run dev

API Documentation: [Postman](https://documenter.getpostman.com/view/26786258/2sB2j98Urt)