# Book Quote Vault

A modern full-stack web application designed to help book lovers store, organize, and cherish their favorite quotes and excerpts from books. 

With Book Quote Vault, you can build your personal digital library, color-code your books, add quotes with page references, mention character names, and assign tags to categorize your favorite passages.

---

## 🚀 Features

- **Personal Library (Books CRUD)**: Manage your books with titles, authors, custom covers, and automatic theme/palette rendering.
- **Quote Vault (Quotes CRUD)**: Store quotes for each book, including:
  - Page number
  - Character/Speaker (Optional)
  - Custom tags (up to 5 tags per quote)
- **Hassle-Free Authentication**:
  - **Local Authentication**: Register/Login with email and password.
  - **Google OAuth2 Login**: Secure, single-click social login using your Google account.
  - **Password Recovery**: Send a secure reset link to your email with a 15-minute token expiry.
- **Elegant User Interface**: Modern design built with Tailwind CSS v4, dynamic color themes matching book covers, clean dialog modals, and micro-interactions.

---

## 🛠️ Tech Stack

### Backend
- **Core Framework**: Spring Boot (v4.1.0) / Java 17
- **Security**: Spring Security + JWT (JSON Web Tokens) + Spring Security OAuth2 Client
- **Database Access**: Spring Data JPA + Hibernate
- **Database**: PostgreSQL (v15)
- **Mailing**: Spring Mail (Gmail SMTP)
- **Utilities**: Lombok, spring-dotenv (for environment variable loading)

### Frontend
- **Framework**: React (v19) + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **State Management & Routing**: React Context API, React Router (v7)
- **API Client**: Axios (with authorization interceptors)
- **Validation**: Zod (for type schemas)
- **Icons**: Lucide React

---

## 📦 Project Structure

```text
book-quote-vault/
├── backend/               # Spring Boot Application
│   ├── src/               # Java Source & Resources
│   ├── .env.example       # Example Environment Variables
│   └── pom.xml            # Maven Configuration
├── frontend/              # React App
│   ├── src/               # React Code (Pages, Components, Contexts, Types)
│   ├── package.json       # Frontend Dependencies & Scripts
│   └── tsconfig.json      # TypeScript Configuration
├── docker-compose.yml     # PostgreSQL Database Container
└── README.md              # Project Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Java 17 JDK](https://www.oracle.com/java/technologies/downloads/)
- [Node.js](https://nodejs.org/) (v18+ recommended) & npm

### 1. Database Setup
Spin up the PostgreSQL database container using Docker Compose:

```bash
docker compose up -d
```
*The database will run on `localhost:5433`.*

---

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in the required configuration parameters:
   - **DB_PASSWORD**: Password for PostgreSQL (`postgrespassword` is configured in `docker-compose.yml`).
   - **JWT_SECRET**: A secure random string (minimum 256-bit / 32 characters).
   - **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: Credentials from Google Cloud Console (if using Google OAuth2).
   - **GMAIL_USERNAME** & **GMAIL_APP_PASSWORD**: Gmail credentials for sending recovery emails.

4. Run the backend server using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The API server will start on `http://localhost:8080`.*

---

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The React application will be available at `http://localhost:5173`.*

---

## 🔑 Environment Variables Reference

Inside `backend/.env`:

| Key | Description | Example / Default |
|---|---|---|
| `DB_PASSWORD` | Password for the PostgreSQL DB | `postgrespassword` |
| `JWT_SECRET` | Secure cryptographic secret key for signing JWTs | `your_32_character_secret_key` |
| `JWT_EXPIRATION` | Expiry duration in milliseconds | `86400000` (24 Hours) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | *From Google Console* |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | *From Google Console* |
| `GMAIL_USERNAME` | SMTP sender email address | `your_email@gmail.com` |
| `GMAIL_APP_PASSWORD` | App password generated in Google Account settings | `abcd efgh ijkl mnop` |
