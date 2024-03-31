<h1 align="center">AniProject</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the <a href='https://anilist.gitbook.io/anilist-apiv2-docs/'>AniList</a> API which has info of animes and mangas released, data of the cast of that media, and many other things.

<p align="center">You can access it <a href='https://aniproject.netlify.app/'>on netlify</a>, <a href='https://aniproject-website.onrender.com'>on render (slow)</a> or <a href='https://aniproject-dev.vercel.app/'>vercel</a>.</p>

## :hammer: Features

- [x] `Search`: Get a list of all animes and mangas you want using filters.
- [x] `Watch`: Watch any available episode.
- [x] `Read`: Read any manga chapter available.
- [x] `Comment`: Write what you thougth of that episode or just tell something that every should know about.
- [x] `Log In`: You can log in with Google, GitHub or Anonymously (with some restrictions).
- [x] `Keep Watching`: Continue the episode from where you stop last time.
- [x] `Bookmark your favourite animes e mangas`: Save for later your animes and mangas.
- [x] `Bookmark the episodes you watched`: And keep watching from there later
- [x] `News Feed`: Keep up with the latest news of animes, mangas and the industry.

## :pushpin: Under Development

- [ ] `Add Reply to Comments`
- [ ] `Be notified when a new episode/chapter is released`

## :heavy_check_mark: Tecnologies Used

Front-end (on netlify.com):

- `React`
- `Next.js`
- `TypeScript`
- `Axios`
- `Firebase`
- `GraphQL`
- `Framer Motion`
- `Styled Components`
- `Swiper`
- `Anilist API`
- `Consumet API`
- `Aniwatch API`

Back-End:

- `Firebase`
- `Next.js API routes`

## :computer: How Can I Run It?

1. `Fork` (recommended) or `Clone` this repository

```javascript
  git clone https://github.com/ErickLimaS/anime-website.git
```

2. Run `npm install` on your CMD to get all dependencies

```javascript
npm install
```

3. Now you will need to create a `.env.local` file on the `project root folder` with the url to where your Consumet, Aniwatch and Vidscr API is setted and the settings to your Firebase Account.

   - Check the <a href='https://github.com/consumet/api.consumet.org'>repository of Consumet API</a> and host your own server.
   - Do the same with <a href='https://github.com/ghoshRitesh12/aniwatch-api'>Aniwatch API</a> and <a href='https://github.com/cool-dev-guy/vidsrc-api'>VidSrc API</a>.
   - This project uses a JSON file (47 mb) filled with Animes and Mangas data as a offline Database. This repository already has this file, but it might be outdated, so you decide if you want to ignore this step.
     - Go to <a href='https://github.com/manami-project/anime-offline-database'>this repository</a> and download the JSON file that will be used on only `Search Page` (or you can make some changes and use some API to fetch the data).
     - With the file downloaded, put it in the `/app/api/anime-info` directory, replacing the previous one.
   - On Firebase, get your configs to use the Authentication and Firestore Database.

  With all that done, you will need to fill the `.env.local` like the example bellow:

```javascript
NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api-url.com
NEXT_PUBLIC_ANIWATCH_API_URL=https://your-hosted-aniwatch-api-url.com
NEXT_PUBLIC_VIDSRC_API_URL=https://your-hosted-vidsrc-api-url.com
NEXT_PUBLIC_INSIDE_API_URL=https://url-to-where-your-website-is-hosted.com/api/anime-info
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

## :computer: Preview/Screenshots

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
