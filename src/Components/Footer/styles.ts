import styled from "styled-components";

export const Container = styled.footer`

    padding-top: 1rem;

    background-color: #fafafa;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 1.8rem;

    *{
        color: #333333;
    }

    a{
        color: #666666;

        :hover{
            color: #999999;
        }
    }

    small > a{
        text-decoration: underline;
    }

`