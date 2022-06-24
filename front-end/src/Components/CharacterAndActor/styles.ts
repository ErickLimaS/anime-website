import styled from "styled-components";


export const Container = styled.div`

    width: 80%;
    height: 100%;

    display: flex;
    flex-direction: column;
    margin: 1rem 0;

    @media(max-width: 620px){
        width: 95%;
    }

    .imgs{
            
        background-image: linear-gradient(to right, #fff, pink, #fff);
    }

    >div{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .img-character, .img-actor{

            img{
                height: 140px;
                width: auto;
                
                display: flex;
                justify-content: center;
                align-items: center;

                border-radius: 4px;

                @media(max-width: 420px){
                    height: 100px;
                }
            }
        }

        .img-character{
            
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            img{
            }
            h2{
                
                margin-left: 1rem;
            }

        }

        div.span{
            width: 20%;
            
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            *{
                width: min-content;
            }
        }

        .img-actor{

            display: flex;
            flex-direction: row-reverse;
            justify-content: center;
            align-items: center;

            img{
            }
            h2{
                margin-right: 1rem;

            }

        }

        .actor, .character{

            width: 15%;

            margin: 0.5rem 0;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            h2{
                font-size: 1.6rem;
                font-weight: 600;
            }

            p{
                font-size: 1.4rem;
                font-weight: 400;

            }
        }

    }

`