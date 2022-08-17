import styled from "styled-components";

interface Props {
    darkMode: boolean
}

export const Container = styled.header<Props>`

    height: 9vh;
    width: auto;

    background-color: ${props => props.darkMode ? 'var(--bcg-dark-mode)' : 'var(--bcg-light-mode)'};

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    @media(max-width: 768px){
        display: none;
    }
    
    padding: 0 1rem;

    font-size: 2.2rem;

    *{
        color: #333333;
    }

    div.logo{
        height: inherit;

        display: flex;
        justify-content: center;
        align-items: center;

        a{
            height: inherit;

            display: flex;
            justify-content: center;
            align-items: center;

            img{
                height: inherit;
                width: 100%;

                transition: all ease-in-out 100ms;

                :hover{
                    transform: scale(0.9);
                }
            }
        }

        

    }

`