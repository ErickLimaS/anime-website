import styled from "styled-components";

interface ContainerProps {
    display?: boolean;
}

export const Container = styled.header<ContainerProps>`

    height: 9vh;

    background-color: #fafafa;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    
    padding: 0 1rem;

    font-size: 2.2rem;

    *{
        color: #333333;
    }

    div.logo{
        
        font-size: 2.6rem;

    }

    div.nav-links{

        height: 100%;

        @media(max-width: 620px){
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            button{
                display: flex!important;
            }

        }

        button{ 

            display: none;

            border: 0;

            background-color: ${props => props.display === true ? '#c0c0c0' : 'transparent'};
            
            padding: 0.5rem;

            border-radius: 4px;

            svg{
                width: 25px;
                height: auto;
            }

        }

        nav{

            @media(max-width: 620px){
                display: ${props => props.display === true ? 'flex' : 'none'};
                flex-direction: column;
                align-items: center;
                justify-content: center;

                background-color: #fafafa;
                
                height: auto!important;
                width: 100%;

                position: absolute;
                top: 9vh;
                right: 0;
                

                a{
                    margin: 1rem 0!important;
                    height: auto!important;
                }
            }

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            
            height: 100%;

            a{
                display: flex;
                flex-direction: row;
                align-items: center;

                height: 100%;
                margin: 0 1rem;

                :hover{
                    color: #999999;
                }
            }

        }

    }


`