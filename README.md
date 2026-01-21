<div align="center">
  <h1>🚀 PlacementGPT</h1>
  <p><strong>An AI-powered career accelerator to help students crack their dream tech jobs.</strong></p>
</div>

PlacementGPT is an intelligent platform built with Next.js that leverages AI to parse resumes, match candidates with job descriptions, generate personalized learning roadmaps, and conduct automated mock interviews.

## ✨ Features

*   **📄 AI Resume Parsing:** Instantly extracts and evaluates skills, experience, and education from PDF/DOCX resumes against ATS (Applicant Tracking System) standards.
*   **🎯 Semantic Job Matcher:** Deep semantic analysis comparing your resume against any job description to generate an overall match score and pinpoint missing keywords.
*   **🗺️ Skill Gap Roadmaps:** Automatically generates customized, step-by-step learning roadmaps to help you acquire the missing skills for your target role.
*   **🎤 Mock Interviews:** Conducts interactive mock interviews with dynamically generated questions tailored to your target role and difficulty level, providing instant scoring and feedback.
*   **📊 Analytics Dashboard:** Tracks your job readiness score over time, giving you visual insights into your improvement.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **File Parsing:** `pdf-parse` & `mammoth`

## 🚀 Getting Started

### Prerequisites

*   Node.js 18.x or later
*   A Clerk account for authentication
*   A Neon PostgreSQL database (or any PostgreSQL instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/PlacementGPT.git
    cd PlacementGPT
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory for your database URL:
    ```env
    DATABASE_URL="postgresql://user:password@host/database"
    ```
    Create a `.env.local` file for your Clerk API keys:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    ```

4.  **Run database migrations:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📦 Deployment (Vercel)

This project is optimized for deployment on Vercel.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY` environment variables in the Vercel dashboard.
4.  The `postinstall: "prisma generate"` script in `package.json` will ensure Prisma Client is built correctly.
5.  Click Deploy!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
