# SmartQR - QR Code Generator
A modern, feature-rich QR code generator built with Next.js, featuring AI-powered design suggestions and custom branding.
Read the Docs: https://qrry.superdocs.cloud/

## Features

- 🎨 **Custom QR Code Design**: Full control over colors, patterns, corners, and eye styles
- 🤖 **AI-Powered Suggestions**: Get color palette suggestions based on website branding
- 🎯 **Smart Logo Fetch**: Automatically fetch website logos for QR code branding
- 📥 **Download Options**: Download QR codes in PNG or SVG format

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **QR Generation**: `qr-code-styling`
- **AI**: Google Gemini API
- **UI Components**: Radix UI Primitives

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Google Gemini API key (for AI suggestions)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SmartQR
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Set up environment variables:
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
```bash
bun dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── actions.ts          # Server Actions
│   ├── create/             # QR Creation Flow
│   │   ├── content/        # Step 1: URL Input
│   │   ├── branding/       # Step 2: Logo Upload
│   │   └── design/         # Step 3: Customization
├── components/             # React Components
│   ├── steps/              # Step-specific components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities
│   └── defaults.ts         # Default configurations
├── store/                  # Redux store
└── types.ts               # TypeScript types
```

## Documentation

- [Architecture](./Architecture.md) - Technical architecture and design decisions

## Environment Variables

Required variables:
- `GEMINI_API_KEY` - Google Gemini API key for AI suggestions
- `NEXT_PUBLIC_APP_URL` - Application URL (optional, defaults to http://localhost:3000)

## License

MIT
