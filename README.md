# InsightStream 

A modern, customizable news aggregation platform built with React + Vite.

## Features

- 📰 News aggregation from multiple sources
- 🎨 **Customizable Theme System** - 8 predefined themes + custom theme creator
- 🔖 Bookmark and save articles
- 👤 User profiles with preferences
- 📱 Responsive design (mobile & desktop)
- 🌐 Multi-language support
- 🌍 Country-specific news

## Theme System

This application features a comprehensive theme customization system that allows users to:

- Choose from 8 beautiful predefined themes (including light and dark variants)
- Create custom themes with their own color palettes
- Themes persist across sessions

**Available Themes:**

- Gold Light (default)
- Gold Dark
- Ocean Blue
- Forest Green
- Sunset Orange
- Purple Dream
- Rose Pink
- Midnight Dark

For detailed documentation on the theme system, see [THEME_SYSTEM.md](./THEME_SYSTEM.md)

## Dark Themes

After recent fixes for dark theme visibility:

1. **Start Development Server:**

   ```bash
   npm run dev
   ```

2. **Test Gold Dark Theme:**

   - Navigate to Profile page (click avatar → Profile)
   - Click "Gold Dark" theme card
   - **Verify:**
     - ✅ Background is medium dark gray (#1a1a2e), NOT pure black
     - ✅ Text is light and easily readable (#f8f9fa)
     - ✅ Cards have visible borders
     - ✅ Gold gradient buttons are clearly visible
     - ✅ Navbar, NewsCards, and all components are visible

3. **Test Midnight Dark Theme:**

   - Click "Midnight Dark" theme card
   - **Verify:**
     - ✅ Background is dark charcoal (#0d1117)
     - ✅ Text is crisp white (#f0f6fc)
     - ✅ Blue primary colors on buttons
     - ✅ All UI elements have proper contrast

4. **Test All Pages:**

   - 🏠 Home page - news grid loads correctly
   - 💾 Saved page - bookmarks display properly
   - 👤 Profile page - theme selector works
   - 📖 Click any article - reader panel displays correctly
   - 🔐 Logout and check login/signup pages

5. **Switch Between Themes:**
   - Try switching from dark → light → dark
   - Verify colors update instantly
   - Refresh page - theme should persist

For detailed documentation on the theme system, see [THEME_SYSTEM.md](./THEME_SYSTEM.md)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- React Icons

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── store/           # Zustand stores
├── themes/          # Theme configuration
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── api/             # API integration
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
