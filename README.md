<h1 align="center">AniProject</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the AniList, Consumet and Aniwatch API, which has info of animes and mangas released, data of the cast of that media, and many other things.

<p align="center">You can access this website on:

<a href='https://aniproject-dev.vercel.app/'>AniProject on Vercel</a> </br>
or </br>
<a href='https://aniproject-website.onrender.com'>AniProject on Render</a></br>
If the Vercel one is blocked by payment, try this one (it takes up to 2 minutes to deploy and load due to cold boot).

</p>

> [!CAUTION]
> Please note that this project is strictly non-commercial. It is not permitted to generate revenue or include advertisements using this project. Violating this policy may result in legal actions by the respective owners of these intellectual properties.

## Navigation

- [Features](#sparkles-features)
- [Quick Deploy](#rocket-quick-deploy)
- [Under Development](#pushpin-under-development-unordered)
- [Tecnologies Used](#heavy_check_mark-tecnologies-used)
- [How Can i Run It](#computer-how-can-i-run-it)
- [How Firebase Database is Organized](#books-how-firebase-database-is-organized)
  - [Authentication](#authentication)
  - [Collections and Documents](#collections-and-documents)
    - [Users](#users)
    - [Comments](#[DEPRECATED]comments)
    - [Notifications](#notifications)
- [Previews/Screenshots](#camera-previewscreenshots)

## :sparkles: Features

- [x] `Search`: Get a list of all animes and mangas you want using filters.
- [x] `Watch`: Watch any available episode Dubbed or Subbed.
- [x] `Read`: Read any manga chapter available.
- [x] `Log In`: You can log in with Google, Anilist or Anonymously (with some restrictions).
- [x] `Anilist Integration`: Use your Anilist account, carry over your settings, animes and mangas.
- [x] `Keep Watching`: Continue the episode from where you stop last time.
- [x] `Be Notified`: When a New Episode is Released, you get a notification on the website.
- [x] `Mark your favourite animes e mangas`: Save them as Completed, Dropped, Planning, and more.
- [x] `Mark the episodes you watched`: And keep watching from there later
- [x] `News Feed`: Keep up with the latest news of animes, mangas and the industry.
- <s> [DEPRECATED] `Comment`: Write what you thought of that episode or just tell something that every should know about.</s>

## :rocket: Quick Deploy

> [!IMPORTANT]  
> You NEED to make some configurations to use the project properly. Give a look on the [How Can i Run It Section](#computer-how-can-i-run-it) then use the info you got there on Vercel or any other platform `Enviroment Variables Section`.

On Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FErickLimaS%2Fanime-website&env=NEXT_PUBLIC_ANIWATCH_API_URL,NEXT_PUBLIC_CONSUMET_API_URL&envDescription=First%2C%20click%20on%20%22Learn%20More%22%20to%20ensure%20all%20variables%20is%20correct%20and%20setted.%20To%20watch%2C%20you'll%20need%20to%20deploy%20the%20Consumet%20and%20Aniwatch%20API.%20To%20the%20login%20system%2C%20you'll%20need%20to%20setup%20a%20Firebase%20Project%2C%20and%20or%20set%20the%20Dev%20Mode%20on%20Anilist%20to%20use%20their%20login.%20&envLink=https%3A%2F%2Fgithub.com%2FErickLimaS%2Fanime-website%3Ftab%3Dreadme-ov-file%23computer-how-can-i-run-it)

## :pushpin: Under Development (unordered)

- [ ] `Bug Fixes`
- [ ] `Hide Next Episode Images Until You Watch It (avoid spoilers)`
- [ ] `AniList Threads`
- [ ] `New Media Sources`
- [ ] `New Video Player Features`
- [ ] `Profile Page`
- [ ] `Edit Media Progress Info`
- [ ] `Select Layout Theme`
- [ ] `Schedule Page/Section`

## :heavy_check_mark: Tecnologies Used

Front-end:

- `Next.js`
- `TypeScript`
- `Axios`
- `Redux`
- `Firebase`
- `GraphQL`
- `Framer Motion`
- `Swiper`
- `Anilist API`
- `Consumet API`
- `Aniwatch API`

Back-End:

- `Firebase: Firestore Database`
- `Next.js (API) Route Handler`

## :computer: How Can I Run It?

1. `Fork` (recommended) or `Clone` this repository

```javascript
  git clone https://github.com/ErickLimaS/anime-website.git
```

2. Run `npm install` on your CMD to get all dependencies

```javascript
npm install
```

3. Now you will need to create a `.env.local` file or fill the `.env.example` on the `project root folder`, and follow the instructions bellow.

   - **External APIs** (go to these repos, host your own instance and save the URL to use on `.env.local`):
     - <a href='https://github.com/consumet/api.consumet.org' target="_blank" rel="noreferrer">Consumet API</a>
     - <a href='https://github.com/ghoshRitesh12/aniwatch-api' target="_blank" rel="noreferrer">Aniwatch API</a>
   - **Anilist Login** (OAuth):
     - You need to first login on your account on Anilist.
     - Then go to <a href='https://anilist.co/settings/developer'>Developer Page</a> on the Settings and click "Create New Client".
     - Now you need to add the name of your forked project/website and the URL to redirect when user accept the login, then hit "Save".
     - Store the Client ID and Secret on your ".env.local".
     - TIP: Create 2 of these, one for the dev env and other to production.
   - **Firebase** (to use Google, Email and Anonymous Login and the Firestore Database):

     - Create a project for this fork/clone you did on <a href='https://console.firebase.google.com/' target="_blank" rel="noreferrer">Firebase</a>.
     - All the Firebase info needed on `.env.local` **can be found when you create a new project**.
     - **IMPORTANT**: Make Sure to ALLOW your Hosted Website Domain on Firebase Authentication!
     - **IMPORTANT**: You'll need to **change the Rules** on **Firestore Database**. There is 2 options depending of what login methods you will use:

       - With **ALL** Login Methods available:

         ```javascript
            rules_version = '2';

            service cloud.firestore {
              match /databases/{database}/documents {

                match /{document=**} {
                  // will allow any write and read operation. No conditions due to Anilist OAuth Login.
                  allow read, write: if true;
                }

              }
            }
         ```

       - With **ONLY** Firebase Login Methods (no Anilist Login):

         ```javascript
           rules_version = '2';

           service cloud.firestore {
             match /databases/{database}/documents {

               match /users/{document=**} {
                 // allows only requests if a userUID is available.
                 allow read, write: request.auth.uid != null;
               }

               match /comments/{document=**} {
                 // allows only write request if a userUID is available.
                 allow read: if true;
                 allow write: request.auth.uid != null;
               }

               match /notifications/{document=**} {
                 // allows only write request if a userUID is available.
                 allow read: if true;
                 allow write: request.auth.uid != null;
               }

             }
           }
         ```

   - OPTIONAL: This project uses a JSON file (47 mb) filled with Animes and Mangas data as a offline Database. This repository already has this file, but it might be outdated, so you decide if you want to ignore this step.
     - Go to <a href='https://github.com/manami-project/anime-offline-database' target="_blank" rel="noreferrer">anime-offline-database</a> and download the JSON file that will be used on only `Search Page` (or you can make some changes and use some API to fetch the data).
     - With the file downloaded, put it in the `/app/api/animes-database` directory, replacing the previous one.

With all that done, you can follow the pre-made `.env.example` on the root folder or fill the `.env.local` like the example bellow:

```javascript
// Consumet API
NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api-url.com

// Aniwatch API
NEXT_PUBLIC_ANIWATCH_API_URL=https://your-hosted-aniwatch-api-url.com

// Anilist OAuth Settings
NEXT_PUBLIC_ANILIST_CLIENT_ID=your-anilist-client-id
ANILIST_CLIENT_SECRET=your-anilist-secret

// Next.js Route Handler - Make sure to add the pathname "/api/animes-database" bellow
NEXT_PUBLIC_NEXT_ROUTE_HANDLER_API=https://url-to-where-your-website-is-hosted.com/api/animes-database

// Bellow is the url to use ONLY on Dev Enviroment. You WILL NEED TO CHANGE IT when on hosted mode to the respective url. Look for something like Enviroment Variables to do it.
NEXT_PUBLIC_WEBSITE_ORIGIN_URL=http://localhost:3000

// Firebase Settings
NEXT_PUBLIC_FIREBASE_API_KEY=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_APP_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_DATABASE_URL=firebase-setting-related-to-this-field

// GOOGLE ANALYTICS: optional
NEXT_PUBLIC_MEASUREMENT_ID=your-measurement-id
```

4. Now run `npm run dev` to initialize the website

```javascript
npm run dev
```

5. That's it! It should be running.

## :books: How Firebase Database is Organized

### Authentication

With Firebase Authentication, theres 4 methods of Login/Signup:

- Email
- Google
- Anilist
- Anonymous
- <s>GitHub</s>

It is used to store on User Document things like:

- User Profile Photo
- Username
- Preferences (media source, adult content, subtitles and more)
- [DEPRECATED]Comments
- Notifications
- Bookmarked Medias
- Currently Watching Medias
- Episodes Watched
- Chapters Read

### Collections and Documents

With Firebase Database, we have 3 Collections:

#### Users

Stores only Users Documents after a successfull signup.

#### [DEPRECATED]Comments

Stores comments made on episodes or on its main page.

Its separated based on Anilist API Media IDs Documents, and after that, a Collection that holds all comments to this media and other related to a episode where that comment was made.

It strongly depends on Users Collection, due to each comment needs its user (owner). Each comment has a referer to its owner and stores its interactions, with Likes and Dislikes.

When a Comment is made, it saves sort of a log on User Document, with infos like interactions with other comment or written on a episode.

#### Notifications

The Notifications Collections stores a document for each Media ID related to Anilist API every time a user assigned himself to be notified about a new episode release.

Each document has a Collection that holds every user assigned to receive a notification.

In this document, has info of all episodes already notified to any user and the next to be notified, cover art, if is complete, status and last update date.

- User Document Relation: After a successfull notification is deliveried to user, it stores the last episode info on User Document, so it can be notified again and the next one is released.

## :camera: Preview/Screenshots

### Home

![Home page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/b32813e8-db04-4b02-a2b0-088f7348f0db)
![Home page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/a6a1c6f2-f3a3-4d1b-b027-9a053df69c6f)
![Home page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/59f12a6b-1822-4497-a922-904953931d5c)
![Home page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/044fd678-4231-438c-b8c7-2f977fdfbf5b)
![Home page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/22c83fa5-f2bf-45eb-a58b-5e28948519c0)
![Home page 6](https://github.com/ErickLimaS/anime-website/assets/69987890/a06e5474-e966-4ecf-9cee-88e2f794905f)

### Anime/Manga Page

![Anime/Manga Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/9f5e1eeb-4cd3-4c0d-8b8e-de5c72c6e44d)
![Anime/Manga Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/c3ac37db-6e90-4116-a829-8089af20f6d1)
![Anime/Manga Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/4ebc757e-091e-4c21-9621-5cf04262183a)
![Anime/Manga Page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/61383f33-4acb-45d4-a801-ae87926501aa)

### Watch Episode Page

![Watch Episode Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/491db36e-e655-4c91-970c-59983c546cb3)
![Watch Episode Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/62c3d7d0-809b-4e09-871e-6c9d2e809f71)

### Read Page

![Read Chapter Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/c1b07318-2923-49d6-a615-d80bd213f30e)

### Search/Filter Page

![Search/Filter Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/32af6c21-ca79-4cb9-9cb9-7b9f30e80302)

### Watchlist Page

![Watchlist Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/92a95f4b-c0cc-412d-8ad4-4bc89562d6fd)

### News Home Page

![News Home Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/c9567461-a0b3-42dd-bd82-c8ab861145b2)
![News Home Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/ffcc986f-7aa7-4a77-b5ca-7f3628ff86a3)
![News Home Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/25738777-ebc0-484d-b387-fd4443bf6cd3)

### News Article Page

![News Article Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/de58a15a-eed4-4cdc-9249-900a90c21c50)

## Inspiration

- <a href='https://preview.themeforest.net/item/vodi-video-wordpress-theme-for-movies-tv-shows/full_screen_preview/23738703' target="_blank" rel="noreferrer">Template</a>
- <a href='https://dribbble.com/shots/20333170-The-Trailers-Concept-Site-Part-2' target="_blank" rel="noreferrer">Media Page</a>
