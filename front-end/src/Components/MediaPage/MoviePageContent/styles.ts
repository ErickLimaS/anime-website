import styled from "styled-components";

interface Props {
    data: any;
    indexHeading: number;
    isAlreadyAdded: any;
}

export const Container = styled.div<Props>`

    width: 100%;

    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;

    padding: 2rem;

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

        @media(max-width: 620px){

            height: 25vh;

            margin: 0 -0.9rem;

            background-size: cover;

            overflow: hidden;

        }
    }

    .name-and-description{

        margin: 2rem 0;

        border-bottom: 4px solid #ff5ebc;

        >*{
            margin: 1rem 0;
        }

        .title-and-add-media-button{

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;

            @media(max-width: 620px){
                flex-direction: column;

                >*{
                    margin: 1rem 0!important;
                }
            }

            h1{
                margin: 0;

                font-size: 3rem;
                font-weight: 600;
                /* color: #ff5ebc; */
                color: ${props => props.data.coverImage.color};
            }

            button{
                cursor: pointer;
                margin: 0;

                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                padding: 0.7rem;

                font-size: 1.6rem;
                color: ${props => props.isAlreadyAdded == null ? '#333333' : '#fff'};;

                border: 2px solid #ff5ebc;
                border-radius: 4px;

                background-color: ${props => props.isAlreadyAdded == null ? 'transparent' : '#ff5ebc'};

                svg{

                    width: 1.5rem;
                    transform: scale(2);
                    height: auto;

                    fill: ${props => props.isAlreadyAdded == null ? '#ff5ebc' : '#fff'};

                    margin: 0.5rem 1rem;

                }

                :hover{
                    opacity: 0.75;
                }

            }
        }
        
        div.description{
            margin-top: 2rem;
            
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

        div.nav{
            display: flex;
            flex-direction: row;

            >*{
                margin: 0 1rem;
            }
            
            overflow: auto;
        }

        h2{
            cursor: pointer;

            height: min-content;

            padding: 0.5rem 1rem;

            border-radius: 4px;

            font-size: 2rem;
            font-weight: 600;

            :hover{
                background-color: #ff5ebc33!important;
            }
        }

        #h2-0{
            border: ${props => props.indexHeading === 0 ? '1px solid transparent': '1px solid #ff5ebc'};
            background-color: ${props => props.indexHeading === 0 ? '#ff5ebc!important': '#fafafa'};
            color: ${props => props.indexHeading === 0 ? '#fff': '#ff5ebc'};
        }
        #h2-1{
            border: ${props => props.indexHeading === 1 ? '1px solid transparent': '1px solid #ff5ebc'};
            background-color: ${props => props.indexHeading === 1 ? '#ff5ebc!important': '#fafafa'};
            color: ${props => props.indexHeading === 1 ? '#fff': '#ff5ebc'};
        }
        
        @media(max-width: 620px){
            .svg-dots{
                display: none;
            }
        }
        
    }

    .cast{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h1{
            margin: 2rem 0;
        }
    }

    ul.more-info{
        
        font-size: 2rem;
        font-weight: 600;

        display: flex;
        flex-direction: column;

        li{
            font-size: 1.8rem;
            font-weight: 400;

            margin: 2rem 0;

            border-bottom: 2px solid #c0c0c0;

            span{
                font-weight: 600;
            }
        }

        .studios, .tags{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            li{
                border-bottom: 0;

                margin: 0.5rem 0;
            }

            li:after{
                content: ', ';
                white-space: pre;
            }

            li:last-child:after{
                content: '';
            }
        }

    }

    .from-same-franchise{

        margin-top: 1rem;
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