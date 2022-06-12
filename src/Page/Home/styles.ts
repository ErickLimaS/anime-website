import styled from "styled-components";

interface ContainerProps {

    innerPageLink: number; //aux to show which inner page must be shown


}

export const Container = styled.div<ContainerProps>`

    display: flex;
    flex-direction: row;

    width: 100%;

    background-color: #fafafa;

    
    nav.links{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        /* position: -webkit-sticky!important;
        position: sticky!important;
        top: 0!important; */

        font-size: 1.4rem;

        width: 25%;

        padding-left: 4rem;

        h3{
            margin: 1rem 0;
            
            color: #625e5e;
            font-weight: 600;
        }

        li{
            margin: 1rem 0;

            :hover{
                border-right: 4px solid #ff1a75;

                >a{
                    
                    color: #ff1a75;
                }
            }

            >a{
                display: flex;
                

                width: 100%;

                font-weight: 600;
                color: #888888; 
            }

        }
        
    }

    >aside{

        width: 40%;

        padding: 0 2rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        div.trending{

        }

    }

    div.main-content{

        width: 60%;

        border-left: 2px solid #e6e6e6;
        border-right: 2px solid #e6e6e6;

        padding: 1rem 3rem 3rem 3rem;

        .div-skeleton{
            height: 40vh;

            animation: skeleton-loading 1s linear infinite alternate;

            @keyframes skeleton-loading{
                0%{
                    background-color: #c0c0c0;
                }
                100%{
                    background-color: #888888;
                }
            }

        }

        nav.links-inner-page{

            font-size: 2rem;
            font-weight: 400;

            margin-bottom: 2rem;

            a{
                margin-right: 2rem;
            }
            a.anime{
                color: ${props => props.innerPageLink === 0 && `#ff1a75`};
            } 
            a.manga{
                color: ${props => props.innerPageLink === 1 && `#ff1a75`};
            }
            a.movie{
                color: ${props => props.innerPageLink === 2 && `#ff1a75`};
            }

        }
        
        >section{
            display: flex;
            flex-direction: column;
        }

        // gets link clicked on Home and shows which section is correspondent
        section#anime {
            display: ${props => props.innerPageLink === 0 ? `flex` : `none`};


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

            div.releasing-this-week{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

            }
        }

        section#manga {
            display: ${props => props.innerPageLink === 1 ? `flex` : `none`};

            
        }

        section#movie {
            display: ${props => props.innerPageLink === 2 ? `flex` : `none`};
        }

    }

    aside.trending{
        width: 25%;

    }


`