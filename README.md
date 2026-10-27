# C372 VSCODE

Coursework and practice projects for C372 PayTech, organized by teaching week. The repository includes lesson resources and student-built Node.js projects.

## Repository contents

- `WEEK 1/HELLOAPP` - introductory Express app.
- `WEEK 1/Revision` - JavaScript revision exercises.
- `WEEK 1/PetCareApp` - Pet Care Journal application.
- `WEEK 2/LESSON 3` and `WEEK 2/LESSON 4` - lesson resources.
- `WEEK 2/PetCareApp` - the Pet Care Journal project for Week 2.

## Run the Hello app

Install Node.js, open a terminal in `WEEK 1/HELLOAPP`, and run:

```powershell
npm install
node app.js
```

Open `http://localhost:1000`.

## Run a PetCareApp

Each PetCareApp folder is a separate copy of the project. The following steps work for either `WEEK 1/PetCareApp` or `WEEK 2/PetCareApp`.

1. Install Node.js 20.6 or newer and MySQL.
2. Create the `petcare` database and tables by importing that folder's `db.sql` into MySQL.
3. Open a terminal in the chosen PetCareApp folder and copy the example configuration:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Edit `.env` with the MySQL connection details and a unique, long `SESSION_SECRET`. Do not commit `.env`.
5. Install dependencies and start the app:

   ```powershell
   npm install
   npm start
   ```

6. Open `http://localhost:3000`.

The supplied database records and credentials are for local demonstration only. This is a learning project, not production-ready software; do not reuse its sample accounts or deploy it with real user data.

## Publishing notes

- Course materials are included based on the repository owner's stated permission to redistribute them. Keep them only while that permission applies; their original rights remain with their respective owners.
- Check that you have permission to publish every image and other third-party asset in the project.
- Student-specific files containing the ID `25028289`, local `.env` files, and installed `node_modules` are excluded from Git. Verify `git status` before publishing.
- No open-source license has been selected. Choose and add a license only after confirming you have the right to license the code and assets.
