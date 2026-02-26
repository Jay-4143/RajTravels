/**
 * Global Validation Rules and Utility Functions
 */

export const VALIDATION_PATTERNS = {
    // Mobile: Exactly 10 digits
    mobile: /^[0-9]{10}$/,

    // Email: Standard RFC email format
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,

    // Name: Only alphabets, min 2 chars
    name: /^[a-zA-Z\s]{2,}$/,

    // Password: Min 6 characters
    password: /^.{6,}$/,

    // Government IDs
    aadhaar: /^[0-9]{12}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    passport: /^[A-Z0-9]{7,12}$/, // Basic alphanumeric, 7-12 chars
};

export const VALIDATION_MESSAGES = {
    mobile: "Please enter a valid 10-digit mobile number",
    email: "Please enter a valid email address",
    name: "Name should contain only alphabets and at least 2 characters",
    password: "Password must be at least 6 characters long",
    aadhaar: "Please enter a valid 12-digit Aadhaar number",
    pan: "Please enter a valid 10-character PAN (e.g. ABCDE1234F)",
    passport: "Please enter a valid Passport number",
    required: "This field is required",
    departureDate: "Departure date cannot be in the past",
    returnDate: "Return date cannot be before departure date",
};

/**
 * Validates a value based on a rule name
 */
export const validateField = (name, value, idType = null) => {
    if (!value) return VALIDATION_MESSAGES.required;

    switch (name) {
        case 'mobile':
        case 'phone':
            return VALIDATION_PATTERNS.mobile.test(value) ? null : VALIDATION_MESSAGES.mobile;

        case 'email':
            return VALIDATION_PATTERNS.email.test(value) ? null : VALIDATION_MESSAGES.email;

        case 'name':
        case 'firstName':
        case 'lastName':
            return VALIDATION_PATTERNS.name.test(value) ? null : VALIDATION_MESSAGES.name;

        case 'password':
            return VALIDATION_PATTERNS.password.test(value) ? null : VALIDATION_MESSAGES.password;

        case 'idNumber':
            if (idType === 'Aadhar') {
                return VALIDATION_PATTERNS.aadhaar.test(value) ? null : VALIDATION_MESSAGES.aadhaar;
            } else if (idType === 'PAN') {
                return VALIDATION_PATTERNS.pan.test(value) ? null : VALIDATION_MESSAGES.pan;
            } else if (idType === 'Passport') {
                return VALIDATION_PATTERNS.passport.test(value) ? null : VALIDATION_MESSAGES.passport;
            }
            return null;

        default:
            return null;
    }
};

/**
 * Validates dates
 */
export const validateDates = (departure, returnDate = null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depDate = new Date(departure);
    if (depDate < today) return VALIDATION_MESSAGES.departureDate;

    if (returnDate) {
        const retDate = new Date(returnDate);
        if (retDate < depDate) return VALIDATION_MESSAGES.returnDate;
    }

    return null;
};
