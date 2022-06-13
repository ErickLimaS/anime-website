import styled from "styled-components";

interface ContainerProps {

    innerPageLink: number; //aux to show which inner page must be shown


}

export const Container = styled.div<ContainerProps>`

    display: flex;
    flex-direction: row;

    @media(max-width: 1080px){
        flex-wrap: wrap;
    }

    @media(max-width: 620px){
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    width: 100%;

    background-color: #fafafa;

    nav.links{
        
        position: sticky;
        top: 0;
        
        height: max-content;
        width: 25vh;

        @media(max-width: 1080px){
            width: 20%;
            padding-left: 2rem;
        }

        @media(max-width: 620px){
            display: none;
        }

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        font-size: 1.4rem;

        padding-left: 4rem;

        h3{
            margin: 1rem 0;
            
            color: #999999;
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
                color: #757474; 
            }

        }
        
    }

    div.main-content{

        width: 55%;

        border-left: 2px solid #e6e6e6;
        border-right: 2px solid #e6e6e6;

        padding: 1rem 3rem 3rem 3rem;

        @media(max-width: 1080px){
            width: 70%;
            padding: 0 1rem ;
            border-right: none;
        }

        @media(max-width: 620px){
            width: 95%;
            border-left: none;
        }

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

                @media(max-width: 620px){
                    display: -webkit-box;
                    justify-content: center;

                    overflow-y: auto;
                }

            }

            div.top-rated-animes{
                display: flex;
                flex-direction: row;

                @media(max-width: 620px){

                    overflow-y: auto;
                }
            }
        }

        section#manga {
            display: ${props => props.innerPageLink === 1 ? `flex` : `none`};

            
        }

        section#movie {
            display: ${props => props.innerPageLink === 2 ? `flex` : `none`};
        }

    }

    aside{
        width: 25%;

        padding: 0 2rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        @media(max-width: 1020px){
            width: 100%;
        }

        @media(max-width: 620px){
            padding: 0 1rem;
        }
        
        .trending-heading{

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            margin: 2rem 0;

            h3{
                font-size: 1.6rem;
                font-weight: 600;
                color: #625e5e;
            }

            svg{
                width: 15px;
                height: auto;
                color: #625e5e;
            }

        }

        div.trending-items{

            a.button-see-more{
                width: 100%;

                display: flex;
                justify-content: center;

                padding: 1.3rem 0;
                margin: 2rem 0;

                font-size: 1.4rem;
                font-weight: 600;
                color: #ff1a75;

                border-radius: 2px;
                background-color: #ffd0e3;

            }

        }

    }


`