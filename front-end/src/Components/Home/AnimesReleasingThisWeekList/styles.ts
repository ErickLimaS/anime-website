import styled from 'styled-components'

interface itemData {
    info: any,
    isAlreadyAdded: any
}

export const AnimeToBeListed = styled.div<itemData>`

    height: 260px;
    width: 200px;

    margin: 0 6px;

    @media(max-width: 768px){
/* 
        height: calc(260px - 5vh);
        width: calc(200px - 5vh); */

        margin: 0 4px;

    }

    @media(max-width: 520px){

        min-height: 220px;
        min-width: 180px;

    }

    background-image: ${(props) => props.info.coverImage && `url("${props.info.coverImage.large}")`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    border-radius: 4px;

    div.add-button{

        height: 50%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        overflow: hidden;

        border-radius: 3px;
        
        div.media-type{
            background-color: rgba(0,0,0,.75);

            margin-top: -5rem;

            min-width: 8rem;
            min-height: 8rem;

            overflow: hidden;
            transform: skewY(-48deg);

            svg{
                fill: #ff1a75;

                padding: 1rem;
                margin: 3.5rem 1.5rem 0rem 0.4rem;

                transform: skewY(48deg);

                width: 2rem;
                height: 2rem;
            }
        }

        button{
            cursor: pointer;

            padding: 0.5rem;
            margin-top: 1rem;
            margin-right: 1rem;

            border: none;
            outline: 0;

            background-color: ${props => props.isAlreadyAdded ? '#505050e6' : '#8d8d8dc9'};

            svg{
                color: #fff;

                height: 2.5rem;
                width: auto;
            }

            :hover{
                opacity: 0.9;
            }
        }

    }

    :hover{
            
        .see-more-button{
            
            background-image: linear-gradient(rgba(0,0,0,.01) , rgba(16 2 7 / 72%) 17%);
            border-radius: 0 0 3px 3px;

            .name-fade{
                opacity: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                width: 90%;

                transition: all ease-in-out 200ms;
                
                font-size: 1.4rem;
                text-align: center;
                font-weight: 600;
                color: #c0c0c0;

            }
        }
    }

    div.see-more-button{

        height: 50%;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        align-items: center;

        .name-fade{
            transition: all ease-in-out 200ms;
            opacity: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin-top: 14%;
            
            display: flex;
            justify-content: center;
            align-items: center;

            width: 90%;

            transition: all ease-in-out 200ms;
                
            h1{
                font-size: 1.4rem;
                font-weight: 600;
                color: #c0c0c0;
            }
        }

        a{
            width: 75%;

            margin-bottom: 1.5rem;
            padding: 1rem;
            
            display: flex;
            align-items: center;
            justify-content: center;

            background-color: #ff1a75;

            color: #fff;
            font-size: 1.4rem;
            font-weight: 400;
            
            :hover{
                opacity: 0.9;
            }
        }

    }



`