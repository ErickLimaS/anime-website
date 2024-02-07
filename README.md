<h1 align="center">AniProject 2.0 - Under Development!</h1>

![Logo Do Site AniProject.](https://user-images.githubusercontent.com/69987890/177884319-0678f842-f3ca-4f62-8d31-7638ca954057.png)

Projeto de um site de animes e mangas, utilizando a API da <a href='https://anilist.gitbook.io/anilist-apiv2-docs/'>AniList</a> que dispoe informações de animes e episódios sendo lançados atualmente, dados do elenco por trás de tal mídia, e muito mais.

## :hammer: Funcionalidades

- [x] `Pesquise`: Use o sistema de busca para saber detalhes de animes, mangas, e mais.
- [x] `Assista`: Achando o anime que procurava, será possivel ver grande parte dos episódios disponibilizados pela Crunchyroll e outras fontes através das APIs.
- [x] `Leia`: Em mangas, é possível ver os capítulos lançados e ler em sites que o disponibilzam. 

## :pushpin: Em Planejamento
 
- [ ] `Crie sua Conta`
- [ ] `Marque Mangas e Episódios já vistos`
- [ ] `Marque seus Animes e Mangas Favoritos`
- [ ] `Tenha o histórico registrado do que já assitiu até agora`
- [ ] `Seja Alertado de Novos Episódios Lançados`

## :heavy_check_mark: Tecnologias Utilizadas

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
  NEXT_PUBLIC_CONSUMET_API_URL=https://your-hosted-consumet-api.com
  ```

4. From ``front-end directory``, run ``npm run dev`` to initialize the website
  ```javascript
  npm run dev
  ```

