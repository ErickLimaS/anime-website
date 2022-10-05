import styled from "styled-components";

interface ContainerProps {

    innerPageLink: number; //aux to show which inner page must be shown
    darkMode: boolean

}

export const Container = styled.div<ContainerProps>`

    display: grid;
    grid-template-columns: 70% 30%;

    @media(max-width: 1180px){
        grid-template-columns: 100%;
    }

    @media(max-width: 1080px){
        flex-wrap: wrap;
        justify-content: center;
    }

    @media(max-width: 620px){
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    width: 100%;
    
    // loading effect
    .div-skeleton{
        height: 40vh;
        margin: 2rem 0;

        border-radius: 4px;

        animation: skeleton-loading 1s linear infinite alternate;

        .heading{
            display: none!important;;
        }

        @keyframes skeleton-loading{
            0%{
                background-color: #c0c0c0;
            }
            100%{
                background-color: #999999;
            }
        }

    }

    
    div.trending.div-skeleton{

        width: 90%;

    }

    // content
    div.main-content{

        margin: 2rem;

        @media(max-width: 620px){
            
            margin: 1rem;

        }

        .search-mobile{

            display: none;

             @media(max-width: 768px){
                display: block;

                padding: 1rem 0 2rem 0;
            }
            
        }

        div.nav-and-mobile-search{

            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            align-items: center;

            margin-bottom: 2rem;

            div.search{

                display: none;

                @media((min-width: 769px) and ( max-width: 1180px)){

                    display: block;
                    
                    position: absolute;
                    right: 2vw;
                    top: 20px;

                }

            }

        }

        nav.links-inner-page{

            font-size: 2rem;
            font-weight: 600;

            a{
                margin-right: 2rem;
                color: #888888;
            }
            a.anime{
                color: ${props => props.darkMode === true && props.innerPageLink === 0 && `var(--brand-color)`};

                color: ${props => props.darkMode === false && props.innerPageLink === 0 && `var(--brand-color)`};
            } 
            a.manga{
                color: ${props => props.darkMode === true && props.innerPageLink === 1 && `var(--brand-color)`};

                color: ${props => props.darkMode === false && props.innerPageLink === 1 && `var(--brand-color)`};
            }
            a.movie{
                color: ${props => props.darkMode === true && props.innerPageLink === 2 && `var(--brand-color)`};

                color: ${props => props.darkMode === false && props.innerPageLink === 2 && `var(--brand-color)`};
            }

        }
        
        >section{
            display: flex;
            flex-direction: column;
        }

        // gets link clicked on Home and shows which section is correspondent
        section[data-section="anime"], section[data-section="manga"], section[data-section="movie"]{
            display: ${props => props.innerPageLink === 0 ? `flex` : `none`};

            div.heading{

                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    margin: 20px 0;

                    h2{
                        font-size: 1.6rem;
                        font-weight: 600;
                        color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#625e5e'};
                    }

                    >div.nav-buttons{
                        
                        
                    }

            }

            div.releasing-this-week{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                @media(max-width: 768px){
                    display: flex;
                    justify-content: flex-start;

                    overflow-y: auto;

                    >div{

                        min-width: 18rem;

                    }
                }

            }

            div.top-rated-animes{
                display: flex;
                flex-direction: row;

                @media(min-width: 621px) and (max-width: 768px){

                    overflow-y: auto;

                }

                @media(max-width: 620px){

                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    >div{

                        width: 90%;

                        :not(:first-child){

                            margin-top: 10px;

                        }

                    }

                }

            }
        }

        section[data-section="manga"] {

            display: ${props => props.innerPageLink === 1 ? `flex` : `none`};
            
            div.new-episodes .heading{

                margin-top: 0;

            }

        }

        section[data-section="movie"] {

            display: ${props => props.innerPageLink === 2 ? `flex` : `none`};

        }


    }

    aside{

        padding: 2rem 0;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        border-left: 2px solid #e6e6e6;

        @media(max-width: 1180px){

            border-left: 0;

        }

        @media(max-width: 1080px){

            .search{
                display: none;
            }

        }
        
        .trending{
            width: 100%;
                
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .trending-heading{

                width: 90%;

                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                margin: 2rem 0;

                h3{
                    color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#625e5e'};
                    font-size: 1.6rem;
                    font-weight: 600;
                }

                svg{
                    color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#625e5e'};
                    width: 15px;
                    height: auto;
                }

            }

            div.trending-items{

                width: 100%;
                
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                a.button-see-more{
                    width: 90%;

                    display: flex;
                    justify-content: center;

                    padding: 1.3rem 0;
                    margin: 2rem 0;

                    font-size: 1.4rem;
                    font-weight: 600;
                    color: ${props => props.darkMode ? 'var(--brand-color)' : 'var(--pink-variant-1)'};

                    border-radius: 2px;
                    background-color: #ffd0e3;

                    :hover{

                        transition: all ease-in-out 200ms;

                        background-color: var(--brand-color);

                        color: var(--white);

                    }

                }

            }

        }
    }

`