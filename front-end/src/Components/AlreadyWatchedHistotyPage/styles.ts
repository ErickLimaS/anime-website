import styled from "styled-components";

export const Container = styled.a`


display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;

height: 20rem;
width: 28rem;

@media(min-width: 620px) and (max-width: 720px){

    width: 60vw;

}

@media(min-width: 320px) and (max-width: 620px){
    width: 80vw;
}


padding: 0.2rem;

background-color: #fff;
border: 1px solid #ff1a75;
border-radius: 4px;

.item-img{
    height: min-content;

    img{
        height: 18rem;
        min-width: 12rem;
        max-width: 12rem;

        border-radius: 4px;
    }
}

.item-info{
    width: 11rem;
    height: 90%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    margin: 0 1rem;

    h1{
        font-size: 1.6rem;
        font-weight: 600;

        color: #ff1a75;

        margin: 0.5rem 0;
    }

    .info{
        display: flex;
        flex-direction: column;

        >*{
            margin: 0.4rem 0;
        }

        small{
            color: #333333;
            font-size: 1.1rem;
            font-weight: 400;
        }
        span{
            color: #333333;
            font-size: 1.2rem;
            font-weight: 400;
        }
    }

    ul{
        margin: 1rem 0;

        *{
            color: #333333;
        }

        li{
            font-size: 1.3rem;
            font-weight: 600;
            color: #888888;

            margin: 0.5rem 0;

            span{
                color: #555555;
            }
        }

    }

    
}

:hover{
    transition: all ease-in-out 100ms;
    box-shadow: 0px 0px 8px 3px #bfbfbf;
}



`