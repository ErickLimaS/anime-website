import styled from "styled-components";

interface Props {
    data: any;
    indexHeading: number,
    isAlreadyAdded: any,
    alreadyWatched: any,
    videoReady: any,
    videoId: any
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
        /* background-color: #555; */
        background-image: url('https://shisui23.files.wordpress.com/2013/10/anime1.jpg');
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
                color: #333333;
            }

            .buttons{

                display: flex;
                
                button{
                    cursor: pointer;
                    margin: 0 1rem;

                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;

                    padding: 0.7rem;

                    font-size: 1.6rem;
                    color: ${props => props.isAlreadyAdded == null ? '#333333' : '#fff'};

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

                button.watched{

                    color: ${props => props.alreadyWatched == null ? '#333333' : '#fff'};

                    background-color: ${props => props.alreadyWatched == null ? 'transparent' : '#ff5ebc'};

                    svg{

                        fill: ${props => props.alreadyWatched == null ? '#ff5ebc' : '#fff'};

                        padding-right: 0.4rem;
                        padding-left: 0.1rem;
                    }

                }

            }
        }
        
        p{
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
        }

        h2{

            padding: 0.5rem 1rem;

            font-size: 2rem;
            font-weight: 600;

        }
        

        #h2-0{
            border: ${props => props.indexHeading === 0 ? '1px solid transparent' : '1px solid #ff5ebc'};
            background-color: ${props => props.indexHeading === 0 ? '#ff5ebc!important' : '#fafafa'};
            color: ${props => props.indexHeading === 0 ? '#fff' : '#ff5ebc'};
        }
        #h2-1{
            border: ${props => props.indexHeading === 1 ? '1px solid transparent' : '1px solid #ff5ebc'};
            background-color: ${props => props.indexHeading === 1 ? '#ff5ebc!important' : '#fafafa'};
            color: ${props => props.indexHeading === 1 ? '#fff' : '#ff5ebc'};
        }
        #h2-2{
            border: ${props => props.indexHeading === 2 ? '1px solid transparent' : '1px solid #ff5ebc'};
            background-color: ${props => props.indexHeading === 2 ? '#ff5ebc!important' : '#fafafa'};
            color: ${props => props.indexHeading === 2 ? '#fff' : '#ff5ebc'};
        }
        
        @media(max-width: 620px){
            .svg-dots{
                display: none;
            }
        }
        
    }

    .video{
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 2rem 0;

        width: inherit;
        height: inherit;

        svg{
            width: 20%;
            height: auto;
        }

        iframe{
                display: ${props => props.videoReady ? `flex` : 'none'};
                width: 100%;
                height: 48rem;

                @media(min-width: 1440px){
                    
                    width: 100%;
                    height: 720px;

                }

                @media(max-width: 1080px){
                    
                    width: 48rem;
                    height: 32rem;

                }
                @media(max-width: 620px){
                    
                    width: 48rem;
                    height: 32rem;

                }
                @media(max-width: 440px){
                    
                    width: 32rem;
                    height: 26rem;

                }
        }
    }

    div.warning{

        display: flex;
        flex-direction: column;

        border: 2px solid #ff9412;
        border-radius: 4px;

        padding: 1rem;
        margin-bottom: 2rem;

        >*{
            margin: 0.5rem 0;
        }
        span{
            display: flex;
            flex-direction: row;
            align-items: center;

            svg{
                fill: #f58805;
                width: auto;
                height: 4rem;

                margin: 0 1rem;
            }
        }

        h1{
            color: #f58805;
            font-size: 3rem;
            font-weight: 600;
        }
        p{
            font-size: 2rem;
            font-weight: 400;
        }
        h2{
            color: #f58805;
            font-size: 1.8rem;
            font-weight: 600;
        }

    }

    .anime-episodes{

        display: grid;
        grid-template-columns: auto auto auto auto;
        justify-items: center;
        gap: 2rem 1rem;

        @media(max-width: 1200px){
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

            @media(min-width: 1080px){
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

            @media(max-width: 1080px){
                width: auto;
            }
        }
    }

`