import styled from "styled-components";

interface ContainerProps {

    innerPageLink: number;

}

export const Container = styled.div<ContainerProps>`

    display: flex;
    flex-direction: row;

    width: 100%;

    background-color: #fafafa;

    >aside{

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    nav.links{
        display: flex;
        flex-direction: column;
        justify-content: center;

        font-size: 1.4rem;

        width: 15%;

        padding-left: 4rem;

        h3{
            margin: 1rem 0;
            
            color: #777777;
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

    div.main-content{

        width: 80%;

        border-left: 2px solid #e6e6e6;
        border-right: 2px solid #e6e6e6;

        padding: 3rem;

        nav.links-inner-page{

            font-size: 2rem;
            font-weight: 400;

            a{
                margin-right: 2rem;
            }
            a.anime{
                color: ${props => props.innerPageLink === 0 && `#ff1a75` };
            } 
            a.manga{
                color: ${props => props.innerPageLink === 1 && `#ff1a75` };
            }
            a.movie{
                color: ${props => props.innerPageLink === 2 && `#ff1a75` };
            }

        }
        
        >section{
            display: flex;
            flex-direction: column;
        }

        // gets link clicked on Home and shows which section is correspondent
        section#anime {
            display: ${props => props.innerPageLink === 0 ? `flex` : `none`};
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