<h1 align="center">AniProject 2.0 - Under Development!</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the <a href='https://anilist.gitbook.io/anilist-apiv2-docs/'>AniList</a> API which has info of animes and mangas released, data of the cast of that media, and many other things.

You can access it <a href='https://aniproject-dev.netlify.app/'>here</a>.

## :hammer: Features

- [x] `Search`: Get a list of animes and mangas you want to search.
- [x] `Watch`: Watch any available episode.
- [x] `Read`: Read any manga chapter available.
- [x] `Log In`: You can log in with your Google Account (more options in the future).
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

Back-End (being made with MongoDB and Firebase (Backend as a Service)):

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
![Home page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/2880596f-d1fa-4522-a55c-43ab3ba2908e)
![Home page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/134d0040-13b7-491c-af6a-66646fb4437b)
![Home page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/9676c57f-86e3-418d-82e9-50521f8619ba)

### Anime/Manga Page

![Anime/Manga Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/dcf1bcdf-c488-4959-ac10-5171fc38019d)
![Anime/Manga Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/9c49b769-f19d-4972-8655-8cd9815b6026)
![Anime/Manga Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/37de9d84-6521-4f69-a41d-4e54bcc3dffa)

### Watch Episode Page

![Watch Episode Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/a0d6eddc-1d8b-4baa-9ba9-be89de97204e)
![Watch Episode Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/8c73d164-fa68-444c-9ed2-449784aa20eb)

### Playlist Page

![Playlist page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/c8ed47e5-6ac8-4ec2-adc4-fdbf2119cc11)

