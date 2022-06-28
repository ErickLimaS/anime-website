import Axios from "axios"

const GOGOANIME_URL = `https://riimuru-gogo-anime-api.herokuapp.com`

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    searchMedia: async (searchThis: String) => {

        try {

            const { data } = await Axios({
                url: `${GOGOANIME_URL}/search?keyw=${searchThis}`,
                method: 'GET'
            })

            return data;

        }
        catch (error) {

            console.log(error)

        }

    },

    getInfoFromThisMedia: async (id: String | number) => {

        try{
            const { data } = await Axios({
                url: `${GOGOANIME_URL}/anime-details/${id}`,
                method: 'GET'
            })

            return data;
        }
        catch (error) {

            console.log(error)

        }
        


    }


}