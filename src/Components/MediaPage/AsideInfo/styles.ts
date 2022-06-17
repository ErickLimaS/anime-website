import styled from "styled-components";

interface Props {
    data: any;
}

export const Container = styled.div<Props>`



padding: 0 2rem;

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

        h1{
            width: 60%;
            font-size: 1.6rem;
        }
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

    ul{

        li{
            font-size: 1.5rem;
            font-weight: 400;
            margin: 1rem 0;

            a{
                color: inherit;
                text-decoration: underline;
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

            li:after{
                content: ', ';
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