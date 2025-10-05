# open-pilot

## Setup:

Install git locally

Install Node locally

clone the git repo

    git clone https://github.com/harini-aj/open-pilot.git
    cd open-pilot
    
Create the Next.js 14+ App (inside the cloned folder)

    npx create-next-app@latest . --ts --app --tailwind --eslint

Run test app

    npm run build
    npm run start / npm start
    npm run dev # autoload on change

Setup Material UI

    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material

### Setup Python FastAPI (fine tuning code resides)

Create a Python Virtual Environment

        python -m venv venv
        source venv/bin/activate  # Use venv\Scripts\activate on Windows
        
Install FastAPI and Uvicorn
  
      pip install fastapi uvicorn
      
Add dependencies to server/requirements.txt

      fastapi
      uvicorn

## To start the environment

UI

    npm run dev

FastAPI

    cd backend
    venv\Scripts\activate
    uvicorn main:app --reload

    
 

## Getting Started

``` backend\venv\Scripts\activate



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
