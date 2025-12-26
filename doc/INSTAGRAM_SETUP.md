# Instagram API Setup Guide for Dal Rotti Website

This guide will help you set up the Instagram API integration for your website to display your recent Instagram posts.

## Step 1: Create a Facebook Developer Account

If you don't have one already, create a Facebook Developer account:

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click "Get Started" and follow the sign-up process

## Step 2: Create a Facebook App

1. Go to [My Apps](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Choose "Consumer" as the app type
4. Enter your app details (name, contact email)
5. Complete the creation process

## Step 3: Set Up Instagram Basic Display API

1. In your Facebook App dashboard, click "Add Products"
2. Find "Instagram Basic Display" and click "Set Up"
3. Configure your app settings:
   - Add your website's URL as a valid OAuth Redirect URI
   - Add the same URL for Deauthorize Callback URL
   - Add your privacy policy URL
   - Add the requested permissions: `user_profile` and `user_media`

## Step 4: Create an Instagram Test User

1. Go to the "Roles" section in your Facebook App dashboard
2. Click on "Instagram Testers"
3. Add your Instagram account as a tester
4. Accept the invitation via your Instagram account

## Step 5: Generate an Access Token

1. Go to the "Instagram Basic Display" section
2. Click "Generate Token" for the Instagram Tester
3. Follow the authorization flow
4. Copy the generated token

## Step 6: Add the Token to Your Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```
INSTAGRAM_ACCESS_TOKEN=your_token_here
```

Replace `your_token_here` with the token you copied in the previous step.

## Step 7: Deploy With Environment Variables

When deploying to Vercel or other platforms, ensure you add the `INSTAGRAM_ACCESS_TOKEN` to the environment variables in your deployment settings.

## Notes

- The default access token expires after 60 days. For a long-lived token (valid for 60 days):
  - Use the token exchange endpoint as described in the Instagram API documentation
  - Consider implementing a token refresh mechanism for production
  - Monitor token expiration and send alerts when renewal is needed

- For actual production use, you may need to submit your app for review to make it public and access real user data.

## Troubleshooting

If your Instagram feed isn't displaying:

1. Check the browser console for errors
2. Verify your access token is correctly set in environment variables
3. Confirm your Instagram account has public posts
4. If using the fallback images, ensure the `/public/instagram/` directory contains the required images

## Additional Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Access Token Management](https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing)
- [Instagram Graph API Explorer](https://developers.facebook.com/tools/explorer/) 