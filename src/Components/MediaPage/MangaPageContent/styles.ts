import styled from "styled-components";

interface Props {
    data: any;
}

export const Container = styled.div<Props>`

    width: 100%;

    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;

    padding: 1rem 3rem 3rem 3rem;

    @media(max-width: 1020px){
        width: -webkit-fill-available;
        padding: 1rem ;
    }

    @media(max-width: 620px){
        border-left: 0;
        border-right: 0;
        padding: 0;
    }

    .search-mobile{
        display: none;
    
        @media(max-width: 620px){
            display: block;

            padding: 1rem 0;
        }
    }

    .banner-img{
        height: 40vh;
        width: auto;
        background-image: url(${(props) => props.data.bannerImage ? props.data.bannerImage : 'https://www.seekpng.com/png/full/132-1326686_creepy-yuno-anime-banners-de-youtube.png'});
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .name-and-description{

        margin: 2rem 0;

        border-bottom: 4px solid #ff5ebc;

        >*{
            margin: 1rem 0;
        }

        h1{
            font-size: 3rem;
            font-weight: 600;
            /* color: #ff5ebc; */
            color: ${props => props.data.coverImage.color};
        }
        
        p{
            font-size: 1.6rem;
            font-weight: 400;

            span{
                cursor: pointer;
                color: #ff5ebc;
                text-decoration: underline;

                :hover{
                }
            }
        }
    }

    .heading{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        margin: 2rem 0;

        h2{
            font-size: 2rem;
            font-weight: 600;
            color: #222222;
        }
    }

    .from-same-franchise{

        h2{
            font-size: 2rem;
            font-weight: 600;
            color: #222222;
            margin: 2rem 0;

            span{
                color: #ff5ebc;
            }
        }

        ul{
            overflow: auto;
            width: 110vh;
            display: flex;
            flex-direction: row;

            @media(max-width: 1080px){
                width: auto;
            }
           
            ::-webkit-scrollbar {
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #f1f1f1; 
            }
            
            ::-webkit-scrollbar-thumb {
                background: #888;

                border-radius: 2px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #555; 
            }
        }
    }

    .similar-animes{
        display: flex;
        flex-direction: column;

        margin: 2rem 0;

        border-top: 4px solid #ff5ebc;

        h2{
            font-size: 2rem;
            font-weight: 600;
            color: #222222;
            margin: 2rem 0;

            span{
                color: #ff5ebc;
            }
        }

        ul{
            overflow: auto;
            width: 110vh;
            display: flex;
            flex-direction: row;

            @media(max-width: 1080px){
                width: auto;
            }

            ::-webkit-scrollbar {
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #f1f1f1; 
            }
            
            ::-webkit-scrollbar-thumb {
                background: #888;

                border-radius: 2px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #555; 
            }
        }
    }

`