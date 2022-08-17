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

        position: sticky;
        top: 0;
        
        height: max-content;
        width: 25vh;
        
        background-color: ${props => props.darkMode ? 'var(--bcg-dark-mode)' : 'var(--bcg-light-mode)'};    

        @media(max-width: 1080px){
            
            position: initial;

            width: 20%;
            padding-left: 2rem;
        }

        @media(max-width: 768px){
            display: none;
        }

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        font-size: 1.4rem;

        padding-left: 4rem;
        margin-bottom: 3rem;

        img#logo{
            margin: 1rem 0;

            position: relative;
            left: -10%;
            width: 25vh;
            height: auto;

            border: 1px solid transparent;
            border-radius: 4px;

            @media(max-width: 1080px){
                width: 20vw;
            }

            :hover{
                border: 1px solid #ff1a75;
            }
        }

        .search{
            display: none;

            @media(max-width: 1080px){
                display: flex;
                flex-direction: column;
                align-items: flex-start
            }

            >svg{
                width: 20%;
            }
            input{
                width: 70%;
            }
        }

        .settings{

            
            li.dark-theme{

                display: flex;
                flex-direction: row;
                align-items: center;

                padding: 1rem;

                color: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'initial'};

                svg{
                    margin-right: 1rem;
                    height: 2.4rem;
                    width: auto;
                    fill: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'initial'};
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
                            fill: ${props => props.showUserList ? '#ff1a75' : '#757474'};
                            width: 55%;
                            height: inherit;

                            :hover{
                                fill: #ff1a75 ;
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

                    color: #333333;
                }

                :hover{

                    border-right: 4px solid var(--brand-light-mode-color);

                }
            }

            .user-list-on-click{
                display: ${props => props.showUserList ? 'flex' : 'none'};
                flex-direction: column;

                position: relative;
                left: -10rem;

                background-color: var(--bcg-light-mode);

                border-radius: 4px;

                >*{
                    margin-left: 1rem;
                    a, svg{
                        fill: #757474;
                        color: #757474;
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
                            fill: #ff1a75;
                        }
                        a{
                            color: #ff1a75;
                        }
                    }
                }
            }

        }

        h3{
            margin: 1rem 0;
            
            color: #999999;
            font-weight: 600;
        }

        li#bookmarks{
            border-right: ${props => props.pathname === 'bookmarks' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.pathname === 'bookmarks' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.pathname === 'bookmarks' ? '#ff1a75' : ''};
                }
            }
        }
        li#history{
            border-right: ${props => props.pathname === 'history' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.pathname === 'history' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.pathname === 'history' ? '#ff1a75' : ''};
                }
            }
        }
        li#settings{
            border-right: ${props => props.pathname === 'settings' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.pathname === 'settings' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.pathname === 'settings' ? '#ff1a75' : ''};
                }
            }
        }
        li#shounen{
            border-right: ${props => props.genre === 'Shounen' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.genre === 'Shounen' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.genre === 'Shounen' ? '#ff1a75' : ''};
                }
            }
        }
        li#shoujo{
            border-right: ${props => props.genre === 'Shoujo' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.genre === 'Shoujo' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.genre === 'Shoujo' ? '#ff1a75' : ''};
                }
            }
        }
        li#seinen{
            border-right: ${props => props.genre === 'seinen' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.genre === 'Seinen' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.genre === 'Seinen' ? '#ff1a75' : ''};
                }
            }
        }
        li#superpower{
            border-right: ${props => props.genre === 'Super Power' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.genre === 'Super Power' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.genre === 'Super Power' ? '#ff1a75' : ''};
                }
            }
        }
        li#school{
            border-right: ${props => props.genre === 'School' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.genre === 'School' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.genre === 'School' ? '#ff1a75' : ''};
                }
            }
        }
        li#tv{
            border-right: ${props => props.format === 'tv' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'tv' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'tv' ? '#ff1a75' : ''};
                }
            }
        }
        li#manga{
            border-right: ${props => props.format === 'manga' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'manga' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'manga' ? '#ff1a75' : ''};
                }
            }
        }
        li#one_shot{
            border-right: ${props => props.format === 'one_shot' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'one_shot' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'one_shot' ? '#ff1a75' : ''};
                }
            }
        }
        li#novel{
            border-right: ${props => props.format === 'novel' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'novel' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'novel' ? '#ff1a75' : ''};
                }
            }
        } 
        li#movie{
            border-right: ${props => props.format === 'movie' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'movie' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'movie' ? '#ff1a75' : ''};
                }
            }
        }
        li#special{
            border-right: ${props => props.format === 'special' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'special' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'special' ? '#ff1a75' : ''};
                }
            }
        }
        li#ova{
            border-right: ${props => props.format === 'ova' ? '4px solid #ff1a75' : ''};

            >a{
                color: ${props => props.format === 'ova' ? '#ff1a75' : ''};

                >svg{
                    fill: ${props => props.format === 'ova' ? '#ff1a75' : ''};
                }
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
                    height: 2.4rem;
                    width: 2.4rem;

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

`