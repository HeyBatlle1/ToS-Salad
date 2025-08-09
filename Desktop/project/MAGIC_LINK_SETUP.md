# Simplified Magic Link Authentication Setup

This document outlines the complete setup for simplified magic link authentication in both the main app and legacy app.

## 1. Supabase Dashboard Configuration (One-time setup)

### Required Settings:
1. **Authentication → Providers → Email**: Turn ON
2. **Authentication → Settings → Disable email confirmations**: Turn ON
3. Leave everything else as default

## 2. Implementation Summary

### Legacy App (Next.js) - `legacy-app/src/pages/index.tsx`
✅ **Updated** - Now uses simplified magic link authentication:

```typescript
const signInWithMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin
    }
  });
  if (!error) {
    setMessage('Check your email for the login link');
  } else {
    setMessage('Error sending magic link: ' + error.message);
  }
};
```

**UI Changes:**
- Removed password field
- Single email input with "Send Login Link" button
- Shows success/error messages
- Handles magic link redirects automatically

### Main App (React/Vite) - Enhanced with Magic Link Support

#### Files Updated:

1. **`src/services/supabase.ts`** ✅ **Created**
   - Provides backward compatibility layer
   - Exports `signInWithMagicLink` function
   - Integrates with existing auth system

2. **`src/contexts/AuthContext.tsx`** ✅ **Updated**
   - Added `signInWithMagicLink` to context interface
   - Implemented magic link handler with toast notifications
   - Maintains existing password/OAuth functionality

3. **`lib/supabase/client.ts`** ✅ **Updated**
   - Added `signInWithMagicLink` helper function
   - Consistent error handling
   - Secure redirect configuration

4. **`src/components/auth/MagicLinkLogin.tsx`** ✅ **Created**
   - Standalone magic link login component
   - Clean, accessible UI with Tailwind CSS
   - Loading states and error handling

## 3. Usage Examples

### Using the AuthContext Hook:
```typescript
import { useAuth } from '../contexts/AuthContext';

const { signInWithMagicLink } = useAuth();

const handleLogin = async (email: string) => {
  try {
    await signInWithMagicLink(email);
    // Success toast will show automatically
  } catch (error) {
    // Error toast will show automatically
  }
};
```

### Using the Standalone Component:
```typescript
import MagicLinkLogin from '../components/auth/MagicLinkLogin';

<MagicLinkLogin onSuccess={() => console.log('Magic link sent!')} />
```

## 4. How It Works

1. **User enters email** → Click "Send Login Link"
2. **Magic link sent** → User receives email with secure link
3. **User clicks link** → Automatically redirected and authenticated
4. **Session established** → User is logged in without passwords

## 5. Key Benefits

- ✅ **No passwords** - Eliminates password-related security risks
- ✅ **Simple UX** - Just email → link → authenticated
- ✅ **Secure** - Uses Supabase's built-in OTP system
- ✅ **Mobile-friendly** - Works seamlessly across devices
- ✅ **Backward compatible** - Existing auth methods still work

## 6. Testing Instructions

### Legacy App:
1. Navigate to the legacy app
2. Enter your email address
3. Click "Send Login Link"
4. Check your email and click the link
5. You should be automatically signed in

### Main App:
1. Use the `MagicLinkLogin` component or call `signInWithMagicLink(email)`
2. Enter your email address
3. Click "Send Login Link"
4. Check your email and click the link
5. You should be automatically signed in

## 7. Environment Variables Required

Ensure these are set in your `.env` files:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 8. Security Notes

- Magic links expire automatically (Supabase default: 1 hour)
- Links are single-use only
- Secure redirect validation prevents phishing
- No sensitive data stored in URLs
- HTTPS required for production

## 9. Troubleshooting

**Magic link not received?**
- Check spam folder
- Verify email provider settings in Supabase
- Ensure email confirmations are disabled in Supabase settings

**Redirect not working?**
- Verify `emailRedirectTo` matches your domain
- Check browser console for errors
- Ensure HTTPS in production

**Authentication state not updating?**
- The `useEffect` with `supabase.auth.getSession()` handles magic link redirects
- Auth state changes are automatically detected and handled
