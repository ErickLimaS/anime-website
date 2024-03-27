<h1 align="center">AniProject</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the <a href='https://anilist.gitbook.io/anilist-apiv2-docs/'>AniList</a> API which has info of animes and mangas released, data of the cast of that media, and many other things.

<p align="center">You can access it <a href='https://aniproject.netlify.app/'>here</a>.</p>

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
- `Swiper`
- `Anilist API`
- `Consumet API`
- `Aniwatch API`

Back-End:

- `Firebase`
- `Next.js API routes`

## :computer: How Can I Run It?

Its simple!

1. `Clone` this repository

```javascript
  git clone https://github.com/ErickLimaS/anime-website.git
```

2. Run `npm install` on your CMD to get all dependencies

```javascript
npm install
```

3. Now you need to create a `.env.local` file inside the `directory` with the url to where your Consumet API server is setted and configs for your Firebase.
   - Check the <a href='https://github.com/consumet/api.consumet.org'>repository of Consumet API</a> and host your own server.
   - Do the same with <a href='https://github.com/ghoshRitesh12/aniwatch-api'>Aniwatch API</a> and <a href='https://github.com/cool-dev-guy/vidsrc-api'>VidSrc API</a>.
   - Go to <a href='https://github.com/manami-project/anime-offline-database'>this repository</a> and get a JSON file filled with Animes info to use.
   - This repository already has this json file, but it might be outdated. So get a new file there and put it under the `/app/api/anime-info` directory.
   - On Firebase, get your configs to use the Authentication and Firestore Database.
   Your file should look like example:

```javascript
NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api-url.com
NEXT_PUBLIC_ANIWATCH_API_URL=https://your-hosted-aniwatch-api-url.com
NEXT_PUBLIC_VIDSRC_API_URL=https://your-hosted-vidsrc-api-url.com
NEXT_PUBLIC_INSIDE_API_URL=https://url-to-where-your-website-is-hosted.com/api/anime-info
NEXT_PUBLIC_FIREBASE_API_KEY=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_PROJECT_ID=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_APP_ID=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=[YOUR-FIREBASE-SETTINGS]
NEXT_PUBLIC_FIREBASE_DATABASE_URL=[YOUR-FIREBASE-SETTINGS]
```

4. Now run `npm run dev` to initialize the website

```javascript
npm run dev
```

5. That's it! It should be running.

## :computer: Preview/Screenshots

### Home

![Home page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/a5afa4c6-4414-40ac-948a-bf09fd9057cf)
![Home page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/82def7e4-41b7-4d3d-a12e-e9b19c947385)
![Home page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/942a3868-e618-4e78-bc6f-b1e27dc93e3d)
![Home page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/c3547111-ef51-4289-aca8-f12cf7639a1a)
![Home page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/b997120e-7006-4912-bbb2-212f31532d5a)
![Home page 6](https://github.com/ErickLimaS/anime-website/assets/69987890/c2f63bc5-1d56-495f-a262-3f638f7cc8f8)
![Home page 7](https://github.com/ErickLimaS/anime-website/assets/69987890/8e5be52c-5bcd-4149-afc9-794a534f6b66)

### Anime/Manga Page

![Anime/Manga Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/516197d1-b1d3-48da-bac0-415f0e18c232)
![Anime/Manga Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/f18100b7-29bb-4e4e-9177-02c0fdd49c5e)
![Anime/Manga Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/e57ef335-b093-43bd-bd0e-2a97840eb002)
![Anime/Manga Page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/e971891e-7dd3-4079-89be-e0e34489389d)
![Anime/Manga Page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/3c4f78fe-e36e-4534-bec0-f5aa8959b7cb)

### Watch Episode Page

![Watch Episode Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/1a8bf99a-3d68-4b11-b5d6-17a0e9099300)
![Watch Episode Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/1f174cfb-e153-467e-aab0-a6193feab584)

### Search/Filter Page

![Search/Filter Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/73e09258-c927-43cf-9a02-6ddfb4af5b14)
![Search/Filter Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/497b35fe-4c6e-464a-9cc4-3a338db9d4cf)

### Watchlist Page

![Watchlist page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/395214ba-ed17-4732-899c-0f7347186d76)

### News Home Page

![News Home Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/4dd2c9d4-9c96-4c20-904b-b1abdf71aa37)
![News Home Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/78a5889e-4fe9-4ebf-bae0-e8c014772196)
![News Home Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/f6852a01-b012-43f0-a69b-d4c2113988e3)

### News Article Page

![News Article Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/216eca9e-4e9f-4c9f-9b0d-3ae40cb53772)
