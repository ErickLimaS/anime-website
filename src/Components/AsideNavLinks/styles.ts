import styled from "styled-components";

export const Container = styled.nav`

    
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

            :hover{
                border-right: 4px solid #ff1a75;

                >a{
                    
                    color: #ff1a75;
                }
            }

            >a{
                display: flex;
                

                width: 100%;

                font-weight: 600;
                color: #757474; 
            }

        }
        




`