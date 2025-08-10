
const CONSUMET_API_URL = process.env.CONSUMET_API_URL;
const ANIWATCH_API_URL = process.env.ANIWATCH_API_URL;

return {
    "consumet/gogoanime": [{
        "apiName": "consumet-gogoanime",
        "apiUrl": CONSUMET_API_URL + "/anime/gogoanime",
    }],
    "consumet/zoro": [{
        "apiName": "consumet-zoro",
        "apiUrl": CONSUMET_API_URL + "/anime/zoro",
    }],
    "aniwatch": [{
        "apiName": "aniwatch",
        "apiUrl": ANIWATCH_API_URL + "/testetest",
    }]
}