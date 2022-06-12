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
            height: 10rem;
            width: auto;
        }
    }

    .info{
        margin: 0 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        div.genre{
            ul{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                li::after{
                    content: ', ';
                }
                li:last-child::after{
                    content: '';
                }

            }
        }

        div.score{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            svg{
                height: 20px;
                width: auto;

                margin: 0 0.2rem;

                fill: #ff9130;
            }
        }
    }

`