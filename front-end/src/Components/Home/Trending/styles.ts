import styled from 'styled-components'

interface itemData {
    info: any;
    darkMode: boolean
}

export const AnimeToBeListed = styled.div<itemData>`

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    display: flex;
    flex-direction: row;
    align-items: center;
    
    border-radius: 2px;

    div.cover{
        
        img{
            height: 11rem;
            width:  8rem;

            border: 2px solid transparent;
        }
    }

    .info{
        margin: 0 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        a{
            color:${props => props.darkMode ? 'var(--text-grey-variant2)' : '#333333'};

            :hover{
                transition: all ease-in-out 100ms;
                color: var(--pink-variant-1);
            }
        }

        h2{
            margin: 0.5rem 0;

            font-size: 1.3em;
            font-weight: 600;
        }

        div.genre{

            margin: 0.5rem 0;

            ul{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                
                li{
                    font-size: 1.1rem;
                    color: var(--text-grey-variant);
                }

                li::after{
                    content: ', ';
                    white-space: pre;
                }
                li:last-child::after{
                    content: '';
                }

            }
        }

        div.score{
            margin: 0.5rem 0;
        }

    }

    //description of item on hover
    div.description-hover{
        display: none!important;
    }

    :hover{
        
        @media(max-width: 768px){

            animation: opacity forwards 450ms;

            @keyframes opacity {
                0%{
                    opacity: 0;
                }
                100%{
                    opacity: 1;
                }
            }

        }

        .cover{

            img{
                border: 2px solid var(--pink-variant-1);
            }


        }

        div.description-hover{
            span{
           
                content: ' ';

            }

            display: flex!important;
            align-items: center;
            justify-content: center;
            
            position: absolute!important;

            right: 34rem;

            width: 24%;

            @media(max-width: 768px){
                
                right: initial;

                width: initial;
            }

            padding: 1rem;

            background-color: #333333!important;
            border-radius: 2px;

            p{
                font-size: 1.4rem;
                font-weight: 600;

                color: #b0b0b0;
            }

            a{
                color: #fff;
                text-decoration: underline;
            }
        }

    }

`
