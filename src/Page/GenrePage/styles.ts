import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    flex-direction: row;

    .skeleton{

        .skeleton-name{
            
            height: 10vh;
            width: 50%;
        }

        >div{
            background-color: #c0c0c0;
            border-radius: 2px;

            height: 50vh;

            margin: 1rem 0;

            animation: skeleton-loading 1s linear infinite alternate;

            @keyframes skeleton-loading{
                0%{
                    background-color: #c0c0c0;
                }
                100%{
                    background-color: #999999;
                }
            }
        }

    }
    
    .content{
        width: 80%;    

        /* border-right: 2px solid #e6e6e6; */
        border-left: 2px solid #e6e6e6;
        padding: 1rem 3rem 3rem 3rem;

        h1{
            margin: 2rem 0;

            font-size: 4rem;
            font-weight: 600;
            color: #ff1a75;
        }

        div.heading{

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            margin: 2.6rem 0;

            h2{
                font-size: 1.6rem;
                font-weight: 600;
                color: #625e5e;

                span{
                    color: #ff1a75;
                }
            }

            >div{
                
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                button{
                    cursor: pointer;

                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;

                    margin: 0 0.5rem;

                    width: 4rem;
                    height: 4rem;

                    background-color: transparent;
                    border-radius: 4000px;

                    outline: 0;
                    border: 1px solid #c0c0c0;

                    svg{
                        width: 2rem;
                        height: auto;

                        color: #333333;
                    }

                    :hover{
                        border: 1px solid #999999;
                    }

                }
                button.arrow-to-be-inverted{
                    transform: rotate(180deg);
                }

                
            }

        }

        .list{
            display: flex;
            flex-direction: row;
        }
    }



`