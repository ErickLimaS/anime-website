import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: center;

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

        @media(max-width: 1080px){
            width: 95%;
            
            border-left: 0;

            padding: 0;
        }

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
                        width: 0.7rem;
                        height: auto;

                        fill: #444;
                    }

                    :hover{
                        border: 1px solid #999999;
                    }

                }
                button[disabled]{
                    cursor: default;

                    background-color: rgb(84 84 84 / 10%);

                    border-color: #dddddd;
                            
                    svg{
                        fill: #c0c0c0!important;
                    }

                    :hover{
                        border: 1px solid #c0c0c0;
                    }
                }

            }

        }

        .top-rated-manga, .top-rated-anime{
            .list{
                padding: 0.5rem 0;
                
                overflow: auto;
            
                display: flex;
                flex-direction: row;

                ::-webkit-scrollbar {
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #888;

                    border-radius: 2px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #555; 
                }
            }
        }

        .trending{

            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: flex-start;

            @media(max-width: 620px){

                flex-direction: column;
                justify-content: center;
                align-items: center;

            }

            margin: 2rem 0;

            >div{
                margin: 0 2rem;
            }

            .trending-anime, .trending-manga{

                width: 40%;

                @media(max-width: 620px){
                    
                    width: 100%;

                }

                .heading{
                    background-color: initial;
                }

                div.description-hover{
                        display: none!important;;
                }

                >div{
                    background-color: rgb(255 222 245 / 0.44);
                    border-radius: 4px;
                    
                    
                    margin: 1rem 0;
                }

            }

            .trending-anime{

                .heading h2{
                    flex-direction: row!important;
                    span{
                        margin-left: 0.5rem;
                    }
                }

                >div{
                    flex-direction: row-reverse;

                    >*{
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        align-items: flex-end;

                    }

                    @media(max-width: 620px){

                        flex-direction: row;
                            
                        >*{
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: flex-start;
                        }
                    } 
                }

            }

        }
    }



`