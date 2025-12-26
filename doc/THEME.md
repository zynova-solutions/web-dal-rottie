# Dal Rotti Theme System Documentation

This document outlines the theme system used in the Dal Rotti website, including color schemes, component styling, and best practices for maintaining visual consistency across light and dark modes.

## Theme Architecture

The theme system is built on Tailwind CSS with custom CSS variables to ensure consistent colors and styling across the application. The theme supports both light and dark modes with carefully selected colors to ensure accessibility and readability.

### Color Palette

The color palette is defined using CSS variables in the `globals.css` file:

#### Light Theme Colors
- **Primary Colors**: Tandoor Orange (`#D84A05`) with dark (`#A63A00`) and light (`#F4780A`) variants
- **Background Colors**: White (`#FFFFFF`) with secondary (`#F9F2E9`) and tertiary (`#F0E6D9`) variants
- **Text Colors**: Near Black (`#1A202C`) with secondary (`#2D3748`) and tertiary (`#4A5568`) variants
- **Border Colors**: Warm Border (`#E2D6C9`) with hover state (`#C8B9A9`)
- **Feedback Colors**: Success (`#2F855A`), Error (`#C53030`), Warning (`#C05621`)

#### Dark Theme Colors
- **Primary Colors**: Brighter Flame (`#FF8A3D`) with dark (`#F05E05`) and light (`#FFAA70`) variants
- **Background Colors**: Deep Black (`#121212`) with secondary (`#1E1E1E`) and tertiary (`#2C2C2C`) variants
- **Text Colors**: White (`#FFFFFF`) with secondary (`#F0F0F0`) and tertiary (`#CCCCCC`) variants
- **Inverse Text Colors**: Dark text (`#1A202C`) for light backgrounds in dark mode
- **Border Colors**: Dark Border (`#3D3D3D`) with hover state (`#5A5A5A`)
- **Feedback Colors**: Success (`#68D391`), Error (`#FC8181`), Warning (`#F6AD55`)

## Section Types

The website uses two main section types to create visual hierarchy:

### Primary Section (`.primary-section`)
- **Light Mode**: White background with dark text
- **Dark Mode**: Dark background with light text
- **Usage**: Default section style, used for main content areas

### Contrast Section (`.contrast-section`)
- **Light Mode**: Light beige background with dark text
- **Dark Mode**: Light beige background with dark text (inverted from the primary dark theme)
- **Usage**: Creates visual contrast with the primary section, used for highlighting content

## Component Styling

### Buttons
- **Primary Button** (`.btn.btn-primary`): Orange background with white text
- **Secondary Button** (`.btn.btn-secondary`): Light background with dark text, adapts to both themes

### Cards
- `.card`: Styled container with background, shadow, and border
- Automatically adapts to light and dark themes

### Form Elements
- Form inputs, textareas, and selects have consistent styling
- Focus states use primary color for highlighting
- Labels use `.form-label` class for consistent styling

### Hero Section
- `.hero`: Full-width section with background image
- `.hero-overlay`: Semi-transparent overlay for better text readability
- `.hero-content`: Container for hero content with proper z-index

## Text Utilities

- `.text-primary`: Primary brand color text
- `.text-on-primary`: Text color optimized for primary sections
- `.text-on-contrast`: Text color optimized for contrast sections
- `.text-muted`: Subdued text color for less important content

## Best Practices

1. **Always use theme-aware classes** instead of hardcoded colors
2. **Test both light and dark modes** to ensure proper contrast and readability
3. **Use semantic section classes** (`primary-section` and `contrast-section`) to maintain visual hierarchy
4. **Ensure sufficient contrast** between text and background (minimum 4.5:1 ratio)
5. **Use utility classes** for consistent text styling across the application

## Recent Changes

The theme system was recently updated to improve clarity and consistency:

1. **Renamed section classes**:
   - `section-light` → `contrast-section`
   - `section-dark` → `primary-section`

2. **Renamed text utility classes**:
   - `text-on-light` → `text-on-contrast`
   - `text-on-dark` → `text-on-primary`

3. **Improved contrast** in dark mode for better readability
4. **Standardized button styling** across different section types
5. **Enhanced documentation** for better maintainability

## Implementation Examples

### Primary Section Example
```jsx
<section className="section primary-section">
  <div className="container mx-auto px-4">
    <h2 className="section-title">Section Title</h2>
    <p>Section content goes here...</p>
  </div>
</section>
```

### Contrast Section Example
```jsx
<section className="section contrast-section">
  <div className="container mx-auto px-4">
    <h2 className="section-title">Section Title</h2>
    <p>Section content goes here...</p>
  </div>
</section>
```

### Button Examples
```jsx
<button className="btn btn-primary">Primary Action</button>
<button className="btn btn-secondary">Secondary Action</button>
```

## Accessibility Considerations

The theme system has been designed with accessibility in mind:

1. **Color contrast** meets WCAG 2.1 AA standards (minimum 4.5:1 ratio)
2. **Focus states** are clearly visible for keyboard navigation
3. **Text sizes** are defined in relative units for better scalability
4. **Transitions** are used sparingly to avoid issues with vestibular disorders

## Troubleshooting

If you encounter visual issues:

1. Check that you're using the correct semantic classes
2. Verify that text colors are appropriate for the background
3. Test in both light and dark modes
4. Use browser developer tools to inspect the applied styles 