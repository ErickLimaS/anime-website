import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    flex-direction: row;

    .main{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        width: 100%;

        @media(max-width: 1080px){
            flex-wrap: wrap;
            width: 80%;
        }

        @media(max-width: 620px){
            flex-wrap: wrap;
            width: 95%;
        }
    }


    @media(max-width: 1080px){
        /* flex-wrap: wrap; */
    }

    @media(max-width: 620px){
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    /* width: 100%; */

    background-color: #fafafa;

    div.skeleton{
        background-color: #c0c0c0;
    }

    /* >div:last-child{
        width: 10vh;
    } */


`