const anilistMediasTypes = ["ANIME", "MANGA", "MOVIE"];

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleError({ error, res }) {
    return res.status(error.errors[0].status || 500).json({
        message: error.errors[0].message || "An error occurred",
        error: error.errors || "An error occurred",
        result: null
    });
}

function fetchOptions({ graphqlQuery, authToken }) {

    const headersOptions = authToken ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
    } : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    return {
        method: "POST",
        headers: headersOptions,
        body: JSON.stringify(graphqlQuery)
    }
}

function getMediaFormatByType({ type, formatOnParams }) {

    const formatsAvailableForAnime = ['TV', 'TV_SHORT', 'OVA', 'ONA', 'MUSIC'];
    const formatsAvailableForManga = ['MANGA', 'NOVEL', 'ONE_SHOT'];
    const formatsAvailableForMovie = ['MOVIE'];

    switch (type.toLowerCase()) {
        case 'anime':
            if (formatsAvailableForAnime.find((item) => item == formatOnParams?.toUpperCase())) return formatOnParams.toUpperCase();

            return 'TV'

        case 'manga':

            if (formatsAvailableForManga.find((item) => item == formatOnParams?.toUpperCase())) return formatOnParams.toUpperCase();

            return 'MANGA'

        case 'movie':

            if (formatsAvailableForMovie.find((item) => item == formatOnParams?.toUpperCase())) return formatOnParams.toUpperCase();

            return 'MOVIE'

        default:

            if (type.toLowerCase() == 'movie') return 'MOVIE';
            if (type.toLowerCase() == 'manga') return 'MANGA';

            return 'TV'
    }
}

module.exports = {
    anilistMediasTypes,
    fetchOptions,
    getMediaFormatByType,
    handleResponse,
    handleError
}