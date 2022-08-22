import styled from "styled-components";

interface Props{
    darkMode: boolean
}

export const Container = styled.div<Props>`


            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            svg{
                height: 22px;
                width: auto;

                margin: 0 0.5rem;

                fill: #ff9130;
            }

            small{
                font-size: 1rem;
                color: ${props => props.darkMode ? 'var(--text-grey-variant3)' : 'var(--text-grey-variant)'};
            }



`