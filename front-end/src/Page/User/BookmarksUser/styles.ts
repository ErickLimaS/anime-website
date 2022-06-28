import styled from 'styled-components'

export const Container = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #fafafa;

    .main.skeleton{

        .skeleton-name{
            
            height: 10vh;
            width: 50%;

            background-color: #c0c0c0;
            border-radius: 2px;

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

        .grid{
            
            display: grid;
            grid-template-columns: auto;
            justify-content: flex-start;
            align-items: center;

            margin: 2rem 0;

            background-color: #c0c0c0;

            animation: skeleton-loading 1s linear infinite alternate;

                @keyframes skeleton-loading{
                    0%{
                        background-color: #c0c0c0;
                    }
                    100%{
                        background-color: #999999;
                    }
                }

            .skeleton-grid-item{
                width: 9rem;
                height: 11rem;

                margin: 2rem;

                border-radius: 4px;

                background-color: #c0c0c0;

                animation: skeleton-loading 1s linear infinite alternate;

                @keyframes skeleton-loading{
                    0%{
                        background-color: #c0c0c0;
                    }
                    100%{
                        background-color: #999999;
                    }
                }

                >div{

                    height: 10%;
                    width: 80%;

                    margin: 1rem;

                    background-color: #ff1a75;

                }
            }

        }

    }

    div.main{

        width: 80%;    

        /* border-right: 2px solid #e6e6e6; */
        border-left: 2px solid #e6e6e6;
        padding: 1rem 3rem 3rem 3rem;

        @media(max-width: 620px){

            border-left: 0;
        }

        h1{
            margin: 2rem 0;

            font-size: 4rem;
            font-weight: 600;
            color: #ff1a75;
        }

        .sort{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;

            margin: 1rem 0;
            padding: 1rem 0;

            background-color: #ff1a7512;
            border-radius: 4px;

            @media(max-width: 620px){

                justify-content: center;
            }

            >div{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;

                margin: 0 1rem;

                label{
                    font-size: 1.4rem;
                }

                select{
                    border: 1px solid #999999;
                    border-radius: 4px;

                    padding: 0.7rem 1rem;

                    option{
                    padding: 0.7rem 1rem;

                    }

                }
            }
        }

        .grid{
            display: grid;
            grid-template-columns: auto auto auto;
            gap: 2rem;

            @media(max-width: 1080px){

                grid-template-columns: auto auto;

            }

            @media(max-width:760px){

                grid-template-columns: auto;

            }

            .grid-item{

                display: flex;
                flex-direction: row;
                height: min-content;

                background-color: #fff;
                border: 1px solid #ff1a75;

                .item-img{
                    height: min-content;

                    img{
                        height: 18rem;
                        width: 12rem;
                    }
                }

                .item-info{

                    margin: 0 1rem;

                    h1{
                        font-size: 2rem;
                        font-weight: 600;

                        margin: 0.5rem 0;
                    }

                    small{
                        
                        color: #333333;
                        font-size: 1.2rem;
                        font-weight: 400;
                    }

                    ul{
                        margin: 1rem 0;

                        *{
                            color: #333333;
                        }

                        li{
                            font-size: 1.4rem;
                            font-weight: 400;
                        }

                    }

                    
                }

            }

        }

    }



`