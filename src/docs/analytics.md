# Dal Rotti Website Analytics Documentation

This document provides a comprehensive overview of all tracking events and click handlers implemented on the Dal Rotti website. All analytics respect GDPR compliance and only track events if users have consented to analytics cookies.

## Implementation Details

The analytics system is implemented in `src/utils/analytics.ts` and integrates with Google Analytics (GA4). All tracking functions check for user consent before recording any data.

## Event Categories

The following event categories are tracked:

| Category    | Description                                    |
|-------------|------------------------------------------------|
| `menu`      | Menu viewing and interaction events            |
| `reservation`| Table reservation clicks                      |
| `contact`   | Phone calls and email contact attempts         |
| `directions`| Map and directions requests                    |
| `order`     | Online ordering clicks                         |
| `social`    | Social media profile visits                    |

## Tracked Events By Component

### Header Component

| Element                 | Event    | Function                           | Data Captured                               |
|-------------------------|----------|------------------------------------|--------------------------------------------|
| Phone Number (Desktop)  | onClick  | `trackPhoneCall('header')`         | category: 'contact', action: 'call', label: 'header' |
| Phone Number (Mobile)   | onClick  | `trackPhoneCall('mobile_header')`  | category: 'contact', action: 'call', label: 'mobile_header' |
| Order Online (Desktop)  | onClick  | `trackOrderOnline('header')`       | category: 'order', action: 'click', label: 'header' |
| Order Online (Mobile)   | onClick  | `trackOrderOnline('mobile_header')`| category: 'order', action: 'click', label: 'mobile_header' |

### Footer Component

| Element                 | Event    | Function                                | Data Captured                               |
|-------------------------|----------|---------------------------------------|--------------------------------------------|
| Address/Directions      | onClick  | `trackGetDirections('footer')`        | category: 'directions', action: 'click', label: 'footer' |
| Phone Number            | onClick  | `trackPhoneCall('footer')`            | category: 'contact', action: 'call', label: 'footer' |
| Email Link              | onClick  | `trackPhoneCall('email_footer')`      | category: 'contact', action: 'call', label: 'email_footer' |
| Menu Link               | onClick  | `trackMenuView('footer_link')`        | category: 'menu', action: 'view', label: 'footer_link' |
| Reservation Link        | onClick  | `trackReservation('footer')`          | category: 'reservation', action: 'click', label: 'footer' |
| Facebook Icon           | onClick  | `trackSocialMedia('facebook', 'footer')` | category: 'social', action: 'click', label: 'facebook_footer' |
| Instagram Icon          | onClick  | `trackSocialMedia('instagram', 'footer')` | category: 'social', action: 'click', label: 'instagram_footer' |

### About Page

| Element                 | Event    | Function                                | Data Captured                               |
|-------------------------|----------|---------------------------------------|--------------------------------------------|
| Reserve a Table Button  | onClick  | No specific tracking                  | Default link behavior only                  |
| Order Online Button     | onClick  | No specific tracking                  | Default link behavior only                  |

### Menu Component

| Element                 | Event    | Function                        | Data Captured                               |
|-------------------------|----------|--------------------------------|--------------------------------------------|
| Category Navigation     | onClick  | No specific tracking           | Default scroll behavior only               |

### Cookie Consent Banner

| Element                 | Event    | Function                                | Data Captured                               |
|-------------------------|----------|-----------------------------------------|--------------------------------------------|
| Accept All Button       | onClick  | Sets all cookie preferences to true     | No tracking, enables future analytics       |
| Reject All Button       | onClick  | Sets only necessary cookies to true     | No tracking, disables future analytics      |
| Customize Button        | onClick  | Shows detailed cookie preferences       | No tracking                                |
| Save Preferences Button | onClick  | Saves selected cookie preferences       | No tracking                                |
| Cookie Settings (Footer)| onClick  | Resets cookie consent                   | No tracking                                |

## Privacy Considerations

- All tracking is disabled by default until user consents
- Users can opt out of tracking at any time by changing cookie preferences
- Only minimal, non-personal data is collected about user interactions
- The purpose of tracking is to improve user experience and understand website usage patterns

## Adding New Tracking Events

When adding new tracking to the website:

1. If needed, add new event category to the `EventCategory` type in `src/utils/analytics.ts`
2. Create a new tracking function if it's a distinct event type
3. Implement the onClick handler in the relevant component
4. Update this documentation

## Google Analytics Integration

The website uses Google Analytics 4 (GA4) for tracking. The implementation is in the `trackEvent` function in `analytics.ts`.

Event data is sent to GA4 with the following structure:
```javascript
window.gtag('event', data.action, {
  event_category: data.category,
  event_label: data.label,
  value: data.value
});
```

## Debugging Analytics

During development, all tracking events are logged to the console if the user has consented to analytics. You can test tracking functions by:

1. Accepting analytics cookies in the cookie banner
2. Opening browser developer tools console
3. Interacting with trackable elements
4. Verifying events appear in the console with the message "EVENT TRACKED:" 