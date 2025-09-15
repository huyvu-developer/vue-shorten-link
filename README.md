# Vue URL Shortener

A modern, responsive URL shortener application built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- 🔗 **URL Shortening**: Convert long URLs into short, shareable links
- 🌍 **Internationalization**: Support for multiple languages (English, Vietnamese)
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Fast & Modern**: Built with Vue 3 Composition API and TypeScript
- 🎨 **Beautiful UI**: Clean, modern interface with Tailwind CSS
- 📊 **URL Management**: View and manage your shortened URLs
- 📋 **Copy to Clipboard**: Easy copying of shortened URLs

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Internationalization**: Vue I18n
- **Icons**: Heroicons (via Tailwind)

## Project Setup

### Prerequisites

- Node.js 20.19.0 or higher
- Yarn (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd vue-shorten-link
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Start the development server:

```bash
yarn dev
# or
npm run dev
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Vue components
│   └── UrlShortener.vue # Main URL shortener component
├── i18n/               # Internationalization
│   ├── index.ts        # i18n configuration
│   └── locales/        # Translation files
├── router/             # Vue Router configuration
├── services/           # API services
│   └── api.ts          # Axios API client
├── stores/             # Pinia stores
│   └── urlShortener.ts # URL shortener state management
├── views/              # Page components
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## Development

### Adding New Languages

1. Create a new locale file in `src/i18n/locales/`
2. Add the locale to the `messages` object in `src/i18n/index.ts`
3. Update the language selector in `src/App.vue`

### Customizing the UI

The application uses Tailwind CSS for styling. You can customize the design by:

1. Modifying the Tailwind configuration in `tailwind.config.js`
2. Updating component styles in the Vue files
3. Adding custom CSS in `src/assets/main.css`

## Building for Production

```bash
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

MIT License - see LICENSE file for details.
