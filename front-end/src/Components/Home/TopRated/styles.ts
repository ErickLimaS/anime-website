import styled from 'styled-components'

interface itemData {
    info: any
}

export const TopRatedAnime = styled.div<itemData>`

    height: 18rem;
    width: 28rem;

    margin: 0 0.7rem;

    @media(max-width: 520px){
        margin: 0 0.3rem;
    }

    background-image: ${(props) => props.info.bannerImage && `url("${props.info.bannerImage}")`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    border-radius: 2px;

    :hover{
        transition: all ease-in-out 150ms;

        transform: scale(1.05);

        @media(max-width: 620px){

            transform: scale(1);

        }
    }

    div.anime-name{

        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;

        background-image: linear-gradient(to top, rgba(0,0,0,.8) 5%, transparent);

        h5{
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