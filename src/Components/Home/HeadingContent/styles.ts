import styled from 'styled-components'

interface itemData {
    headingContent: any
}

export const AnimeFromHeading = styled.div<itemData>`

    margin: 0.5rem 0;

    height: 300px;

    background-image: ${(props) => props.headingContent.bannerImage && `url("${props.headingContent.bannerImage}")`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    border-radius: 4px;

    .item-about{

        height: 100%;
        width: 60%;

        @media(max-width: 790px){
            width: auto;
            padding-left: 2rem;
        }

        padding-left: 3rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        background-image: linear-gradient(to right, #333333, transparent);
        border-radius: 4px;

        .item-info{

            width: 60%;

            margin: 2rem 0;

            @media(max-width: 390px){
                margin: 0;

                h1{
                    font-size: 2.4rem!important;
                }
            }

            a:hover{
                h1{
                    transition: all ease-in 200ms;
                    color:  #ff5095;
                }
            }

            h1{
                font-size: 2.6rem;
                font-weight: 500;

                color: #f1f1f1;

                margin: 0.5rem 0;
            }
            h2{

                font-size: 1.2rem;
                font-weight: 700;

                color: #999999;
            }

        }

        .item-button{

            margin: 1rem 0;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            width: 40%;

            *:hover{
                opacity: 0.9;
            }

            a{
                cursor: pointer;

                width: 70%;

                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                font-size: 1.4rem;
                font-weight: 400;
                color: #fff;

                height: 4rem;
                background-color: #ff1a75;
            }

            button{
                cursor: pointer;
                
                width: 20%;
                
                margin-left: 1rem;

                height: 4rem;
                outline: 0;
                border: 0;
                
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                background-color: #8d8d8dc9;
                
                svg{
                    color: #fff;
                    height: 3rem;
                    width: auto;
                }
            }

        }
    }
`