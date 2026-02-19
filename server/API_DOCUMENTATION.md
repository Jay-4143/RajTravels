# Travel Booking API Documentation

Backend API for Akbar Travels-style travel booking platform.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT in header for protected routes:
```
Authorization: Bearer <token>
```

---

## 1. AUTH - `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| POST | /register | Public | Register user (name, email, password) |
| POST | /login | Public | Login (email, password) |
| POST | /forgot-password | Public | Send reset link (email) |
| POST | /reset-password | Public | Reset password (token, password) |
| GET | /me | Private | Get current user profile |
| PUT | /profile | Private | Update profile (name, phone) |
| PUT | /password | Private | Update password (currentPassword, newPassword) |
| POST | /logout | Private | Invalidate token |

---

## 2. FLIGHTS - `/api/flights`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| GET | /search | Public | Search: from, to, departureDate, returnDate?, passengers?, class?, sort?, order?, airline?, minPrice?, maxPrice?, maxStops?, page?, limit? |
| GET | / | Public | List all flights (paginated) |
| GET | /:id | Public | Get flight details |
| GET | /:id/seats | Public | Get available seats |
| POST | /:id/calculate-price | Public | Calculate price (passengers?, seats?) |

---

## 3. HOTELS - `/api/hotels`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| GET | /search | Public | Search: city, minPrice?, maxPrice?, minRating?, starCategory?, amenities?, sort?, page?, limit? |
| GET | / | Public | List all hotels |
| GET | /:id | Public | Get hotel with rooms |
| GET | /:hotelId/rooms/availability | Public | Check availability: checkIn, checkOut |

---

## 4. PACKAGES - `/api/packages`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| GET | / | Public | List: type?, destination?, minPrice?, maxPrice?, sort?, page?, limit? |
| GET | /:id | Public | Get package details |
| POST | /:id/inquiry | Public | Submit inquiry (name, email, phone, message?, travelDate?, numberOfPeople?) |

---

## 5. VISA - `/api/visa`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| GET | /countries | Public | List countries with visas |
| GET | /my-applications | Private | User's visa applications |
| GET | / | Public | List: country?, visaType?, page?, limit? |
| GET | /:id | Public | Get visa details |
| POST | /:id/apply | Private | Submit application (fullName?, email?, phone?, passportNumber?, nationality?, travelDate?, purpose?) |

---

## 6. BOOKINGS - `/api/bookings`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| POST | /flight | Private | Create flight booking |
| POST | /hotel | Private | Create hotel booking |
| POST | /package | Private | Create package booking |
| GET | / | Private | My bookings (type?, status?, page?, limit?) |
| GET | /:id | Private | Get booking by ID or reference |
| POST | /:id/cancel | Private | Cancel booking (reason?) |

---

## 7. ADMIN - `/api/admin` (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Analytics (users, bookings, revenue) |
| POST | /flights | Add flight |
| PUT | /flights/:id | Update flight |
| DELETE | /flights/:id | Deactivate flight |
| POST | /hotels | Add hotel |
| PUT | /hotels/:id | Update hotel |
| DELETE | /hotels/:id | Deactivate hotel |
| POST | /rooms | Add room |
| PUT | /rooms/:id | Update room |
| POST | /packages | Add package |
| PUT | /packages/:id | Update package |
| DELETE | /packages/:id | Deactivate package |
| POST | /visa | Add visa |
| PUT | /visa/:id | Update visa |
| PUT | /visa-applications/:id | Approve/reject (status, adminNotes) |
| GET | /bookings | All bookings |
| PUT | /bookings/:id/approve | Approve booking |
| PUT | /bookings/:id/reject | Reject (reason) |
| GET | /users | All users |

---

## 8. PAYMENTS - `/api/payments`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| POST | /create-order | Private | Create order (bookingId, amount?) |
| POST | /verify | Private | Verify Razorpay (paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature) |
| POST | /webhook/razorpay | Public | Razorpay webhook placeholder |
| POST | /webhook/stripe | Public | Stripe webhook placeholder |

---

## 9. REVIEWS - `/api/reviews`

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| GET | /hotel/:hotelId | Public | Get hotel reviews |
| GET | /package/:packageId | Public | Get package reviews |
| POST | /hotel/:hotelId | Private | Add review (rating, title?, content?, pros?, cons?) |
| POST | /package/:packageId | Private | Add review (rating, title?, content?, pros?, cons?) |

---

## Creating Admin User
Insert directly in MongoDB or register and update:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```
