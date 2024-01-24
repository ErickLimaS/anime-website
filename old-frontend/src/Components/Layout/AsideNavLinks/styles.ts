import styled from "styled-components";

interface Props {
    data: any;
    format: any;
    genre: any;
    showUserList: any;
    pathname: string;
    darkMode: boolean
}

export const Container = styled.nav<Props>`

        height: 120vh;

        position: sticky;
        top: 0;
        left: 0;
        
        min-width: 15vw;
        max-width: 20vw;

        border-right: 2px solid #e6e6e6; 
        
        background-color: ${props => props.darkMode ? 'var(--bcg-dark-mode)' : 'var(--bcg-light-mode)'};    

        @media(max-width: 768px){
            display: none;
        }

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        font-size: 1.4rem;

        >*{
            
            margin-left: 4rem!important;

            
            @media(max-width: 1080px){

                margin-left: 2rem!important;

            }

        }

        a.anchor-logo{
            
            margin-left: 0rem!important;

            display: inline-flex;
            justify-content: center;

            img#logo{
            
                max-width: 90%;

                margin: 1rem 0;

                position: relative;
                height: auto;

                border: 1px solid transparent;
                border-radius: 4px;

                /* @media(max-width: 1080px){
                    width: 20vw;
                } */

                :hover{
                    border: 1px solid var(--brand-color);
                }
            }
            
        }

        .search{
            display: none;

            /* @media(max-width: 1080px){
                display: flex;
                flex-direction: column;
                align-items: flex-start
            }

            >svg{
                width: 20%;
            }
            input{
                width: 40%;
            } */
        }

        .settings{
            
            button.dark-theme{
                cursor: pointer;

                width: 100%;

                display: flex;
                flex-direction: row;
                align-items: center;

                padding: 1rem;

                background-color: rgba(0,0,0,.05);

                border: 0;
                border-radius: 2px 0 0 2px;

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

            div.user{
                width: inherit;

                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                border: 2px solid transparent;

                border-radius: 2px;
                
                border-right: 4px solid transparent;

                >div{

                    width: inherit;
                    height: inherit;

                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    button {
                        cursor: pointer;
                        width: 4rem;
                        height: inherit;
                        
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        background-color: transparent;
                        border: none;

                        svg{
                            fill: ${props => props.showUserList ? 'var(--brand-color)' : 'var(--text-grey-variant3)'};
                            width: 55%;
                            height: inherit;

                            :hover{
                                fill: var(--brand-color) ;
                            }

                            transition: all ease 300ms;
                            transform: ${props => props.showUserList ? 'rotate(180deg)' : ''};
                        }
                    }
                }

                img{
                    width: 3.5rem;        
                    height: 3.5rem;

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    border: 1px solid transparent;
                    border-radius: 50%;
                }

                h2{
                    font-size: 1.8rem;
                    font-weight: 600;

                    color: ${props => props.darkMode === true ? 'var(--text-grey-variant2)' : `#333333`};
                    
                }

                :hover{

                    border-right: 4px solid var(--brand-color);

                }
            }

            .user-list-on-click{
                display: ${props => props.showUserList ? 'flex' : 'none'};
                flex-direction: column;

                position: relative;
                left: -10rem;

                background-color: ${props => props.darkMode === true ? 'var(--bcg-dark-mode)' : `var(--bcg-light-mode)`};

                border-radius: 4px;

                >*{

                    margin-left: 1rem;

                    a, svg{
                        fill: ${props => props.darkMode === true ? 'var(--text-grey-variant)' : 'var(--text-grey-variant3)'};
                        color: ${props => props.darkMode === true ? 'var(--text-grey-variant)' : 'var(--text-grey-variant3)'};
                    }

                }

                animation: opacity-change ${props => props.showUserList ? 'forwards' : 'backwards'} 400ms;

                @keyframes opacity-change {
                    0%{
                        left: -10rem;
                        opacity: 0;
                    }
                    100%{
                        left: 0rem;
                        opacity: 1;
                    }
                }

                li{
                    
                    :hover{
                        svg{
                            fill: var(--brand-color);
                        }
                        a{
                            color: var(--brand-color);
                        }
                    }
                }
            }

        }

        h3{
            margin: 1rem 0;
            
            color: ${props => props.darkMode === true ? 'var(--text-grey-variant)' : '#999999'};
            font-weight: 600;
        }

        li#bookmarks{
            border-right: ${props => props.pathname === 'bookmarks' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.pathname === 'bookmarks' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.pathname === 'bookmarks' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#history{
            border-right: ${props => props.pathname === 'history' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.pathname === 'history' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.pathname === 'history' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#settings{
            border-right: ${props => props.pathname === 'settings' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.pathname === 'settings' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.pathname === 'settings' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#shounen{
            border-right: ${props => props.genre === 'Shounen' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.genre === 'Shounen' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.genre === 'Shounen' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#shoujo{
            border-right: ${props => props.genre === 'Shoujo' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.genre === 'Shoujo' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.genre === 'Shoujo' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#seinen{
            border-right: ${props => props.genre === 'seinen' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.genre === 'Seinen' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.genre === 'Seinen' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#superpower{
            border-right: ${props => props.genre === 'Super Power' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.genre === 'Super Power' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.genre === 'Super Power' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#school{
            border-right: ${props => props.genre === 'School' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.genre === 'School' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.genre === 'School' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#tv{
            border-right: ${props => props.format === 'tv' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'tv' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'tv' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#manga{
            border-right: ${props => props.format === 'manga' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'manga' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'manga' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#one_shot{
            border-right: ${props => props.format === 'one_shot' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'one_shot' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'one_shot' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#novel{
            border-right: ${props => props.format === 'novel' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'novel' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'novel' ? 'var(--brand-color)' : ''};
                }
            }
        } 
        li#movie{
            border-right: ${props => props.format === 'movie' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'movie' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'movie' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#special{
            border-right: ${props => props.format === 'special' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'special' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'special' ? 'var(--brand-color)' : ''};
                }
            }
        }
        li#ova{
            border-right: ${props => props.format === 'ova' ? '4px solid var(--brand-color)' : ''};

            >a{
                color: ${props => props.format === 'ova' ? 'var(--brand-color)' : ''};

                >svg{
                    fill: ${props => props.format === 'ova' ? 'var(--brand-color)' : ''};
                }
            }
        }

        li, button.dark-theme{
            margin: 1rem 0;

            >a{
                display: flex;
                align-items: center;

                width: 100%;

                font-weight: 600;
                color: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'var(--text-grey-variant3)'};

                >svg{
                    height: 2.4rem;
                    width: 2.4rem;

                    margin-right: 1rem;

                    fill: var(--text-grey-variant3);
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

`