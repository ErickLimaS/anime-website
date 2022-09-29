import styled from "styled-components";

interface Props {
}

export const Layout = styled.div<Props>`

    display: grid;
    grid-template-columns: 15vw 83vw;
    flex: 1 1;

    @media(max-width: 1180px){
        grid-template-columns: 20vw 75vw;
    }

    @media(max-width: 768px){

        grid-template-columns: 100vw;

    }

    @media(max-width: 620px){
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    width: 100%;
    
    // loading effect
    .div-skeleton{
        height: 40vh;
        margin: 2rem 0;

        border-radius: 4px;

        animation: skeleton-loading 1s linear infinite alternate;

        .heading{
            display: none!important;;
        }

        @keyframes skeleton-loading{
            0%{
                background-color: #c0c0c0;
            }
            100%{
                background-color: #999999;
            }
        }

    }


`

export const MainContent = styled.main<Props>`

    min-width: 80vw;
    max-width: 100vw;

`