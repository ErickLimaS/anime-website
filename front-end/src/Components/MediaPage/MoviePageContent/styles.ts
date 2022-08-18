import styled from "styled-components";

interface Props {
    data: any;
    indexHeading: number;
    isAlreadyAdded: any;
    alreadyWatched: any;
    darkMode: boolean
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

        border-bottom: 4px solid var(--pink-variant-1);

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
                /* color: var(--pink-variant-1); */
                color: ${props => props.data.coverImage.color};
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

                    border: 2px solid var(--pink-variant-1);
                    border-radius: 4px;

                    background-color: ${props => props.isAlreadyAdded == null ? 'transparent' : 'var(--pink-variant-1)'};

                    svg{

                        width: 1.5rem;
                        transform: scale(2);
                        height: auto;

                        fill: ${props => props.isAlreadyAdded == null ? 'var(--pink-variant-1)' : '#fff'};

                        margin: 0.5rem 1rem;

                    }

                    :hover{
                        opacity: 0.75;
                    }

                }

                button.watched{

                    color: ${props => props.darkMode === true && props.alreadyWatched == null && 'var(--white)'};
                    color: ${props => props.darkMode === true && props.alreadyWatched != null && 'var(--white)'};

                    color: ${props => props.darkMode === false && props.alreadyWatched == null && '#333333'};
                    color: ${props => props.darkMode === false && props.alreadyWatched != null && 'var(--white)'};

                    background-color: ${props => props.alreadyWatched == null ? 'transparent' : 'var(--pink-variant-1)'};

                    svg{

                        fill: ${props => props.darkMode === true && props.alreadyWatched == null && 'var(--white)'};
                        fill: ${props => props.darkMode === true && props.alreadyWatched != null && 'var(--white)'};

                        fill: ${props => props.darkMode === false && props.alreadyWatched == null && 'var(--pink-variant-1)'};
                        fill: ${props => props.darkMode === false && props.alreadyWatched != null && 'var(--white)'};
                        
                        padding-right: 0.4rem;
                        padding-left: 0.1rem;
                    }

                }

                button.bookmarked{

                    color: ${props => props.darkMode === true && props.isAlreadyAdded == null && 'var(--white)'};
                    color: ${props => props.darkMode === true && props.isAlreadyAdded != null && 'var(--white)'};

                    color: ${props => props.darkMode === false && props.isAlreadyAdded == null && '#333333'};
                    color: ${props => props.darkMode === false && props.isAlreadyAdded != null && 'var(--white)'};

                    background-color: ${props => props.isAlreadyAdded == null ? 'transparent' : 'var(--pink-variant-1)'};

                    svg{

                        fill: ${props => props.darkMode === true && props.isAlreadyAdded == null && 'var(--white)'};
                        fill: ${props => props.darkMode === true && props.isAlreadyAdded != null && 'var(--white)'};

                        fill: ${props => props.darkMode === false && props.isAlreadyAdded == null && 'var(--pink-variant-1)'};
                        fill: ${props => props.darkMode === false && props.isAlreadyAdded != null && 'var(--white)'};

                        padding-right: 0.4rem;
                        padding-left: 0.1rem;
                    }

                }

            }
        }
        
        div.description{
            margin-top: 2rem;
            
            color: ${props => props.darkMode && 'var(--text-grey-variant)'};
            font-size: 1.6rem;
            font-weight: 400;

            span{
                cursor: pointer;
                color: var(--pink-variant-1);
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

            color: ${props => props.darkMode && 'var(--text-grey-variant)'};
            font-size: 2rem;
            font-weight: 600;

            :hover{
                background-color: #ff5ebc33!important;
            }
        }

        #h2-0{
            border: ${props => props.indexHeading === 0 ? '1px solid transparent' : '1px solid var(--pink-variant-1)'};

            background-color: ${props => props.darkMode === true && props.indexHeading === 0 && 'var(--pink-variant-1)!important'};
            background-color: ${props => props.darkMode === true && props.indexHeading !== 0 && 'transparent!important'};

            background-color: ${props => props.darkMode === false && props.indexHeading === 0 ? 'var(--pink-variant-1)!important' : '#fafafa'};

            color: ${props => props.indexHeading === 0 ? '#fff': 'var(--pink-variant-1)'};
        }
        #h2-1{
            border: ${props => props.indexHeading === 1 ? '1px solid transparent' : '1px solid var(--pink-variant-1)'};

            background-color: ${props => props.darkMode === true && props.indexHeading === 1 && 'var(--pink-variant-1)!important'};
            background-color: ${props => props.darkMode === true && props.indexHeading !== 1 && 'transparent!important'};

            background-color: ${props => props.darkMode === false && props.indexHeading === 1 ? 'var(--pink-variant-1)!important' : '#fafafa'};
            
            
            color: ${props => props.indexHeading === 1 ? '#fff': 'var(--pink-variant-1)'};
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
            color: ${props => props.darkMode && 'var(--text-grey-variant)'};
            margin: 2rem 0;
            border-bottom: ${props => props.darkMode && '2px solid var(--text-grey-variant)'};
            margin: 2rem 0;
        }
    }

    ul.more-info{
        
        font-size: 2rem;
        font-weight: 600;

        display: flex;
        flex-direction: column;

        li{
            color: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'initial'};
            font-size: 1.8rem;
            font-weight: 400;

            margin: 2rem 0;

            border-bottom: 2px solid #c0c0c0;

            span{
                color: ${props => props.darkMode ? 'var(--text-grey-variant2)':'initial'};
                font-weight: 600;
            }
        }

        .studios, .tags{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            a{
                color: ${props => props.darkMode ? 'var(--text-grey-variant2)':'#'};
                text-decoration: underline;

                :hover{

                    color: #777;

                }
            }
            
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
        border-top: 4px solid var(--pink-variant-1);

        h2{
            font-size: 2rem;
            font-weight: 600;
            color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#222222'};
            margin: 2rem 0;

            span{
                color: var(--pink-variant-1);
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
        }
    }

    .similar-animes{
        display: flex;
        flex-direction: column;

        margin: 2rem 0;

        border-top: 4px solid var(--pink-variant-1);

        h2{
            font-size: 2rem;
            font-weight: 600;
            color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#222222'};
            margin: 2rem 0;

            span{
                color: var(--pink-variant-1);
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
        }
    }

`