import styled from "styled-components";

interface Props {
    data: any
}

export const Container = styled.nav<Props>`

    
        position: sticky;
        top: 0;
        
        height: max-content;
        width: 25vh;

        @media(max-width: 1080px){
            width: 20%;
            padding-left: 2rem;
        }

        @media(max-width: 620px){
            display: none;
        }

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        font-size: 1.4rem;

        padding-left: 4rem;

        h3{
            margin: 1rem 0;
            
            color: #999999;
            font-weight: 600;
        }

        li{
            margin: 1rem 0;

            >a{
                display: flex;
                align-items: center;

                width: 100%;

                font-weight: 600;
                color: #757474;

                >svg{
                    height: 2.4rem;
                    width: min-content;

                    margin-right: 1rem;

                    fill: #757474;
                }
            }

            :hover{
                border-right: 4px solid #ff1a75;

                >a{
                    color: #ff1a75;

                    >svg{
                        fill: #ff1a75;
                    }
                }
                
            }
        }

        .settings li:last-child{
                
            :hover{
                border-right: 4px solid #e62517;

                >a{
                    color: #e62517;

                    >svg{
                        fill: #e62517;
                    }
                }
            }
        }

`