import styled from "styled-components";

export const Container = styled.div`

    form{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div{
            
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        }
    }

    svg#input-svg{
        background-color: #f3f2ff;
        border: none;
        border-right: none;
        border-radius: 18px 0 0 18px;

        color: #ff5ebc;

        height: 20px;
        width: auto;

        padding: 0.9rem 1rem;
    }
       
    input{
        background-color: #f3f2ff;
        outline: 0;
        border: none;
        border-left: none;
        border-radius: 0 0 0 0;

        padding: 1rem;

        font-size: 1.6rem;
        font-weight: 400;

        :focus{
            background-color: #f3f2ff;
            ~button{
                cursor: pointer;
                padding: 1.1rem ;
                background-color: #ff5ebc;

                svg{
                    transition: all ease-in 200ms;
                    display: block;
                    color: #fff;
                }
            }
        }
    }
    button{
        svg{
            display: none;
        }

        background-color: #f3f2ff;
        padding: 1.9rem ;
        border: none;
        border-radius: 0 18px 18px 0;
        font-size: 1.4rem;
                /* display: none; */
    }
    



`