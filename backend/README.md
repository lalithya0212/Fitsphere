# FitSphere — Phase 1 Backend

> **"Empowering Campus Fitness. Building Future Athletes."**  
> Core Authentication & Role-Based Authorization Engine (Spring Boot 3 + Spring Security + JWT + MySQL)

---

## 1. Overview & Architecture

FitSphere Phase 1 delivers the foundational authentication, credential hashing, and role-based access control (RBAC) infrastructure for the collegiate sports and athletic training management platform.

### Supported Roles:
- `ADMIN`: Athletics Directors & Sports Administrators.
- `TRAINER`: Physical performance coaches & fitness trainers.
- `STUDENT`: Student-athletes and collegiate fitness participants.

---

## 2. Technology Stack

- **Java**: 21 LTS
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6, BCrypt Password Hashing (`strength = 12`)
- **JWT**: JJWT (`io.jsonwebtoken`) 0.12.6
- **Persistence**: Spring Data JPA, Hibernate, MySQL Connector/J (`com.mysql:mysql-connector-j`)
- **Validation**: Jakarta Bean Validation (`jakarta.validation-api`)
- **Documentation**: Springdoc OpenAPI 2.6.0 (Swagger UI at `/swagger-ui.html`)
- **Testing**: JUnit 5, Mockito, Spring Security Test

---

## 3. Package Structure

```
com.fitsphere
│
├── config
│   ├── AdminSeederConfig.java       # Automatic DB seed for initial Admin
│   ├── OpenApiConfig.java           # Swagger 3 & BearerAuth definitions
│   ├── PasswordEncoderConfig.java   # BCryptPasswordEncoder bean (strength 12)
│   └── SecurityConfig.java          # SecurityFilterChain, CORS, Stateless JWT
│
├── controller
│   └── AuthController.java          # Public registration, login, and /me profile
│
├── dto
│   └── auth
│       ├── AuthResponse.java        # Signed JWT & safe User profile
│       ├── LoginRequest.java        # Email + password
│       ├── StudentRegisterRequest.java # Student signup payload
│       ├── TrainerRegisterRequest.java # Trainer signup payload
│       └── UserResponse.java        # Sanitized user entity representation
│
├── entity
│   ├── Role.java                    # Enum: ADMIN, TRAINER, STUDENT
│   └── User.java                    # Mapped to 'users' table
│
├── exception
│   ├── AccountDeactivatedException.java
│   ├── ApiException.java
│   ├── EmailAlreadyExistsException.java
│   ├── ErrorResponse.java           # Structured error schema
│   ├── GlobalExceptionHandler.java  # @RestControllerAdvice
│   ├── InvalidCredentialsException.java
│   └── UserNotFoundException.java
│
├── mapper
│   └── UserMapper.java              # Entity <-> DTO bidirectional mapping
│
├── repository
│   └── UserRepository.java          # Spring Data JPA queries with email normalization
│
├── security
│   ├── CustomAccessDeniedHandler.java    # 403 Forbidden handler
│   ├── CustomUserDetailsService.java     # UserDetails provider from MySQL
│   ├── JwtAuthenticationEntryPoint.java # 401 Unauthorized handler
│   ├── JwtAuthenticationFilter.java     # OncePerRequestFilter parsing Bearer header
│   ├── JwtTokenProvider.java            # JJWT 0.12.x token generator & validator
│   └── UserPrincipal.java               # Spring Security UserDetails adapter
│
└── util
    └── SecurityUtils.java           # SecurityContextHolder helper
```

---

## 4. Configuration & Environment Variables

No secrets or database credentials are hardcoded. Configure the following environment variables:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `fitsphere` | Database name |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | *(empty)* | Database password |
| `SERVER_PORT` | `8080` | Spring Boot HTTP port |
| `JWT_SECRET` | *(256-bit default)* | HMAC-SHA secret for signing tokens |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | JWT validity duration in milliseconds |
| `ADMIN_INITIAL_PASSWORD` | `shyam123` | Password for automatically seeded Admin |

---

## 5. Getting Started

### 5.1. Prerequisites
- **Java 21 LTS** installed and configured on your `PATH`.
- **MySQL Server 8.x** running and accessible.
- **Maven 3.9+** installed.

### 5.2. Create Database
```sql
CREATE DATABASE IF NOT EXISTS fitsphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5.3. Build & Run
```bash
# Navigate to the backend directory
cd backend

# Run the test suite
mvn test

# Start the Spring Boot application
mvn spring-boot:run
```

---

## 6. Initial Administrator Account

On startup, `AdminSeederConfig` automatically checks if the administrator account exists. If not, it seeds the initial administrator:

- **Name**: `Shyam Raj`
- **Email**: `shyamraj@gmail.com`
- **Password**: Set via `ADMIN_INITIAL_PASSWORD` (Default: `shyam123`)
- **Role**: `ADMIN`

---

## 7. API Endpoints

### 7.1. Public Endpoints

#### Register Student
`POST /api/auth/register/student`
```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@university.edu",
  "password": "StudentPassword123!",
  "phone": "+1 (555) 234-5678"
}
```
**Response (201 Created)**:
```json
{
  "id": 2,
  "name": "Alex Morgan",
  "email": "alex.morgan@university.edu",
  "phone": "+1 (555) 234-5678",
  "role": "STUDENT",
  "active": true,
  "createdAt": "2026-10-05T05:15:30.123Z"
}
```

#### Register Trainer
`POST /api/auth/register/trainer`
```json
{
  "name": "Coach Dave Miller",
  "email": "coach.dave@university.edu",
  "password": "CoachPassword123!",
  "phone": "+1 (555) 876-5432"
}
```
**Response (201 Created)**:
```json
{
  "id": 3,
  "name": "Coach Dave Miller",
  "email": "coach.dave@university.edu",
  "phone": "+1 (555) 876-5432",
  "role": "TRAINER",
  "active": true,
  "createdAt": "2026-10-05T05:16:10.456Z"
}
```

#### Login
`POST /api/auth/login`
```json
{
  "email": "shyamraj@gmail.com",
  "password": "shyam123"
}
```
**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaHlhbXJhakBnbWFpbC5jb20iLCJpZCI6MSwibmFtZSI6IlNoeWFtIFJhaiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc5Mzg1MjAwMCwiZXhwIjoxNzkzOTM4NDAwfQ...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "name": "Shyam Raj",
    "email": "shyamraj@gmail.com",
    "phone": "+1 (555) 000-0001",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2026-10-05T05:14:00.000Z"
  }
}
```

### 7.2. Protected Endpoints

#### Get Current User Profile
`GET /api/auth/me`  
**Headers**: `Authorization: Bearer <JWT_TOKEN>`  
**Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Shyam Raj",
  "email": "shyamraj@gmail.com",
  "phone": "+1 (555) 000-0001",
  "role": "ADMIN",
  "active": true,
  "createdAt": "2026-10-05T05:14:00.000Z"
}
```

---

## 8. Interactive Documentation (Swagger UI)

When the application is running, navigate to:
```
http://localhost:8080/swagger-ui.html
```
- Click the **Authorize** button in Swagger UI.
- Enter `Bearer <your_token>` or `<your_token>` to test protected endpoints interactively.
