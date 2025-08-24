<h1 align="center">Backend: ANIPROJECT</h1>


1. Inside the folder, you should run `npm install` on your CMD to get all dependencies 

```javascript
npm install
```

2. Now you will need to create a `.env` file or fill the `.env.example` and replace its name on the `backend project root folder`, and follow the instructions bellow.

   - **External APIs** (go to these repos, host your own instance and save the URL to use on `.env`):
     - <a href='https://github.com/consumet/api.consumet.org' target="_blank" rel="noreferrer">Consumet API</a>
     - <a href='https://github.com/ghoshRitesh12/aniwatch-api' target="_blank" rel="noreferrer">Aniwatch API</a>
   - **Anilist Login** (OAuth):
     - You need to first login on your account on Anilist.
     - Then go to <a href='https://anilist.co/settings/developer'>Developer Page</a> on the Settings and click "Create New Client".
     - Now you need to add the name of your forked project/website and the URL to redirect when user accept the login, then hit "Save".
     - Store the Client ID and Secret on your ".env".
     - TIP: Create 2 of these, one for the dev enviroment and other to production.
  - **Setting Redis Up**:
    - If dont have a Redis Server yet, you can try for free on <a href='https://redis.io/' target="_blank" rel="noreferrer">Redis Website</a>.
    - Just create a account, create a database and copy the info to use on the enviroment file (ex: username, password, host, port)

   - OPTIONAL: This project uses a JSON file (~47 mb) filled with Animes and Mangas data as a offline Database. This repository already has this file, but it might be outdated, so you decide if you want to ignore this step.
     - Go to <a href='https://github.com/manami-project/anime-offline-database' target="_blank" rel="noreferrer">anime-offline-database</a> and download the JSON file that will be used only on `Search Page` (or you can make some changes and use some API to fetch the data).
     - With the file downloaded, put it in the `/controllers/search/animes-database` directory, replacing the previous one.

With all that done, you can follow the pre-made `.env.example` on the root folder or fill the `.env` like the example bellow:

```javascript
// Change it fo false when you run it in Production mode
DEV_MODE=true

// PORT WHERE THE SERVER WILL BE RUNNING
PORT=3456

// 5 minutes in seconds
REDIS_EXPIRATION=300
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
REDIS_PORT=your_redis_port
REDIS_HOST=your_redis_host

ANILIST_API_URL=https://graphql.anilist.co/

// Consumet API
CONSUMET_API_URL=https://example.com

// Aniwatch API
ANIWATCH_API_URL=https://example.com

// Anilist OAuth Settings
ANILIST_CLIENT_ID=your_client_id
ANILIST_CLIENT_SECRET=your_client_secret
```

3. With all this done, it should be good to go! 

Do the ``frontend README`` and run the ``backend`` with the code bellow!


```javascript
nodemon server.js
```