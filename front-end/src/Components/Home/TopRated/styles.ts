import styled from 'styled-components'

interface itemData {
    info: any
}

export const TopRatedAnime = styled.div<itemData>`

    height: 18rem;
    width: 28rem;

    margin: 0 0.7rem;

    @media(max-width: 768px){
        min-width: 28rem;
    }

    @media(max-width: 520px){
        margin: 0 0.3rem;
        min-width: 28rem;
    }

    background-image: ${(props) => props.info.bannerImage ? `url("${props.info.bannerImage}")` : `url('https://wallpaperaccess.com/full/2825138.jpg')`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    border-radius: 2px;

    :hover{
        transition: all ease-in-out 150ms;

        transform: scale(1.05);

        @media(min-width: 620px){
            animation: sizing forwards 600ms;

            @keyframes sizing{
                0%{
                    min-width: 20rem;
                }
                100%{
                    min-width: 28rem;
                }
            }
        }

        @media(max-width: 620px){
            animation: sizing forwards 600ms;

            transform: scale(1);

            @keyframes sizing{
                0%{
                    min-width: 28rem;
                }
                100%{
                    min-width: 36rem;
                }
            }

        }
    }

    div.anime-name{

        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;

        background-image: linear-gradient(to top, rgba(0,0,0,.8) 5%, transparent);

        h2{
            margin: 1rem;
            
            font-size: 1.2rem;
            font-weight: 600;
            color: #fff;

            span{
                color: #999999;
            }
        }

        

    }



`