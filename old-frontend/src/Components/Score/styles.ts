import styled from "styled-components";

interface Props{
    darkMode: boolean
}

export const Container = styled.div<Props>`


            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

            span{

                display: flex;

            }

            svg{
                height: 22px;
                width: auto;

                margin: 0 0.5rem;

                fill: #ff9130;

                @media(max-width: 1024px){

                    height: 14px;

                }

                @media(max-width: 620px){

                    height: 22px;

                }

                @media(max-width: 375px){

                    height: 18px;

                }
            }

            small{
                font-size: 1rem;
                color: ${props => props.darkMode ? 'var(--text-grey-variant3)' : 'var(--text-grey-variant)'};
            }



`