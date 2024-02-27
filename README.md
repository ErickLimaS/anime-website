<h1 align="center">AniProject 2.0 - Under Development!</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the <a href='https://anilist.gitbook.io/anilist-apiv2-docs/'>AniList</a> API which has info of animes and mangas released, data of the cast of that media, and many other things.

You can access it <a href='https://aniproject-dev.netlify.app/'>here</a>.

## :hammer: Features

- [x] `Search`: Get a list of animes and mangas you want to search.
- [x] `Watch`: Watch any available episode.
- [x] `Read`: Read any manga chapter available.
- [x] `Comment`: Write what you thougth of that episode or just tell something that every should know about.
- [x] `Log In`: You can log in with your Google or GitHub Account.
- [x] `Bookmark your favourite animes e mangas`: Save for later your animes and mangas.
- [x] `Bookmark the episodes you watched`: And keep watching from there later

## :pushpin: Under Development
 
- [ ] `Keep track of what you watched last`
- [ ] `Be notified when a new episode/chapter is released`

## :heavy_check_mark: Tecnologies Used

Front-end (on netlify.com):

- ``React``
- ``Next.js``
- ``TypeScript``
- ``Axios``
- ``Firebase``
- ``GraphQL``
- ``Framer Motion``
- ``Swiper``
- ``Anilist API``
- ``Consumet API``

Back-End (Firebase (Backend as a Service)):

- On Development...


## :computer: How Can I Run It? 

Its simple!

1. ``Clone`` this repository
```javascript
  git clone https://github.com/ErickLimaS/anime-website.git
  ```
   
2. From the ``front-end directory``, run ``npm install`` on your CMD to get all dependencies
  ```javascript
  npm install
  ```
  
3. Now you need to create a ``.env.local`` file inside the ``front-end directory`` with the url to where your Consumet API server is setted and configs for your Firebase.
   - Check the <a href='https://github.com/consumet/api.consumet.org'>repository of Consumet API</a>.
   - On Firebase, get your config to use the Authentication and Firestore Database.
      
   Your file should look like example:
  ```javascript
  NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api-url.com
  NEXT_PUBLIC_FIREBASE_API_KEY=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_APP_ID=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=[YOUR-FIREBASE-SETTINGS]
  NEXT_PUBLIC_FIREBASE_DATABASE_URL=[YOUR-FIREBASE-SETTINGS]
  ```

4. From ``front-end directory``, run ``npm run dev`` to initialize the website
  ```javascript
  npm run dev
  ```

5. That's it! It should be running.
   
## :computer: Preview/Screenshots

### Home

![Home page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/9500407a-86d1-4204-b658-aa8cebd33c1a)
![Home page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/c5db2826-1dec-482f-a59b-64c57d9efa3c)
![Home page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/3984c900-e0b3-4f55-b6bf-bb88011ae0d4)
![Home page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/44ee6d2d-e2cd-43ee-814a-77f683006767)
![Home page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/9f9f95fa-cc45-4108-883d-34da0e91e3fd)
![Home page 6](https://github.com/ErickLimaS/anime-website/assets/69987890/bed3c0c3-4be5-410e-a943-2e0a868c3b9b)
![Home page 7](https://github.com/ErickLimaS/anime-website/assets/69987890/6c59514d-ccff-4e4d-9c1b-f838b4641ae5)

### Anime/Manga Page

![Anime/Manga Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/42fc035e-2f06-4c7b-96aa-884ac3666d7d)
![Anime/Manga Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/675d5978-ed6c-453c-81e0-399b5439597b)
![Anime/Manga Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/37d37ea5-279c-4988-9cfa-ae06961c9925)
![Anime/Manga Page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/c60d8747-8fb6-4554-8d7d-f78be87455b4)
![Anime/Manga Page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/520a1c99-1392-429b-b4ef-b392288ea421)

### Watch Episode Page

![Watch Episode Page1](https://github.com/ErickLimaS/anime-website/assets/69987890/7df405d1-6b2b-4866-8c48-4c0eb7f14c5d)
![Watch Episode Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/d8a1998c-df5d-4904-b40c-aa71c3aff2dc)

### Playlist Page

![Playlist page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/c8ed47e5-6ac8-4ec2-adc4-fdbf2119cc11)

