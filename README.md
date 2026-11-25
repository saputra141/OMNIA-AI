# OMNIA AI

Multi-provider AI workspace: Android client, Cloudflare Worker API, admin dashboard and GitHub Actions.

## Architecture
- `android/`: Kotlin + Jetpack Compose Android application.
- `backend/`: Cloudflare Worker API. Provider secrets belong in Worker secrets, never in the APK.
- `admin/`: lightweight admin console starter.
- `database/`: D1 schema.
- `.github/workflows/`: Android debug APK build.

## Important status
This is a runnable starter scaffold, not a production-ready multi-provider service. Provider adapters are explicit integration points. Video providers require individual API contracts, account access, and paid credits; no provider is represented as active until configured and tested.

## Setup
1. Create a Cloudflare Worker and D1 database.
2. Apply `database/schema.sql`.
3. Configure Worker secrets using `wrangler secret put ADMIN_TOKEN`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, etc. Add only keys for providers you actually use.
4. Set `ADMIN_TOKEN` as a strong random secret. Restrict admin endpoints and add real user authentication before public launch.
5. Set `VITE_API_BASE` for the admin app and deploy it behind authenticated access.
6. Add Android signing secrets to GitHub Actions before producing a release APK.

## Local backend
```bash
cd backend
npm install
npx wrangler dev
```

## Android
Open `android/` in Android Studio, sync Gradle, then run the app. The first screen is a functional API connectivity shell; chat/video calls require configured providers.
