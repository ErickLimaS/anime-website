import styled from "styled-components";

interface Props{
    darkMode: boolean
}

export const Container = styled.div<Props>`

    width: 80%;
    height: 100%;

    display: flex;
    flex-direction: column;
    margin: 1rem 0;

    @media(max-width: 620px){
        width: 95%;
    }

    div.char-actor{
        background-image: ${props => props.darkMode ? 'linear-gradient(to right, #181818 10%, #2c1e24 50%, #181818 90%)' : 'linear-gradient(to right, #fff 10%, #ff5ebc33 50%, #fff 90%)'};
    }

    >div{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .img-character, .img-actor{
            width: 50%;

            img{
                height: auto;
                width: 35%;
                
                display: flex;
                justify-content: center;
                align-items: center;

                border-radius: 4px;

                @media(max-width: 420px){
                    height: 100px;
                }
            }

            .names{
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                *{
                    margin: 1rem;
                }

                h2{
                    color: ${props => props.darkMode ? 'var(--text-grey-variant2)':'#222222'};
                    font-size: 1.6rem;
                    font-weight: 600;
                }
                h2:last-child{
                    color: ${props => props.darkMode ? 'var(--text-grey-variant2)':'#666666'};
                    font-size: 1.4rem;
                    font-weight: 400;
                }

                @media(max-width: 620px){
                    h2:first-child{
                        width: fit-content;
                    }
                    h2{
                        color: #222222;
                        font-size: 1.4rem;
                        font-weight: 600;
                    }
                    h2:last-child{
                        color: #666666;
                        font-size: 1.2rem;
                        font-weight: 400;
                    }
                }
                
            }
        }

        .img-character{
            
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;


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
            justify-content: flex-start;
            align-items: center;

            .names{
                display: flex;
                flex-direction: column;
                align-items: flex-end;
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