import styled from "styled-components";

interface Props {
    isWatched: boolean,
    onBookmarks: boolean
}

interface Props2 {

    darkMode: boolean
}

export const Container = styled.div<Props2>`

    width: min-content;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

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

    h3{
        color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#444'};
    }

    :hover{

        img{
            transition: all ease-in-out 100ms;
            transform: scale(1.1);
        }
        h3{
            transition: all ease-in-out 100ms;
            color: var(--brand-color);
        }
    }
    

`
export const Buttons = styled.div<Props>`

    margin: 0.5rem 0;

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

        color: ${props => props.onBookmarks === false ? 'var(--pink-variant-1)' : 'var(--white)'};
        border: 1px solid ${props => props.onBookmarks === false ? 'var(--pink-variant-1)' : 'var(--white)'};

        background-color: ${props => props.onBookmarks === false ? 'transparent' : 'var(--pink-variant-1)'};

        outline: 0;
        border-radius: 4px;

        svg{

            fill: ${props => props.onBookmarks === false ? 'var(--pink-variant-1)' : 'var(--white)'};

            padding: 0.5rem;
        }

    }

    button:hover{
        transition: all ease-in-out 200ms;
        transform: scale(1.2);

        box-shadow: 0px 0px 2px 2px #c0c0c0;
    }

`