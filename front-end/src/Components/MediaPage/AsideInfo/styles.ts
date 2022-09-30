import styled from "styled-components";

interface Props {
    data: any;
    darkMode: boolean;
}

export const Container = styled.div<Props>`

    padding: 2rem 0;
    
    border-left: 2px solid #e6e6e6;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    @media(max-width: 1180px){

        border-left: 0;
    
    }

    @media(max-width: 1080px){

        border-left: 0;
        width: 100%;

    }

    @media(min-width: 1020px){
        

        .search-desktop{
                width: 90%;
            input#search-input{
                width: 60%;
            }
        }
        .info-aside{
            
            width: 90%;

        }
    }

    @media(max-width: 1020px){

        .info-aside{
            
            width: 90%;

        }
    }

    @media(max-width: 768px){
        margin: 0rem;
    }

    .search-desktop{
        
        @media(max-width: 1080px){
            display: none;
        }
    }

    div.skeleton{
        height: 40vh;

        animation: skeleton-loading 1s linear infinite alternate;

        @keyframes skeleton-loading{
            0%{
                background-color: #c0c0c0;
            }
            100%{
                background-color: #999999;
            }
        }
    }

    .info-aside{

        @media(max-width: 1020px){
            
            width: 90%;

        }

        .info-heading{

            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;

            margin: 2rem 0;

            >*{
                margin: 0 1rem;
            }

            h1{
                width: 60%;

                color: ${props => props.darkMode && 'var(--text-grey-variant)'};
                font-size: 1.6rem;
            }
        }

        .title-score{
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .type{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin: 2rem 0;

            h2{
                font-size: 1.6rem;
                font-weight: 900;
                color: var(--pink-variant-1);
                border-bottom: 2px solid var(--pink-variant-1);
            }
        }

        ul.general-info{

            li{
                color: ${props => props.darkMode && 'var(--text-grey-variant)'};
                font-size: 1.5rem;
                font-weight: 400;
                margin: 1rem 0;

                border-bottom: 1px solid #c0c0c0;
                
                span{
                    font-weight: 600;

                }
                
                svg{
                    fill: ${props => props.darkMode && 'var(--text-grey-variant2)'};
                    margin-right: 0.5rem;

                }

                a{
                    color: inherit;
                    text-decoration: underline;

                    :after{
                    content: ', ';
                    white-space: pre;
                    }   

                    :last-child:after{
                        content: '';
                    } 
                }
            }
        }

        .trailer{
            display: flex;
            
            flex-direction: column;
            justify-content: center;
            align-items: center;
            
            margin: 2rem 0;

            h2{
                font-size: 1.6rem;
                font-weight: 900;
                color: var(--pink-variant-1);
                border-bottom: 2px solid var(--pink-variant-1);
                
                margin: 1rem 0;
            }

            iframe{
                border: 0;
            }

            a{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                
                img{
                    width: 90%;
                }
            }
        }

        .genres{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin: 2rem 0;
            
            h2{
                font-size: 1.6rem;
                font-weight: 900;
                color: var(--pink-variant-1);
                border-bottom: 2px solid var(--pink-variant-1);
                
                margin: 1rem 0;
            }

            ul{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;

                li{
                    color: ${props => props.darkMode && 'var(--text-grey-variant)'};
                    font-size: 1.5rem;
                    font-weight: 400;
                    margin: 1rem 0;

                    a{
                        color: inherit;
                        text-decoration: underline;
                    }
                }

                li:after{
                    content: ', ';
                    white-space: pre;
                }

                li:last-child:after{
                    content: '';
                }
            }
        }

        .characters{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin: 2rem 0;
            
            h2{
                font-size: 1.6rem;
                font-weight: 900;
                color: var(--pink-variant-1);
                border-bottom: 2px solid var(--pink-variant-1);
                
                margin: 1rem 0;
            }

            ul{
                width: 100%;

                display: grid;
                grid-template-columns: auto auto auto;
                justify-items: center;
                gap: 1rem;

                @media(max-width: 1080px){
                    justify-items: center;
                }

                li{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    width: min-content;
                    height: min-content;

                    margin: 0 0.1rem;

                    .img{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: stretch;

                        border-radius: 1000px;

                        overflow: hidden;

                        height: 80px;
                        width: 80px;

                        @media(max-width: 1180px){
                            height: 100px;
                            width: 100px;
                        }

                        @media(max-width: 425px){
                            height: 80px;
                            width: 80px;
                        }

                    }

                    h3{
                        color: ${props => props.darkMode && 'var(--text-grey-variant)'};
                        font-size: 1.4rem;
                        font-weight: 400;
                    }
                }
            }
        }
    }

`