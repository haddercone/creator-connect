# Creator Connect Q&A Platform

Creator Connect is a Q&A platform that enables users from around the world to ask questions to their favorite creators. It provides a seamless experience for both users and creators, allowing creators to see and respond to questions while users can easily access answered questions on their creator or user pages.

## Technologies Used

- Next.js
- React.js
- JavaScript
- TypeScript
- Zod for form validation
- Prisma ORM
- MongoDB Database
- Next-Auth for authentication
- Tailwind CSS
- Vercel KV and Upstash Ratelimit for rate limiting
- Server actions
- API routes
- App router

## Features

- Users can ask questions to their favorite creators.
- Creators can update, delete, and view the questions asked.
- Rate limiting implemented on the creator page to prevent spamming.
- Responsive UI for a user-friendly experience.
- Authentication using Twitter and GitHub.

## Important Notes

- **Rate Limiting:** The rate limiting feature on the creator page ensures a controlled flow of questions, preventing spam and misuse of the platform.

- **Authentication:** Users can log in using their Twitter or GitHub accounts, ensuring a secure and streamlined authentication process.

- **Responsive UI:** The platform boasts a responsive user interface, offering a consistent and enjoyable experience across different devices.

## Getting Started

To get started with Creator Connect, follow these steps:

1. Clone the repository: `git clone https://github.com/haddercone/creator-connect.git`
2. Install dependencies: `npm install`
3. Configure environment variables, such as API keys for authentication.
4. Run the application: `npm run dev`

Feel free to explore the codebase and contribute to the project!

