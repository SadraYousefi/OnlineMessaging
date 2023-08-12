# Online Messaging Application Documentation

Welcome to the documentation for the Online Messaging application. This document provides an overview of the project structure, features, and important concepts.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [WebSocket Gateway](#websocket-gateway)
- [Validation and Data Transfer Objects](#validation-and-data-transfer-objects)
- [Error Handling](#error-handling)
- [Getting Started](#getting-started)

## Project Structure

The project follows a modular structure, separating concerns into different modules:

- **src/core**: Contains core domain entities, data transfer objects (DTOs), and shared utility functions.
- **src/common**: Houses shared utilities, custom decorators, filters, and middleware.
- **src/frameworks**: Provides implementations for data services, websockets, and other infrastructure-related code.
- **src/use-cases**: Contains use cases and business logic for various application functionalities.
- **src/modules**: Represents different modules of the application, such as user authentication, messaging, etc.

## Features

- User Authentication and Authorization
- Real-time Messaging using WebSockets
- Private Conversations
- Message Pinning and Deletion

## WebSocket Gateway

The WebSocket Gateway (`ChatGateWay`) handles real-time communication between clients using WebSockets. It enables users to send and receive messages, toggle pin status, delete messages, and more.

## Validation and Data Transfer Objects

Validation of incoming data is crucial for maintaining data integrity. The application uses NestJS's `class-validator` library along with DTOs to validate data coming from the client. Custom decorators and validation rules are applied to ensure data consistency.

## Error Handling

Custom exception filters (`WebsocketExceptionsFilter`) are employed to handle WebSocket-related exceptions. These filters catch errors and send appropriate error messages to the client, ensuring a smoother user experience.

## Getting Started

1. Clone the repository: `git clone https://github.com/SadraYousefi/OnlineMessaging`
2. Install dependencies: `npm install`
3. Configure environment variables (if necessary).
4. Run the application: `npm run start`

Refer to the specific module's documentation for more details on how to use its features.

---

Feel free to update this documentation as your project evolves. For detailed instructions on each module and feature, consult the source code and any additional documentation you create.

Happy coding!
