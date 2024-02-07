<h1 align="center">AniProject 2.0 - Under Development!</h1>

![AniProject Website Logo](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Project of animes and mangas website, utilizing the <a href='https://anilist.gitbook.io/anilist-apiv2-docs/'>AniList</a> API which has info of animes and mangas released, data of the cast of that media, and many other things.

You can access it <a href='https://aniproject-dev.netlify.app/'>here</a>.

## :hammer: Features

- [x] `Search`: Get a list of animes and mangas you want to search.
- [x] `Watch`: Watch any available episode.
- [x] `Read`: Read any manga chapter available.
      
## :pushpin: Under Development
 
- [ ] `Create Your Acccount`
- [ ] `Bookmark the episodes you watched`
- [ ] `Bookmark your favourite animes e mangas`
- [ ] `Keep track of what you watched last`
- [ ] `Be notified when a new episode/chapter is released`

## :heavy_check_mark: Tecnologies Used

Front-end (on netlify.com):

- ``React``
- ``Next.js``
- ``TypeScript``
- ``Axios``
- ``GraphQL``
- ``Framer Motion``
- ``Anilist API``
- ``Consumet API``

Back-End (planning):

- Still Planning...


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
3. Now you need to create a ``.env.local`` file inside the ``front-end directory`` with the url to where your Consumet API server is setted. You can do it by going in the <a href='https://github.com/consumet/api.consumet.org'>repository of Consumet API</a>.
In this project, it is hosted on render.com. Your file should look like example:
  ```javascript
  NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api-url.com
  ```

4. From ``front-end directory``, run ``npm run dev`` to initialize the website
  ```javascript
  npm run dev
  ```


## :computer: Preview/Screenshots

### Home

![Home page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/02f1637c-2cc1-4746-88a2-5e798e30c969)

![Home page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/4bebb4f1-ad9c-492d-8f89-ec9b0b831d3d)

![Home page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/749a64b1-bbae-450e-91c2-a7c11fedf6e1)

![Home page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/fec4990f-9b66-4551-9240-bf10ed835a25)

![Home page 5](https://github.com/ErickLimaS/anime-website/assets/69987890/d93b8283-ba58-4e6e-a79e-80a419460a1d)

![Home page 6](https://github.com/ErickLimaS/anime-website/assets/69987890/63d34658-a28c-42e7-afa7-9d4cee6782a4)

### Anime/Manga Page

![Anime/Manga Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/9fd9713a-67d3-4307-9952-38f81dd56dc4)

![Anime/Manga Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/2dc533cf-61e1-4061-a6b2-a28ecb36c743)

![Anime/Manga Page 3](https://github.com/ErickLimaS/anime-website/assets/69987890/879cfdc0-a6d5-4a05-98bc-b83810f27c6e)

![Anime/Manga Page 4](https://github.com/ErickLimaS/anime-website/assets/69987890/a2b4e2ba-e685-4e2b-bd56-bb12ba33de01)

### Watch Episode Page

![Watch Episode Page 1](https://github.com/ErickLimaS/anime-website/assets/69987890/4aa7c81c-ef57-4bca-84eb-0690a08774ff)

![Watch Episode Page 2](https://github.com/ErickLimaS/anime-website/assets/69987890/ae8984c6-8eb9-4de4-9df3-2969cc4f775e)
