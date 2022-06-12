import styled from 'styled-components'

interface itemData {
    info: any
}

export const AnimeToBeListed = styled.div<itemData>`

    height: 28rem;
    width: 20rem;

    background-image: ${(props) => props.info.coverImage && `url("${props.info.coverImage.large}")`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    border-radius: 2px;

    div.add-button{

        height: 50%;

        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;

        button{
            cursor: pointer;

            padding: 0.5rem;
            margin: 1rem;

            border: none;
            outline: 0;

            background-color: #8d8d8dc9;

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

    div.see-more-button{

        height: 50%;

        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;

        a{
            width: 75%;

            margin: 1.5rem 0;
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