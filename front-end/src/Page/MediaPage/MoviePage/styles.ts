import styled from "styled-components";


interface Props {
    loading: boolean;
}

export const Container = styled.div<Props>`

    display: flex;
    flex-direction: row;

    .main{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        width: 100%;

        @media(max-width: 1080px){
            flex-wrap: wrap;
            /* width: 80%; */
        }

        @media(max-width: 620px){
            flex-wrap: wrap;
            width: 90%;
        }
    }


    @media(max-width: 1080px){
        /* flex-wrap: wrap; */
    }

    @media(max-width: 620px){
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    /* width: 100%; */

    /* background-color: #fafafa; */

    div.skeleton{
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: 80vw;
        height: 100vh;
        padding: 0 2rem;

        border-left: 2px solid #e6e6e6;

        @media(max-width: 620px){        
            border-left: 0;
        }

        div:first-child{
            
            display: flex;
            flex-direction: column;

            span.skeleton{
                display: ${props => props.loading === true ? 'block' : 'none'};

                :first-child{
                    width: 40vw;
                    height: 20vh;

                    @media(max-width: 1310px){
                        width: 50vw;
                        height: 20vh;
                    }
                }

                border-radius: 4px;

                width: 55vw;
                height: 50vh;
                
                @media(max-width: 1310px){
                    width: 75vw;
                    height: 50vh;
                }
                @media(max-width: 620px){
                    width: 80vw;
                    height: 50vh;
                }

                margin: 1rem 0;

                animation: loading 1s linear infinite alternate;

                @keyframes loading{

                    0%{

                        background-color: #c0c0c0;
                    }
                    100%{
                        background-color: #999999;
                    }

                }
            }
        }

        div:last-child{
            
            display: flex;
            flex-direction: column;

            @media(max-width: 1310px){
                display: none;
            }

            span.skeleton{
                display: ${props => props.loading === true ? 'block' : 'none'};

                border-radius: 4px;

                width: 20vw;
                height: 60vh;

                margin: 1rem 0;

                animation: loading 1s linear infinite alternate;

                @keyframes loading{

                    0%{

                        background-color: #c0c0c0;
                    }
                    100%{
                        background-color: #999999;
                    }

                }
            }
        }
        
    }

    /* >div:last-child{
        width: 10vh;
    } */


`