# Wingardium Leviosa - AI-Powered CSV Contact Importer

This is a Next.js application that allows users to upload CSV files of contacts, intelligently map the data to CRM fields using AI, and import them into a Firebase Firestore database.

## Features

- _Google Authentication:_ Secure login using Firebase Authentication.
- _CSV Upload:_ Simple file upload interface for CSV files.
- _AI-Powered Field Mapping:_ Utilizes Google Gemini to automatically suggest mappings between CSV columns and predefined CRM fields.
- _Interactive Mapping UI:_ Users can review and adjust the AI's suggestions before finalizing the import.
- _Data Validation:_ Performs checks for duplicates and errors to ensure data integrity.
- _Contact Visualization:_ Displays imported contacts in a clean, tabular format.

## Tech Stack

- _Framework:_ [Next.js](https://nextjs.org/) (React)
- _Language:_ [TypeScript](https://www.typescriptlang.org/)
- _Styling:_ [Tailwind CSS](https://tailwindcss.com/)
- _Backend & Database:_ [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- _AI:_ [Google Gemini](https://ai.google.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1.  Clone the repo:
    sh
    git clone https://github.com/your_username/wingardium-leviosa.git
2.  Install NPM packages:
    sh
    npm install
3.  Set up your environment variables. Create a .env.local file in the root of the project and add your Firebase project configuration and your Gemini API key.

    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    GEMINI_API_KEY=your_gemini_api_key

### Running the Application

Run the development server:

bash
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
