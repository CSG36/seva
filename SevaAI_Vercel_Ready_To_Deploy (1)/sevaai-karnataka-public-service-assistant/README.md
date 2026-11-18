# SevaAI — Karnataka Public Service Assistant

A multilingual (English, Kannada and Hindi) public-service directory and guidance assistant. This project is configured for **Vercel only**: Vite builds the React frontend, and the TypeScript files in `api/` run as Vercel Serverless Functions.

## Important data and safety note

The included catalogue contains six curated Karnataka government portal records in `backend/knowledge/karnataka_services.json`. It is **not** a live government database and does not connect to departmental systems. The app links users to official portals and provides guidance supported by those catalogue records. It does not submit applications, check live application status, store contact messages, or guarantee that a government portal is available. Do not enter Aadhaar numbers, OTPs, passwords, bank details, or other sensitive personal information.

## Requirements

- Node.js 22.12+ (Node 24 is suitable)
- npm
- A Vercel account
- A GitHub account (recommended for deployment)

Python, AWS CLI, AWS SAM and AWS credentials are **not required** for this Vercel deployment.

## 1. Run locally on Windows

1. Extract the ZIP.
2. Open the `sevaai-karnataka-public-service-assistant` folder in VS Code (the folder containing `package.json`).
3. Open Terminal → New Terminal and run:

```powershell
node --version
npm --version
npm install
npm run dev
```

4. Wait for `SevaAI server listening on http://0.0.0.0:3000`.
5. Open `http://localhost:3000`. Keep the terminal running.

The local Express preview server provides `GET /health`, `GET /api/health`, `GET /api/services`, `POST /api/chat`, and `POST /api/contact`.

### Test the local API

Open a second terminal:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod "http://localhost:3000/api/services?language=kn"
```

Test chat:

```powershell
$body = @{ message = "Where can I find ration card services?"; language = "en"; history = @() } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method Post -ContentType "application/json" -Body $body
```

## 2. Check the production build before deployment

From the project root:

```powershell
npm run lint
npm run build
```

The frontend production files are generated in `dist/`. Vercel automatically detects the functions in `api/`; do not move these files into `src/`.

## 3. Deploy to Vercel (recommended: GitHub import)

1. Create a new GitHub repository, for example `sevaai-karnataka-assistant`.
2. Upload/push the **contents** of the extracted project folder to the repository root. `package.json`, `vercel.json`, `api/`, `src/`, `server/` and `backend/` must be at the repository root—not inside an extra nested folder.
3. Sign in at [Vercel](https://vercel.com/).
4. Select **Add New → Project** and import your GitHub repository.
5. Configure the project:
   - Framework Preset: **Vite** (or Other if Vite is not detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Do not add `VITE_API_BASE_URL` for the normal single-domain deployment. The frontend calls `/api/...` on the same Vercel domain.
7. Select **Deploy**.

The included `vercel.json` configures the build output and makes sure the service catalogue JSON is included with the serverless API functions. Vercel automatically exposes:

- `https://YOUR-PROJECT.vercel.app/api/health`
- `https://YOUR-PROJECT.vercel.app/api/services?language=en`
- `https://YOUR-PROJECT.vercel.app/api/chat` (POST)
- `https://YOUR-PROJECT.vercel.app/api/contact` (POST)
- `https://YOUR-PROJECT.vercel.app/health`

After deployment, open the `/api/health` URL. A successful response should show `status: ok` and `services_loaded: 6`. Then test the website and chat.

## 4. Deploy updates

After changing code, commit and push it to the connected GitHub branch. Vercel automatically builds and deploys the update.

## Project structure

```text
sevaai-karnataka-public-service-assistant/
├── api/                         Vercel Serverless Functions
│   ├── _shared.ts
│   ├── health.ts
│   ├── services.ts
│   ├── chat.ts
│   └── contact.ts
├── src/                         React + TypeScript frontend
├── server/assistantEngine.ts    Catalogue search and chat response logic
├── backend/knowledge/           Karnataka service catalogue JSON
├── server.ts                    Local Express preview server only
├── package.json
├── vercel.json
└── vite.config.ts
```

## Known limitations

- Six curated portal records are included; there is no live departmental API connection.
- Answers are catalogue-based guidance, not generative AI or live government status checks.
- The contact endpoint validates fields but does not store or send messages.
- Application submission, payments, OTP verification and live application tracking are not implemented.
- Verify all service details directly on the linked official government portal before acting on them.
