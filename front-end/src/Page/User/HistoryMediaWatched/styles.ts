import styled from "styled-components";

interface Props {
    tabIndex: number
}

export const Container = styled.div<Props>`

    display: flex;
    flex-direction: row;

    // loading
    .loading-skeleton-heading{

        height: 10vh;
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

        @media(max-width: 768px){

            margin-left: 1rem;
            margin-right: 1rem;

        }

    }

    .loading-skeleton{

        height: 40vh;
        margin: 0.5rem 0;

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

        @media(max-width: 768px){

            margin-left: 1rem;
            margin-right: 1rem;

        }

    }

    // content
    div.history{

        display: flex;
        flex-direction: column;

        width: 80%;    

        border-left: 2px solid #e6e6e6;
        margin: 1rem 3rem 3rem 3rem;

        margin-left: 0;

        padding-left: 3rem;

        @media(max-width: 768px){

            width: 100%; 

            padding: 1rem 0rem;

            margin: 0;

            border-left: 0;
        }

        .heading{

            display: flex;
            flex-direction: row;
            justify-content: space-between;

            @media(max-width: 768px){

                flex-direction: column;
                justify-content: center;
                align-items: center;

            }

            h1{
                margin: 2rem 0;
                margin-left: 2rem;

                font-size: 3rem;
                font-weight: 600;
                color: #ff1a75;

                
                @media(max-width: 462px){
                    margin-left: 0;
                }
            }

            div.sort-buttons{

                display: flex;
                flex-direction: row;
                align-items: center;

                @media(max-width: 768px){

                    margin: 2rem 0;

                }

                @media(max-width: 462px){

                    flex-wrap: wrap;

                }

                >button{
                    cursor: pointer;
                    
                    margin: 0 1rem;

                    max-height: 7rem;
                    min-height: 3rem;

                    padding: 1rem;

                    border-radius: 4px;

                    font-size: 1.5rem;
                    font-weight: 500;

                    @media (min-width: 768px) and (max-width: 1020px){

                        padding: 0.2rem;
                        margin: 0rem 0.2rem;

                    }

                    @media(max-width: 462px){

                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;

                    }

                }

                button#button-tab-0{
                        
                    background-color: ${props => props.tabIndex === 0 ? '#ff1a75' : '#fafafa'};

                    border: ${props => props.tabIndex === 0 ? '2px solid #ff1a75' : '2px solid #ff1a75'};

                    color: ${props => props.tabIndex === 0 ? '#fff' : '#ff1a75'};
                        
                    font-weight: ${props => props.tabIndex === 0 ? '600' : '300'};
                    
                }
                button#button-tab-1{
                        
                    background-color: ${props => props.tabIndex === 1 ? '#ff1a75' : '#fafafa'};

                    border: ${props => props.tabIndex === 1 ? '2px solid #ff1a75' : '2px solid #ff1a75'};

                    color: ${props => props.tabIndex === 1 ? '#fff' : '#ff1a75'};
                        
                    font-weight: ${props => props.tabIndex === 1 ? '600' : '300'};
                }
                button#button-tab-2{
                        
                    background-color: ${props => props.tabIndex === 2 ? '#ff1a75' : '#fafafa'};

                    border: ${props => props.tabIndex === 2 ? '2px solid #ff1a75' : '2px solid #ff1a75'};
                    
                    color: ${props => props.tabIndex === 2 ? '#fff' : '#ff1a75'};
                        
                    font-weight: ${props => props.tabIndex === 2 ? '600' : '300'};
                }
                button#button-tab-3{
                        
                    background-color: ${props => props.tabIndex === 3 ? '#ff1a75' : '#fafafa'};

                    border: ${props => props.tabIndex === 3 ? '2px solid #ff1a75' : '2px solid #ff1a75'};
                    
                    color: ${props => props.tabIndex === 3 ? '#fff' : '#ff1a75'};
                        
                    font-weight: ${props => props.tabIndex === 3 ? '600' : '300'};
                }
                button#button-tab-4{
                        
                    background-color: ${props => props.tabIndex === 4 ? '#ff1a75' : '#fafafa'};

                    border: ${props => props.tabIndex === 4 ? '2px solid #ff1a75' : '2px solid #ff1a75'};
                    
                    color: ${props => props.tabIndex === 4 ? '#fff' : '#ff1a75'};
                        
                    font-weight: ${props => props.tabIndex === 4 ? '600' : '300'};
                }
            }
        }

        .grid{
            display: grid;
            grid-template-columns: auto auto auto;
            align-items: center;
            justify-items: center;
            gap: 2rem;

            @media(max-width: 1080px){

                grid-template-columns: auto auto;

            }

            @media(max-width: 768px){

                min-height: 70vh;
                
                grid-template-columns: auto auto;

            }

            @media(max-width: 720px){

                grid-template-columns: auto;
                justify-items: center;

            }

        }

        div#div-tab-0{

            display: ${props => props.tabIndex === 0 ? 'block' : 'none'};

        }

        div#div-tab-1{

            display: ${props => props.tabIndex === 1 ? 'block' : 'none'};

        }

        div#div-tab-2{

            display: ${props => props.tabIndex === 2 ? 'block' : 'none'};

        }

        div#div-tab-3{

            display: ${props => props.tabIndex === 3 ? 'block' : 'none'};

        }

        div#div-tab-4{

            display: ${props => props.tabIndex === 4 ? 'block' : 'none'};

        }

    }

`