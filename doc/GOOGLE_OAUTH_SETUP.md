# Google OAuth Login Integration

## Overview
This document explains the Google OAuth login implementation for Dal Rotti frontend.

## How It Works

### 1. User Flow
1. User clicks "Sign in with Google" or "Sign up with Google" button on `/user/signin` page
2. Frontend builds callback URL: `http://localhost:3000/user/auth/google/callback` (or production URL)
3. User is redirected to backend: `https://dalrotti-backend.onrender.com/api/auth/google?redirectTo=http://localhost:3000/user/auth/google/callback`
4. Backend validates redirectTo parameter and redirects to Google OAuth consent screen
5. User authenticates with Google
6. Google redirects back to backend with authorization code
7. Backend processes the code and exchanges it for user data and tokens
8. Backend redirects to the callback URL: `/user/auth/google/callback?accessToken=...&name=...&email=...`
9. Frontend callback page saves the tokens and user data
10. User is redirected to menu or their intended page

### 2. Files Modified

#### Frontend Files:
- **`src/app/user/signin/page.tsx`** - Added Google Sign-In buttons
- **`src/app/user/auth/google/callback/page.tsx`** - Handles OAuth callback
- **`src/services/authService.ts`** - Added `getGoogleLoginUrl()` function

#### Backend Configuration Required:
Your backend needs to have these settings configured:

```javascript
// Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://dalrotti-backend.onrender.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com (or http://localhost:3000 for dev)
```

### 3. Backend Redirect URL
After successful authentication, your backend should redirect to:
```
{FRONTEND_URL}/user/auth/google/callback?accessToken={token}&refreshToken={token}&name={name}&email={email}&id={userId}
```

### 4. URL Parameters Expected
The callback page expects these query parameters:
- `accessToken` or `access_token` (required) - JWT token for authentication
- `refreshToken` or `refresh_token` (optional) - Token for refreshing access
- `name` (optional) - User's full name
- `email` (optional) - User's email address
- `id` or `userId` (optional) - User's ID
- `error` (optional) - Error code if authentication failed
- `message` (optional) - Error message if authentication failed

### 5. Session Storage
The implementation uses `sessionStorage` to preserve the return URL:
- Key: `google_auth_return_url`
- Set before redirecting to Google OAuth
- Used after successful authentication to redirect user back

### 6. Local Storage
After successful authentication, these items are saved:
- `token` - Access token (also saved to cookies)
- `refreshToken` - Refresh token (if provided)
- `user` - User object with id, name, email, role

### 7. Environment Variables

#### Frontend (.env.local):
```bash
NEXT_PUBLIC_BACKEND_API_URL=https://dalrotti-backend.onrender.com
# or for development:
# NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
```

## Testing

### Local Development:
1. Ensure backend is running with Google OAuth configured
2. Start frontend: `npm run dev`
3. Navigate to: `http://localhost:3000/user/signin`
4. Click "Sign in with Google"
5. Complete Google authentication
6. Verify redirect to callback page and then to menu

### Production:
1. Ensure `NEXT_PUBLIC_BACKEND_API_URL` points to production backend
2. Ensure backend's `FRONTEND_URL` points to production frontend
3. Google Cloud Console callback URLs must include:
   - Production: `https://dalrotti-backend.onrender.com/api/auth/google/callback`
   - Development: `http://localhost:4000/api/auth/google/callback`

## Troubleshooting

### Issue: "No authentication token received"
- Backend is not sending `accessToken` parameter in redirect URL
- Check backend logs to ensure token is being generated

### Issue: "Google authentication failed"
- Check Google Cloud Console credentials
- Verify callback URLs match in Google Console and backend config
- Check backend logs for specific error

### Issue: User not redirected after login
- Check browser console for JavaScript errors
- Verify `returnUrl` parameter is being preserved
- Check if tokens are being saved to localStorage

### Issue: Infinite redirect loop
- Clear browser cookies and localStorage
- Check for conflicting authentication middleware
- Verify callback URL doesn't trigger additional redirects

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Token Expiry**: Access tokens expire in 7 days (configured in Cookies.set)
3. **CSRF Protection**: Backend should implement CSRF protection for OAuth flow
4. **State Parameter**: Backend should use state parameter to prevent CSRF attacks
5. **Token Storage**: Consider using httpOnly cookies instead of localStorage for production

## Additional Features to Consider

- [ ] Add "Remember Me" option
- [ ] Implement token refresh flow
- [ ] Add loading spinner during Google redirect
- [ ] Add error retry mechanism
- [ ] Implement logout from Google session
- [ ] Add account linking (link Google to existing account)
- [ ] Show user avatar from Google profile
- [ ] Implement email verification after Google signup

## Backend API Endpoints

### GET /api/auth/google
Initiates Google OAuth flow and redirects to Google consent screen.

**Query Parameters**:
- `redirectTo` (required) - The frontend callback URL where backend should redirect after authentication
  - Example: `http://localhost:3000/user/auth/google/callback`
  - Example: `https://your-domain.com/user/auth/google/callback`

**Response**: 302 Redirect to Google OAuth URL

**Full URL Example**:
```
https://dalrotti-backend.onrender.com/api/auth/google?redirectTo=http://localhost:3000/user/auth/google/callback
```

### GET /api/auth/google/callback
Handles Google OAuth callback, exchanges code for tokens.

**Query Parameters**:
- `code` - Authorization code from Google

**Response**: 302 Redirect to frontend callback with tokens
```
/user/auth/google/callback?accessToken={token}&name={name}&email={email}...
```

## Support
For issues or questions, contact the development team.
