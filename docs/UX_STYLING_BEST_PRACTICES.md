# Truck Scout Styling Best Practices Guide

## Overview
This guide outlines the styling approach and best practices for maintaining consistency across the Truck Scout application.

## Styling Technologies
- **CSS Framework**: Tailwind CSS
- **Component Library**: Shadcn/UI
- **Rendering**: React Server Components (RSC)
- **Language**: TypeScript

## Color System
### Primary Color Palette
- **Primary Blue**: `[#335e88]`
  - Default state: `bg-[#335e88]`
  - Hover state: `hover:bg-[#264a6d]`

### Semantic Color Usage
- **Success**: Green variants
  - Background: `bg-green-100`
  - Text: `text-green-800`
- **Warning**: Yellow variants
  - Background: `bg-yellow-100`
  - Text: `text-yellow-800`
- **Destructive**: Red variants
  - Background: `bg-red-400`
  - Text: `text-red-900`

## Typography
### Headings
- Use `text-3xl` for main page titles
- Use `font-bold`
- Prefer `text-[#335e88]` for consistent color

### Body Text
- Use Tailwind's text sizing utilities
- Maintain consistent color palette
- Use `text-sm` for secondary information

## Component Styling Patterns
### Buttons
- Primary buttons: `bg-[#335e88] hover:bg-[#264a6b]`
- Outline buttons: `border-[#335e88] text-[#335e88]`
- Use hover states for interactivity

### Cards
- Consistent header styling
- Use `CardHeader`, `CardContent`, `CardTitle`
- Align icons and titles horizontally

### Tables
- Use Shadcn `Table` components
- Consistent column header colors
- Use badges or spans for status indicators

### Forms
- Leverage Shadcn form components
- Consistent error state styling
- Use `aria-` attributes for accessibility

## Layout and Spacing
- Use `space-y-6` for vertical spacing between sections
- Utilize `grid` and `flex` for responsive layouts
- Prefer `md:` and `lg:` breakpoint variants for responsiveness

## Interaction States
- Use `data-[state=active]` for active states
- Implement subtle hover and focus effects
- Consistent focus ring colors

## Best Practices
1. Always use Tailwind utility classes
2. Prefer Shadcn/UI components
3. Use `cn()` utility for class merging
4. Maintain consistent color palette
5. Support dark mode
6. Ensure accessibility

## Example Component Pattern
```tsx
export function MyComponent({ 
  className, 
  variant = "default", 
  ...props 
}: MyComponentProps) {
  return (
    <div
      className={cn(
        "base-styles",
        variant === "outlined" && "border-2",
        className
      )}
      {...props}
    />
  )
}
```

## Performance and Accessibility
- Use server components
- Minimize client-side JavaScript
- Implement proper ARIA attributes
- Support keyboard navigation
- Ensure sufficient color contrast

## Recommended Tools
- VS Code Tailwind CSS IntelliSense
- Prettier
- ESLint
- React Developer Tools

## Resources
- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
