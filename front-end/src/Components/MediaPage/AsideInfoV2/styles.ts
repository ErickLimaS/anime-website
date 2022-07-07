import styled from "styled-components";

interface Props {
    data: any;
}

export const Container = styled.div<Props>`

padding: 2rem 1.5rem;
width: min-content;

display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;

@media(max-width: 1020px){
    width: 100%;
}

@media(max-width: 1080px){
    padding: 0 1rem;

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
    /* width: 100%; */

    .info-heading{

        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;

        margin: 2rem 0;

        >*{
            margin: 0 1rem;
        }

        img{
            width: 12rem;
            height: 14rem;
        }

        h1{
            width: 60%;
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
            color: #ff5ebc;
            border-bottom: 2px solid #ff5ebc;
        }
    }

    ul.general-info{

        li{
            font-size: 1.5rem;
            font-weight: 400;
            margin: 1rem 0;

            border-bottom: 1px solid #c0c0c0;
            
            span{
                font-weight: 600;

            }

            svg{
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
            color: #ff5ebc;
            border-bottom: 2px solid #ff5ebc;
            
            margin: 1rem 0;
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
            color: #ff5ebc;
            border-bottom: 2px solid #ff5ebc;
            
            margin: 1rem 0;
        }

        ul{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;

            li{
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
            color: #ff5ebc;
            border-bottom: 2px solid #ff5ebc;
            
            margin: 1rem 0;
        }

        ul{
            width: 100%;

            display: grid;
            grid-template-columns: auto auto auto;
            gap: 1rem 0;

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

                .img{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    border-radius: 1000px;

                    height: 100px;
                    width: 100px;
                    
                    overflow: hidden;

                    @media(max-width: 620px){
                        height: 90px;
                        width: 90px;
                    }

                }

                h3{
                    font-size: 1.4rem;
                    font-weight: 400;
                }
            }
        }
    }
}

`