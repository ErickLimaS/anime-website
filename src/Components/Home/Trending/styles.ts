import styled from 'styled-components'

interface itemData {
    info: any
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
            height: auto;
            width: 8rem;
        }
    }

    .info{
        margin: 0 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        a{
            color: #333333;

            :hover{
                transition: all ease-in-out 100ms;
                color: #ff1a75;
            }
        }

        h3{
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
                    color: #b0b0b0;
                }

                li::after{
                    content: ', ';
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

`