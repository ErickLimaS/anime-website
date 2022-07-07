import styled from "styled-components";

export const Container = styled.footer`

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 1.8rem;

    background-color: #f92f7f;

    div.footer-info{
        width: 80%;
        margin: 2rem;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;

        @media(max-width: 780px){
            width: 100%;

        }
        
    }

    .miscellaneous{

        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        flex-wrap: wrap;

        >div{
            display: flex;
            flex-direction: column;

            margin: 0 2rem;

            @media(max-width: 780px){
                
                margin: 2rem 1rem;

            }
        }

        h1{

            color: #fff;
            font-size: 1.3rem;
            font-weight: 600;

        }

        ul{

            li{
                height: 2rem;
                margin: 0.1rem 0;

                a{
                    color: #fafafa;
                    font-size: 1.2rem;

                    :hover{
                        text-decoration: underline;
                    }
                }
            }

        }
    }

    .project-info{
        h1{

            color: #fff;
            font-size: 1.3rem;
            font-weight: 600;

        }

        ul{

            li{
                height: 2rem;
                margin: 0.1rem 0;

                a{
                    color: #fafafa;
                    font-size: 1.2rem;

                    :hover{
                        text-decoration: underline;
                    }
                }
            }

        }
    }

    small {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        white-space: pre;
        color: #fff;

        > a{
            color: #fff;
            text-decoration: underline;

            :hover{
                color: #999999;
            }
        }
    }
`