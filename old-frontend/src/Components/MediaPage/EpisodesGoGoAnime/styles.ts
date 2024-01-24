import styled from "styled-components";

interface PropsContainer {
    episodeActive: boolean,
    darkMode: boolean
}

interface PropsButtons {
    isWatched: boolean,
    onBookmarks: boolean
}

export const Container = styled.div<PropsContainer>`

        cursor: default;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 120px;
        height: auto;

        button.episode-button{
            width: 100%;
            position: relative;
            cursor: pointer;

            background-color: transparent;
            border: none;
                
            border-radius: 4px;

        }

        div.episode-banner{

            width: 100%;
            height: 10vh;

            margin-bottom: 10px;

        }

        div.episode-banner span{

            font-size: 3rem;
            font-weight: 600;
            font-family: 'Poppins', 'Courier New', Courier, monospace;

            width: 100%;
            height: 100%;

            color:${props => props.darkMode === true && props.episodeActive === false && 'var(--white)'};
            color:${props => props.darkMode === true && props.episodeActive && 'var(--brand-color)'};
                
            color:${props => props.darkMode === false && props.episodeActive && 'var(--brand-color)'};
            color:${props => props.darkMode === false && props.episodeActive === false &&'var(--black-variant)'};

            position: relative;
            z-index: 10;

            display: flex;
            align-items: center;
            justify-content: center;

        }

        div.episode-banner::before{

            content: '';

            filter: blur(2px);

            top: 0;
            left: 0;
            overflow: hidden;
            position: absolute;
            z-index: 1;

            background-image: url(/img/logo2.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;

            border: 2px solid #4e002d;

            width: inherit!important;
            height: inherit!important;

            background-color: ${props => props.darkMode ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.15)'};
            border-radius: 4px;

        }

        h3{
            color:${props => props.darkMode === true && props.episodeActive === false && 'var(--text-grey-variant2)'};
            color:${props => props.darkMode === true && props.episodeActive && 'var(--brand-color)'};
                
            color:${props => props.darkMode === false && props.episodeActive && 'var(--brand-color)'};
            color:${props => props.darkMode === false && props.episodeActive === false &&'#444444'};

            font-size: 1.2rem;
        }

        :hover{

                img{
                    transition: all ease-in-out 100ms;
                    transform: scale(1.1);
                }
                h3{
                    transition: all ease-in-out 100ms;
                    color: ${props => props.episodeActive ? '#787878' : '#ff0095'};
                }
        }
          

`
export const Buttons = styled.div<PropsButtons>`

    margin-top: 15px;

    width: inherit;

    display: flex;
    flex-direction: row;
    justify-content: space-around;

    button.isWatched{
        cursor: pointer;

        color: ${props => props.isWatched === false ? '#ff5ebc' : '#fff'};
        border: 1px solid ${props => props.isWatched === false ? '#ff5ebc' : '#fff'};

        background-color: ${props => props.isWatched === false ? 'transparent' : '#ff5ebc'};

        outline: 0;
        border-radius: 4px;

        svg{

            fill: ${props => props.isWatched === false ? '#ff5ebc' : '#fff'};

            padding: 0.5rem;
        }

    }

    button.onBookmarks{
        cursor: pointer;

        color: ${props => props.onBookmarks === false ? '#ff5ebc' : '#fff'};
        border: 1px solid ${props => props.onBookmarks === false ? '#ff5ebc' : '#fff'};

        background-color: ${props => props.onBookmarks === false ? 'transparent' : '#ff5ebc'};

        outline: 0;
        border-radius: 4px;

        svg{

            fill: ${props => props.onBookmarks === false ? '#ff5ebc' : '#fff'};

            padding: 0.5rem;
        }

    }

    button:hover{
        transition: all ease-in-out 200ms;
        transform: scale(1.2);

        box-shadow: 0px 0px 2px 2px #c0c0c0;
    }

`