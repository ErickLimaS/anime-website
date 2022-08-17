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

            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            width: 120px;
            height: auto;

        button.episode-button{
                cursor: pointer;

                background-color: ${props => props.episodeActive ? '#f92f7f' : '#ff5ebc33'};

                border: 2px solid ${props => props.episodeActive ? '#f92f7f' : '#ff5ebc'};

                border-radius: 4px;

                padding: 1rem 0.5rem;

                width: -webkit-fill-available;
                height: -webkit-fill-available;

        }

        img{
                width: 180px;
                height: auto;

                border-radius: 4px;

                @media(max-width: 430px){
                    width: 160px;
                }

                @media(max-width: 360px){
                    width: 140px;
                }

        }

        a{
                display: flex;
                height: inherit;
                width: inherit;
                justify-content: center;
                align-items: center;
        }

        h3{
                color:${props => props.darkMode === true && props.episodeActive === false && 'var(--text-grey-variant)'};
                color:${props => props.darkMode === true && props.episodeActive && '#fff'};
                
                color:${props => props.darkMode === false && props.episodeActive && '#fff'};
                color:${props => props.darkMode === false && props.episodeActive === false &&'#444444'};

                font-size: 1.6rem;
        }

        :hover{

                img{
                    transition: all ease-in-out 100ms;
                    transform: scale(1.1);
                }
                h3{
                    transition: all ease-in-out 100ms;
                    color: ${props => props.episodeActive ? '#fff' : '#ff0095'};
                }
        }
          

`
export const Buttons = styled.div<PropsButtons>`

    margin: 0.5rem 0;

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