import styled from "styled-components";

interface Props {
    data: any;
    indexHeading: number,
    isAlreadyAdded: any,
    alreadyWatched: any,
    videoReady: any,
    videoId: any,
    loadingVideoplayer: boolean,
    darkMode: boolean
}

export const Container = styled.div<Props>`

    width: 56vw;

    margin: 2rem;

    @media(max-width: 1180px){
        width: initial;
        padding: 1rem;
        margin: 0rem;
    }

    @media(max-width: 620px){

        width: 95%;
        padding: 0;
    }

    .search-mobile{
        display: none;

        @media(max-width: 768px){
            display: block;

            padding: 1rem 0;
        }
    }

    .banner-img{
        height: 40vh;
        width: 56vw;
        background-image: url('https://shisui23.files.wordpress.com/2013/10/anime1.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        @media(max-width: 1280px){

            width: auto;

        }

        @media(max-width: 620px){

            height: 25vh;

            background-size: cover;

            overflow: hidden;

        }
    }

    .name-and-description{

        margin-top: 20px;

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
                color: ${props => props.darkMode ? 'var(--brand-color)' : '#333333'};
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
        
        p{
            margin-top: 2rem;
            
            color: ${props => props.darkMode && 'var(--text-grey-variant)'};
            font-size: 1.6rem;
            font-weight: 400;

            span.more-details{

                display: flex;
                justify-content: flex-end;

                cursor: pointer;

                color: var(--pink-variant-1);
                text-decoration: underline;

            }
        }
    }

    .heading{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        margin-top: 4px;
        padding-top: 20px;
        padding-bottom: 10px;

        div.nav{
            display: flex;
            flex-direction: row;

            >*{
                margin: 0 1rem;
            }
            
            overflow: auto;

            h2{

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

        .svg-dots{

            *{
                fill: ${props => props.darkMode && 'var(--text-grey-variant)'};
            }
        }

        @media(max-width: 620px){
            .svg-dots{
                display: none;
            }
        }
        
    }

    .video{

        position: relative;
        overflow: hidden;
        width: 100%;
        padding-top: ${props => props.videoReady ? '56.25%' : 'none'};;
        margin-bottom: 20px;

        svg{
            width: 100px;
            height: 100px;

            position: relative;
            top: 50%;
            left: calc( 50% - 40px);

            margin: 20% 0;
            
            @media(max-width: 480px){

                top: calc( 50% - 120px)!important;

            }
        }
        
        @media(max-width: 480px){

            padding-top: 0%;

            width: 100%;
            height: 260px;

        }
        
        iframe{
            display: ${props => props.videoReady ? 'block' : 'none'};

            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;

        }
    }

    div.warning{

        display: flex;
        flex-direction: column;

        background-color: ${props => props.darkMode && '#212121'};;

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
            color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#f58805'};
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
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-items: center;
        gap: 2rem 1rem;

        @media(max-width: 1280px){
            grid-template-columns: 1fr 1fr 1fr;
        }

        @media(max-width: 1180px){
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }

        @media(max-width: 980px){
            grid-template-columns: 1fr 1fr 1fr;
        }

        @media(max-width: 730px){
            grid-template-columns: 1fr 1fr;
        }

        @media(max-width: 430px){
            grid-template-columns: 1fr 1fr;
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
            color: var(--pink-variant-2);

            padding: 0 1rem;

            border-bottom: 2px solid var(--pink-variant-2);
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
                background-color: ${props => props.darkMode ? 'rgba(0,0,0,0.4)' : '#e1e1e1'};
            }

            svg{
                fill: ${props => props.darkMode && 'var(--pink-variant-2)'};
                width: 0.7rem;
                height: auto;
            }
        }
    }


`