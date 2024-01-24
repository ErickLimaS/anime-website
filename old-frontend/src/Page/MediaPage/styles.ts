import styled from "styled-components";

interface Props {
    loading: boolean;
}

export const Container = styled.div<Props>`

    .main{

        width: 100%;
        justify-content: flex-start;

        display: grid;
        grid-template-columns: 70% 30%;
        gap: 0 1rem;

        @media(max-width: 1180px){
            grid-template-columns: 100%;
        }

        @media(max-width: 1080px){
            flex-wrap: wrap;
        }


        @media(max-width: 620px){
            
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }

    div.skeleton{

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        height: 100vh;

        margin: 0 20px;

        span.skeleton{
                display: ${props => props.loading === true ? 'block' : 'none'};

                margin: 1rem 0;

                align-self: center;

                width: 100%;
                height: 50vh;

                border-radius: 4px;

                :first-child{
                    width: 40vw;
                    height: 40vh;

                    align-self: flex-start;

                    @media(max-width: 1310px){
                        width: 50vw;
                        height: 40vh;
                    }
                }

                @media(max-width: 1310px){
                    height: 50vh;
                }

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


`