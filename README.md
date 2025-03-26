# SPAR - AI Training Platform

A modern web application for AI-powered training and skill development. Built with Next.js, TypeScript, and OpenAI's GPT-4.

## Features

- 🔐 User Authentication
- 💬 Interactive AI Training Sessions
- 📊 Progress Tracking
- ⚙️ User Settings
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4

## Prerequisites

- Node.js 18+ 
- PostgreSQL
- OpenAI API Key (for AI features)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spar.git
cd spar
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure secret for JWT tokens
- `OPENAI_API_KEY`: Your OpenAI API key (optional)

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
spar/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── prisma/              # Database schema and migrations
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
