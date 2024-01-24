import styled from "styled-components";

interface ContainerProps {
    display?: boolean;
    darkMode: boolean;
}

export const Container = styled.header<ContainerProps>`

    height: 9vh;
    width: auto;

    position: ${props => props.display === true ? 'sticky' : 'initial'};
    top: ${props => props.display === true ? '0' : 'initial'};

    background-color: ${props => props.darkMode ? 'var(--bcg-dark-mode)' : 'var(--bcg-light-mode)'};

    z-index: 10000;

    display: none;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    @media(max-width: 768px){
        display: flex;
        align-items: center;
    }
    
    padding: 0 1rem;

    font-size: 2.2rem;

    *{
        color: #333333;
    }

    div.logo{
        display: flex;
        justify-content: center;
        align-items: center;

        a{
            display: flex;
            justify-content: center;
            align-items: center;
                img{
                    width: 30vw;
                }
        }

    }

    div.search-header{

        display: none;


    }

    div.nav-links{

        height: 100%;

        display: none;

        @media(max-width: 768px){
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            button{
                display: flex!important;
            }

            .settings{

                button.dark-theme{

                    width: 100%;

                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    padding: 1rem;

                    background-color: rgba(0,0,0,.05);

                    border: 0;
                    border-radius: 2px 0 0 2px;

                    font-size: 1.8rem;
                    color: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'initial'};

                    svg{
                        margin-right: 1rem;
                        height: 2.4rem;
                        width: auto;
                        fill: ${props => props.darkMode ? '#FDB813' : '#C4C3BE'};

                    }

                    :hover{
                        transition: all ease-in-out 150ms;
                        background-color: rgba(0,0,0,.15);

                        svg{
                            fill: ${props => props.darkMode === false && '#F5F3CE'};
                        }
                    }
                }

                li.user-li:hover{
                    border-right: 0;
                }

                a{
                    width: auto;
                }

                li, button{
                    width: auto;
                    padding-left: 1rem;
                }

                div.user{

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    width: 98%;

                    padding: 0.5rem 0;

                    border-bottom: 2px solid #c0c0c0;

                    >div{

                        display: flex!important;
                        justify-content: flex-start!important;
                        align-items: center!important;

                        a {
                            
                            display: flex!important;
                            justify-content: center!important;
                            align-items: center!important;

                            svg{
                                cursor: pointer!important;

                                fill: #757474!important;
                                width: 40%!important;

                                :hover{
                                    fill: #ff1a75!important;
                                }
                            }
                        }
                    }

                    div{
                        width: min-content;
                    }
                    img{
                        width: 5rem;
                        height: 5rem;

                        margin-right: 1rem;
                        
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;

                        border: 2px solid transparent;
                        border-radius: 50%;
                    }

                    h2{
                        font-size: 2.4rem;
                        font-weight: 400;

                        color: ${props => props.darkMode ? 'var(--white)' : '#333333'};
                    }

                }
            }

        }

        button{ 

            transition: all ease-in-out 300ms;

            display: none;

            border: 0;

            background-color: ${props => props.display === true ? 'var(--brand-color)' : 'transparent'};
            
            padding: 0.5rem;

            border-radius: 4px;

            svg{
                transition: all ease-in-out 300ms;
                width: 25px;
                height: auto;
                fill: ${props => props.display === true ? '#fff' : 'var(--brand-color)'};
            }

        }

        nav{

            z-index: 1000;


            @media(max-width: 768px){
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                flex-wrap: nowrap;

                background-color: ${props => props.darkMode ? 'var(--bcg-dark-mode)' : 'var(--bcg-light-mode)'};
                
                height: 100%!important;
                width: 80%;

                overflow: auto;

                position: fixed;
                top: 9vh;
                left: 0;
                
                border-right: 2px solid pink;

                animation: drawer-animation 700ms;
                animation-fill-mode: ${props => props.display === true && 'forwards'};
                animation-fill-mode: ${props => props.display === false && 'backwards'};

                @keyframes drawer-animation{
                    0%{
                        left: -52rem;
                    }
                    100%{
                        left: 0;
                    }
                }

                display: ${props => props.display === false ? 'none!important' : 'initial'};

                >*{
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
                color: var(--brand-color);
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

                li, button.dark-theme{
                    margin: 2rem 0;

                    >a{
                        display: flex;
                        align-items: center;

                        width: 100%;

                        font-weight: 600;
                        color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#757474'}; 

                        >svg{
                            padding-left: 1rem;
                            height: 2.4rem;
                            width: min-content;

                            margin-right: 1rem;

                            fill: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#757474'}; 
                        }
                    }

                    :hover{
                        border-right: 4px solid var(--brand-color);

                        >a{
                            color: var(--brand-color);

                            >svg{
                                fill: var(--brand-color);
                            }
                        }
                        
                    }
                }

        
        .settings{

            button.dark-theme{
                border: 2px solid black;
            }

            li.user-li:hover{
                border-right: 0;
            }

            div.user{

                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;

                padding: 0.5rem 0;

                border-bottom: 2px solid #c0c0c0;

                img{
                    width: auto;
                    height: 4rem!important;

                    
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    border: 2px solid transparent;
                    border-radius: 50%;
                }

                h2{
                    font-size: 1.6rem;
                    font-weight: 400;

                    color: #333333;
                }

                :hover{

                    img{
                        border: 2px solid var(--brand-color);
                    }

                }
            }
            li:last-child{
                    
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

    }


`