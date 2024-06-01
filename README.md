<h1 align="center">AniProject</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the AniList, Consumet and Aniwatch API, which has info of animes and mangas released, data of the cast of that media, and many other things.

<p align="center">You can access this website on <a href='https://aniproject-dev.vercel.app/'>Vercel</a> or <a href='https://aniproject-website.onrender.com'>Render (really slow)</a>.</p>

## Navigation

- [Features](#hammer-features)
- [Under Development](#pushpin-under-development)
- [Tecnologies Used](#heavy_check_mark-tecnologies-used)
- [How Can i Run It](#computer-how-can-i-run-it)
- [How Fireabase is Organized](#open_file_folder-how-firebase-is-organized)
  - [Authentication](#authentication)
  - [Collections and Documents](#collections-and-documents)
    - [Users](#users)
    - [Comments](#comments)
    - [Notifications](#notifications)
- [Previews/Screenshots](#camera-previewscreenshots)

## :hammer: Features

- [x] `Search`: Get a list of all animes and mangas you want using filters.
- [x] `Watch`: Watch any available episode Dubbed or Subbed.
- [x] `Read`: Read any manga chapter available.
- [x] `Comment`: Write what you thougth of that episode or just tell something that every should know about.
- [x] `Log In`: You can log in with Google, GitHub or Anonymously (with some restrictions).
- [x] `Keep Watching`: Continue the episode from where you stop last time.
- [x] `Be Notified`: When a New Episode is Released, you get a notification on the website.
- [x] `Bookmark your favourite animes e mangas`: Save for later your animes and mangas.
- [x] `Bookmark the episodes you watched`: And keep watching from there later
- [x] `News Feed`: Keep up with the latest news of animes, mangas and the industry.

## :pushpin: Under Development

- [ ] `Fetch User List from MyAnimeList`
- [ ] `Fetch User List from AniList (if possible)`

## :heavy_check_mark: Tecnologies Used

Front-end (on netlify.com):

- `React`
- `Next.js`
- `TypeScript`
- `Axios`
- `Firebase`
- `GraphQL`
- `Framer Motion`
- `Swiper`
- `Anilist API`
- `Consumet API`
- `Aniwatch API`

Back-End:

- `Firebase`
- `Next.js API Routes`

## :computer: How Can I Run It?

1. `Fork` (recommended) or `Clone` this repository

```javascript
  git clone https://github.com/ErickLimaS/anime-website.git
```

2. Run `npm install` on your CMD to get all dependencies

```javascript
npm install
```

3. Now you will need to create a `.env.local` file on the `project root folder` with the url to where your Consumet and Aniwatch is setted and the settings to your Firebase Account.

   - Go to these repos and host your own instance:
     - <a href='https://github.com/consumet/api.consumet.org'>Consumet API</a>
     - <a href='https://github.com/ghoshRitesh12/aniwatch-api'>Aniwatch API</a>
   - OPTIONAL: This project uses a JSON file (47 mb) filled with Animes and Mangas data as a offline Database. This repository already has this file, but it might be outdated, so you decide if you want to ignore this step.
     - Go to <a href='https://github.com/manami-project/anime-offline-database'>anime-offline-database</a> and download the JSON file that will be used on only `Search Page` (or you can make some changes and use some API to fetch the data).
     - With the file downloaded, put it in the `/app/api/anime-info` directory, replacing the previous one.
   - On Firebase, get your configs to use the Authentication and Firestore Database.
     - All the Firebase info needed bellow can be found when you create a new project.
     - IMPORTANT: Make Sure to ALLOW your Hosted Website Domain on Firebase Authentication!

With all that done, you will need to fill the `.env.local` like the example bellow:

```javascript
NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api-url.com
NEXT_PUBLIC_ANIWATCH_API_URL=https://your-hosted-aniwatch-api-url.com
// Make sure to add the pathname "/api/animes-database" bellow
NEXT_PUBLIC_NEXT_INTERNAL_API_URL=https://url-to-where-your-website-is-hosted.com/api/animes-database
NEXT_PUBLIC_FIREBASE_API_KEY=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_APP_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_DATABASE_URL=firebase-setting-related-to-this-field
```

4. Now run `npm run dev` to initialize the website

```javascript
npm run dev
```

5. That's it! It should be running.

## :open_file_folder: How Firebase is Organized

### Authentication

With Firebase Authentication, theres 4 methods of Login/Signup:

- Email
- Google
- GitHub
- Anonymous

It is used to store on User Document things like:

- User Profile Photo
- Username
- Preferences (media source, adult content, subtitles and more)
- Comments
- Notifications
- Bookmarked Medias
- Currently Watching Medias
- Episodes Watched/Chapters Read

### Collections and Documents

With Firebase Database, we have 3 Collections:

#### Users

Stores only Users Documents after a successfull signup.

#### Comments

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
