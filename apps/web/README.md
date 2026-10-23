# Project

Use this repository to run and edit the app locally. Push your changes back to your remote repository to update your deployment or collaborate with others.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. (If your backend requires Deno, install [Deno](https://docs.deno.com/runtime/getting_started/installation/).)

## Run Locally

From the project root, you can start the development server:

```bash
npm run dev
```

Open your browser and go to the URL printed in the terminal (typically `http://localhost:5173`).

Notes:

- Only run `npm run dev` once per clone. Make sure all backend services (if any) are also running as required by your project.
- The frontend may rely on a backend API. See your project documentation for details on connecting to a local or remote backend.
- By default, any changes will auto-reload your development environment.

## Working with Production/Hosted Backend

If you need to point the frontend at a remote/production backend, update your environment variables or configuration as needed.

⚠️ Be aware that writing data in this mode may affect your production data.

## Publish Your Changes

After pushing your changes to git, follow your usual deployment workflow or CI/CD setup to publish the latest version of your app.

Refer to your platform’s documentation for details.

## Docs & Support

- API setup documentation: `docs/api-setup.md`

- GitHub integration — see your platform's documentation for git workflows.
- For local development and troubleshooting, refer to any included project documentation or reach out to your team for support.
