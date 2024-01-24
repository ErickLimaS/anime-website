import styled from "styled-components";

interface Props {
    darkMode: boolean
}

export const Container = styled.a<Props>`

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;


    @media(max-width: 590px){

        width: 100%;

    }

    padding: 0.2rem;

    background-color: ${props => props.darkMode ? 'var(--black-variant)' : '#fff'};
    border: 1px solid var(--brand-color);
    border-radius: 4px;

    .item-img{
        height: min-content;

        img{
            height: 18rem;
            min-width: 12rem;
            max-width: 12rem;

            border-radius: 4px;
        }
    }

    .item-info{
        width: 11rem;
        height: 90%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        margin: 0 1rem;

        h1{
            font-size: 1.6rem;
            font-weight: 600;

            color: var(--brand-color);

            margin: 0.5rem 0;
        }

        .info{
            display: flex;
            flex-direction: column;

            >*{
                margin: 0.4rem 0;
            }

            small{
                color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : '#333333'};
                font-size: 1.1rem;
                font-weight: 400;
            }
            span{
                color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#333333'};
                font-size: 1.2rem;
                font-weight: 400;
            }
        }

        ul{
            margin: 1rem 0;

            li{
                font-size: 1.3rem;
                font-weight: 600;
                color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#888888'};

                margin: 0.5rem 0;

                span{
                    color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : '#555555'};
                }
            }

        }

        
    }

    :hover{
        transition: all ease-in-out 100ms;
        box-shadow: 0px 0px 8px 3px #bfbfbf;
    }



`