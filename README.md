# Pro AI Chatbot & Lead Generation Agent

A lightweight, high-performance Node.js & Express AI agent designed for automated customer support and structured lead generation. Built locally and optimized for production deployment.

## Features
- **Smart Rule-Based AI Engine**: Instant query categorization and automated responses.
- **Structured JSON Database**: Automatically logs all user interactions and leads with timestamps (`database.json`).
- **Robust Error Handling**: Prevents server crashes on malformed requests.
- **RESTful API**: Clean POST endpoints ready for webhook and frontend integrations.

## Tech Stack
- Node.js
- Express.js
- File System (FS) Module

## API Usage
- **Endpoint**: `POST /api/chat`
- **Payload**: `{"message": "Your query here"}`
