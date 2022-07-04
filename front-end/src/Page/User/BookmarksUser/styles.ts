import styled from 'styled-components'

interface Props {
    tabIndex: any;
}

export const Container = styled.div<Props>`

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

        .content{

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            
            @media(max-width: 1440px){
                width: fit-content;
                justify-content: space-evenly;
            }
                

            @media(max-width: 620px){
                flex-direction: column-reverse;
            }

            div#tab-0{
                display: ${props => props.tabIndex === 0 ? `block` : 'none'};
            }
            div#tab-1{
                display: ${props => props.tabIndex === 1 ? `block` : 'none'};
            }
            div#tab-2{
                display: ${props => props.tabIndex === 2 ? `block` : 'none'};
            }
            div#tab-3{
                display: ${props => props.tabIndex === 3 ? `block` : 'none'};
            }
            div#tab-4{
                display: ${props => props.tabIndex === 4 ? `block` : 'none'};
            }

        }

        h1{
            margin: 2rem 0;

            font-size: 4rem;
            font-weight: 600;
            color: #ff1a75;
        }

        .sort{
            width: 20%;

            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            margin-left: 1rem;
            padding: 0 1rem;

            /* background-color: #ff1a7512; */
            border-left: 2px solid #ff1a7512;
            border-radius: 4px;

            
            @media(max-width: 620px){

                width: 100%;

                margin: 0;
                padding: 0;

                border-left: 0;
                justify-content: center;
            }

            div.media-type{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                flex-wrap: wrap;

                margin: 0 1rem;

                h1{
                    margin-top: 0rem;
                    margin-bottom: 2rem;
                    font-size: 2rem;

                    @media(max-width: 620px){
                        font-size: 3rem;
                    }
                }

                >div{

                    @media(max-width: 620px){
                        margin-top: 1rem;
                        margin-bottom: 2rem;
                        display: flex;
                        flex-wrap: wrap;
                    }

                    p{
                        cursor: pointer;
                        font-size: 1.6rem;
                        padding: 1rem;
                        margin: 1rem 0;
                        border: 1px solid #ff1a75;
                        border-radius: 4px;

                        @media(max-width: 620px){
                            font-size: 1.8rem;
                            margin: 1rem;
                        }

                        :hover{
                            color: #999999;
                        }
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

            @media(max-width:768px){

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
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;

                    margin: 0 1rem;

                    h1{
                        font-size: 2rem;
                        font-weight: 600;

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
                            font-size: 1.2rem;
                            font-weight: 400;
                        }
                        span{
                            color: #333333;
                            font-size: 1.4rem;
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

                            span{
                                color: #555555;
                            }
                        }

                    }

                    
                }

            }

        }

    }



`