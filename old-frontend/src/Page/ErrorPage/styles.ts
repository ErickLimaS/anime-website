import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    flex-direction: row;

    .error{

        width: 100%;
        height: auto;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        @media(max-width: 768px){
            margin: 20% 0;
        }

        border-left: 2px solid #e6e6e6;

        @media(max-width: 768px){
            border-left: 0;
        }

        .error-message{

            width: 80%;
            height: 50%;

            @media(max-width: 768px){
                height: auto;
            }

            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;

            @media(max-width: 680px){
                justify-content: center;
                flex-direction: column-reverse;
            }

            border: 2px solid #c9c9c9;
            border-radius: 4px;

            >div{

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                padding: 1rem;

                >*{
                    margin: 2rem 0;
                }

                h1{
                    color: #222222;
                    font-size: 4rem;
                    font-weight: 600;

                    span{
                        color: #f92f7f;
                    }
                }

                p{
                    font-size: 2rem;
                    font-weight: 400;
                }

                a{
                    padding: 1.5rem 1rem;

                    background-color: #f92f7f;

                    border-radius: 4px;

                    font-size: 1.8rem;
                    font-weight: 500;
                    color: #e8e8e8;

                    :hover{
                        transition: all ease-in-out 250ms;
                        transform: scale(1.05);
                    }

                }

            }

            img{
                width: 35%;
                max-height: 100%;

                @media(max-width: 680px){
                    width: 50%;

                    margin: 10% 0 5% 0;
                }
            }

        }

    }

`