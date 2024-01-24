import styled from "styled-components";

interface Props {
    darkMode: boolean
}

export const Container = styled.div<Props>`

background-color: ${props => props.darkMode ? 'var(--black-variant)' : '#ff5297'};

    height: 91vh;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0 4rem;

    @media(max-width: 952px){

        height: auto;

        flex-wrap: wrap;

        div.text{

            h1{
                font-size: 4rem;
            }
        }
        
        form{

            margin: 2rem 0;

        }

    }

    @media(max-width: 851px){

        height: auto;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;

        padding: 3rem 0;

        div.text{

            margin: 2rem 0;

            width: 80%;

            h1{
                font-size: 3.6rem;
            }
        }

        form{
            
            width: 60%!important;

            padding: 3rem 2rem!important;
        }
        }

        @media(max-width: 560px){

            .text{
                ul{
                    display: none!important;
                }
            }

            form{
                
                width: 80%!important;

                padding: 4rem 2rem!important;
            }

        }

    .text{

        margin: 0 4rem;

        width: 40%;
        
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        h1{
            color: var(--white);
            font-size: 5.4rem;
            font-weight: 600;
        }

        ul{
            color: var(--white);

            margin-top: 2rem;
            margin-left: 2rem;

            font-size: 2.2rem;
            font-weight: 400;

            li{
                margin: 1rem 0;
            }

        }

    }

    form{

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 25%;

        padding: 1rem 4rem;

        background-color: #fafafa;

        border-radius: 4px;

        h1{
            margin: 1rem 0;

            color: #df085e;
            font-size: 2.4rem;

        }

        svg, #error{
            height: 1rem;
            width: auto;

            animation: opacity forwards 300ms;

             @keyframes opacity{
                0%{
                    opacity: 0;
                    min-height: 0;
                }
                100%{
                    min-height: 5rem;
                    opacity: 1;
                }
            }
        }

        >div{
            
            width: 100%;
            /* width: -webkit-fill-available; */

            margin: 0.5rem 0;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            label{

                color: #df085e;
                font-size: 2rem;

                margin: 0.4rem 0;

            }
            input{

                /* width: 100%; */
                width: -webkit-fill-available;

                font-size: 2rem;
                font-weight: 400;

                padding: 0.5rem;

                border: 1px solid #c0c0c0;
                border-radius: 2px;
            }

        }

        >div {

            button{
                cursor: pointer;
                
                padding: 1rem;

                margin: 2rem 1rem;

                width: -webkit-fill-available;

                color: #df085e;
                font-size: 1.8rem;
                font-weight: 400;

                background-color: #fafafa;
                
                border-radius: 4px;
                border: 2px solid #ff5297;

                :hover{

                    transition: all ease-in 150ms;
                    background-color: #ffd7e7;

                }
            }

        }

        div.login{

            display: flex;
            justify-content: center;
            align-items: center;

            a{
                color: #333333;
                font-size: 1.4rem;
                text-decoration: underline;

                :hover{
                    transition: all ease-in 150ms;
                    color: #777777;

                }
            }

        }
    }

`