# Design Guidelines

## Design System

### Brand Colors

#### Primary Colors
- Primary Blue: `#2563EB`
- Primary Purple: `#7C3AED`
- Primary Green: `#059669`

#### Secondary Colors
- Secondary Blue: `#1E40AF`
- Secondary Purple: `#5B21B6`
- Secondary Green: `#047857`

#### Neutral Colors
- Background: `#FFFFFF` (Light) / `#111827` (Dark)
- Text: `#111827` (Light) / `#F9FAFB` (Dark)
- Gray Scale: 
  - 50: `#F9FAFB`
  - 100: `#F3F4F6`
  - 200: `#E5E7EB`
  - 300: `#D1D5DB`
  - 400: `#9CA3AF`
  - 500: `#6B7280`
  - 600: `#4B5563`
  - 700: `#374151`
  - 800: `#1F2937`
  - 900: `#111827`

### Typography

#### Font Families
- Primary Font: Inter
- Secondary Font: Geist
- Monospace Font: JetBrains Mono

#### Font Sizes
- H1: 3rem (48px)
- H2: 2.25rem (36px)
- H3: 1.875rem (30px)
- H4: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Spacing

#### Layout Spacing
- Container Padding: 1rem (16px)
- Section Spacing: 4rem (64px)
- Component Spacing: 2rem (32px)
- Element Spacing: 1rem (16px)

#### Component Spacing
- Button Padding: 0.75rem 1.5rem
- Input Padding: 0.75rem 1rem
- Card Padding: 1.5rem
- Modal Padding: 2rem

### Components

#### Buttons
- Primary Button: Blue background with white text
- Secondary Button: White background with blue border
- Ghost Button: Transparent with blue text
- Danger Button: Red background with white text

#### Cards
- Border Radius: 0.5rem
- Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- Hover Shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)

#### Forms
- Input Height: 2.5rem
- Input Border: 1px solid #E5E7EB
- Focus Border: 2px solid #2563EB
- Error Border: 2px solid #DC2626

### Icons

#### Icon Style
- Line Weight: 2px
- Corner Radius: 2px
- Size: 24px (default)
- Color: Inherit from parent

#### Icon Sizes
- Small: 16px
- Medium: 24px
- Large: 32px
- Extra Large: 48px

### Animations

#### Transitions
- Duration: 200ms
- Timing: ease-in-out
- Properties: all

#### Hover Effects
- Scale: 1.02
- Opacity: 0.9
- Shadow: Increase by 25%

### Responsive Design

#### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

#### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)

### Accessibility

#### Color Contrast
- Minimum contrast ratio: 4.5:1
- Large text contrast ratio: 3:1
- Interactive elements: 3:1

#### Focus States
- Visible focus ring
- High contrast outline
- Keyboard navigation support

### Dark Mode

#### Color Adjustments
- Background: Dark gray (#111827)
- Text: Light gray (#F9FAFB)
- Accent colors: Adjusted for dark mode
- Shadows: Adjusted opacity and color

### Loading States

#### Skeleton Loading
- Background: #E5E7EB
- Animation: Pulse
- Duration: 2s
- Iteration: Infinite

#### Spinners
- Size: 24px
- Color: Primary blue
- Animation: Rotate
- Duration: 1s 