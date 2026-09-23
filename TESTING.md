# Testing EstateHub

## Install test dependencies

```powershell
cd server
npm install
cd ../client
npm install
```

## Backend tests

The backend suite uses Jest, Supertest, and `mongodb-memory-server`. It creates isolated users, properties, units, bookings, enquiries, visits, and wishlists for each test.

```powershell
cd server
npm test
npm run test:coverage
npm run test:watch
```

The suite covers registration, bcrypt hashing, login/JWT authentication, admin and agent authorization, property/unit CRUD, wishlist isolation, enquiry and visit access, and booking security including amount tampering, payment status tampering, unavailable units, cross-property units, and cross-user booking access.

## Frontend tests

The frontend uses Vitest and Testing Library:

```powershell
cd client
npm test
npm run test:watch
```

The initial frontend test covers the login-to-forgot-password critical flow. Additional page tests can use the same Vitest and Testing Library setup.

Tests use an in-memory MongoDB instance and do not modify the development database.
