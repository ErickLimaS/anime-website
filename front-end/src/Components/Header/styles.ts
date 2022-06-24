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
    align-items: flex-start;
    flex-wrap: wrap;

    @media(max-width: 620px){
        display: flex;
    }
    
    padding: 0 1rem;

    font-size: 2.2rem;

    *{
        color: #333333;
    }

    div.logo{
        
        font-size: 2.6rem;

    }

    div.search-header{

        display: none;

        @media(max-width: 1080px) and (min-width: 620px){
            display: block;
        }

    }

    div.nav-links{

        height: 100%;

        display: none;

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
                fill: ${props => props.display === true ? '#fff' : '#666666'};
            }

        }

        nav{

            z-index: 1000;

            padding: 2rem 0;

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

                *{
                    width: 100%;
                }
                

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

            h3{
                display: flex;
                justify-content: center;
                color: #ff1a75;
            }
            ul{
                /* padding-left: 1rem; */

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

                li{
            margin: 1rem 0;

            >a{
                display: flex;
                align-items: center;

                width: 100%;

                font-weight: 600;
                color: #757474; 

                >svg{
                    padding-left: 1rem;
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
            }

        }

    }


`