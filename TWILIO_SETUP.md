# Twilio OTP Setup Instructions

## Environment Variables Required

Add the following environment variables to your server's `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

## How to Get Twilio Credentials

1. **Sign up for Twilio**: Go to [https://www.twilio.com](https://www.twilio.com) and create an account
2. **Get Account SID and Auth Token**: 
   - Go to your Twilio Console Dashboard
   - Copy your Account SID and Auth Token from the main dashboard
3. **Get a Phone Number**:
   - Go to Phone Numbers > Manage > Buy a number
   - Purchase a phone number that supports SMS
   - Copy the phone number (include country code, e.g., +1234567890)

## Features Implemented

### Backend Changes
- ✅ Updated User model with phone verification fields
- ✅ Added OTP generation and verification methods
- ✅ Created sendOTP and verifyOTP API endpoints
- ✅ Updated registration and login to support phone-based auth
- ✅ Made email optional in registration

### Frontend Changes
- ✅ Created reusable OTP verification component
- ✅ Updated signup page with phone verification flow
- ✅ Updated login page with phone/email toggle
- ✅ Made email optional in signup form
- ✅ Added proper error handling and loading states

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp
Body: { "phone": "9876543210" }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { "phone": "9876543210", "otp": "123456" }
```

### Register (Updated)
```
POST /api/auth/register
Body: { 
  "name": "John Doe", 
  "email": "john@example.com", // Optional
  "password": "password123", 
  "phone": "9876543210" 
}
```

### Login (Updated)
```
POST /api/auth/login
Body: { 
  "email": "john@example.com", // OR
  "phone": "9876543210",
  "password": "password123" 
}
```

## User Flow

### Signup Flow
1. User enters name, phone, password, and optional email
2. User clicks "Send OTP & Continue"
3. OTP is sent to their phone via Twilio
4. User enters 6-digit OTP
5. After verification, account is created and user is logged in

### Login Flow
1. User can choose between Email or Phone login
2. For phone login: User enters phone and password, then verifies OTP
3. For email login: Traditional email/password login
4. User is logged in after successful verification

## Testing

To test the OTP functionality:
1. Set up your Twilio credentials in the environment variables
2. Start the server: `npm run dev`
3. Try the signup flow with a real phone number
4. Check your phone for the OTP message
5. Enter the OTP to complete verification

## Notes

- OTP expires in 10 minutes
- Phone numbers are stored without formatting (digits only)
- Email is optional but must be unique if provided
- Phone numbers must be unique
- All phone numbers are assumed to be Indian (+91) unless specified with country code
