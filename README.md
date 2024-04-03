# URL Shortener Microservice (Shortify)

This URL Shortener Microservice is a web application that allows users to shorten long URLs into shorter and more manageable links. It provides an API interface for creating and managing shortened URLs.

## Introduction

The URL Shortener Microservice is a simple yet powerful tool designed to make sharing long URLs easier. It allows users to generate short, unique codes for their URLs, which can then be used to access the original long URL. This microservice provides a convenient way to manage and track the usage of shortened URLs.

## Technology Used

The URL Shortener Microservice is built using the following technologies:

- Node.js: A JavaScript runtime environment for server-side development.
- Express.js: A fast and minimalist web application framework for Node.js.
- MongoDB: A popular NoSQL database for storing and managing data.
- JWT (JSON Web Tokens): A secure method for token-based authentication and authorization.
- bcrypt: A library for hashing passwords to enhance security.

## APIs

The URL Shortener Microservice provides the following APIs:

1. **Register API**
   - Endpoint: `/register`
   - Method: POST
   - Description: Allows users to register an account by providing an email and password.
   - Input Parameters: `email` (string), `password` (string)
   - Output: Returns a JWT token upon successful registration.

2. **Login API**
   - Endpoint: `/login`
   - Method: POST
   - Description: Allows users to log in to their account using their email and password.
   - Input Parameters: `email` (string), `password` (string)
   - Output: Returns a JWT token upon successful login.

3. **Shorten API**
   - Endpoint: `/shorten`
   - Method: POST
   - Description: Generates a shortened URL for the provided long URL.
   - Input Parameters: `originalUrl` (string), `customCode` (string, optional), `expiration` (date)
   - Output: Returns the generated short code and the shortened URL.

4. **Get URL Collection API**
   - Endpoint: `/shorten`
   - Method: GET
   - Description: Retrieves the URL collection for the authenticated user.
   - Input Parameters: None
   - Output: Returns the list of shortened URLs associated with the user's account, including the original URL, short code, creation date, expiration date, and click count.

5. **Redirect Shortened URL API**
   - Endpoint: `/shorten/:shortCode`
   - Method: GET
   - Description: Redirects to the original URL associated with the provided short code.
   - Input Parameters: `shortCode` (string)
   - Output: Redirects the user to the original URL.

6. **Delete Shortened URL API**
   - Endpoint: `/delete/:shortcode`
   - Method: DELETE
   - Description: Deletes the specified shortened URL.
   - Input Parameters: `shortcode` (string)
   - Output: Returns a success message upon successful deletion.

7. **Delete Account API**
   - Endpoint: `/account`
   - Method: DELETE
   - Description: Deletes the user's account and all associated URL collections.
   - Input Parameters: None
   - Output: Returns a success message upon successful deletion.


