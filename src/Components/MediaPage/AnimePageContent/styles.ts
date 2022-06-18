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

    .anime-episodes{

        display: grid;
        grid-template-columns: auto auto auto auto;
        gap: 2rem 1rem;

        @media(max-width: 1080px){
            grid-template-columns: auto auto auto;
            justify-items: center;
        }

        @media(max-width: 730px){
            grid-template-columns: auto auto;
            justify-items: center;
        }

        @media(max-width: 430px){
            grid-template-columns: auto auto;
            justify-items: center;
        }

        .episode{

            width: min-content;

            img{
                width: 180px;
                height: auto;

                border-radius: 4px;

                @media(max-width: 430px){
                    width: 140px;
                }

            }

            h3{
                color: #444444;
            }

            :hover{

                img{
                    transition: all ease-in-out 100ms;
                    transform: scale(1.1);
                }
                h3{
                    transition: all ease-in-out 100ms;
                    color: #ff0095;
                }
            }
        }
    }

    div.pagination-buttons{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 100%;

        margin: 2rem 0;

        span{
            font-size: 2rem;
            font-weight: 600;
            color: #ff0095;

            padding: 0 1rem;

            border-bottom: 2px solid #ff0095;
        }

        button[disabled]{
            cursor: default;
            opacity: 0.5;

            :hover{
                background-color: initial;
            }
        }

        button{
            cursor: pointer;

            padding: 1rem;
            margin: 0 1rem;

            border: 0;
            background-color: transparent;
            border-radius: 20%;
            
            :hover{
                background-color: #e1e1e1;
            }

            svg{
                width: 0.7rem;
                height: auto;
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
        }
    }

`