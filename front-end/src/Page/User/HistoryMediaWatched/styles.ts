import styled from "styled-components";

interface Props {
    tabIndex: number,
    darkMode: boolean
}

export const Container = styled.div<Props>`

    display: flex;
    flex-direction: row;

    // loading
    .loading-skeleton-heading{

        margin: 20px 20px;

        height: 10vh;

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

        margin: 10px 20px;

        height: 40vh;

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

        width: 100%;    

        margin: 0rem;

        @media(max-width: 768px){

            width: 100%; 

            padding: 1rem 0rem;

            margin: 0;

            border-left: 0;
        }

        .heading{
            margin: 10px 0;
            margin-left: 20px;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;

            @media(max-width: 768px){

                margin: 0 20px;

                flex-direction: column;
                justify-content: center;
                align-items: center;

            }

            h1{
                margin: 2rem 0;

                font-size: 3rem;
                font-weight: 600;
                color: #ff1a75;

            }

            div.sort-buttons{

                display: grid;
                grid-template-columns: repeat(5, 1fr);
                align-items: center;
                gap: 0 10px;

                
                @media(max-width: 1024px){

                    gap: 0 10px 10px 10px;

                }

                @media(max-width: 768px){

                    margin: 20px 0;

                }
                
                @media(max-width: 640px){

                    width: 100%;

                    grid-template-columns: repeat(2, 1fr);

                    gap: 10px;

                }

                >button{
                    cursor: pointer;
                                                            
                    max-height: 50px;
                    min-height: 30px;

                    padding: 1rem;

                    border-radius: 4px;

                    font-size: 1.5rem;
                    font-weight: 500;

                    @media (min-width: 768px) and (max-width: 1020px){

                        height: 100%;

                        margin: 0rem 0.2rem;

                    }

                    @media(max-width: 462px){

                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;

                    }

                    @media(max-width: 462px){

                        font-size: 1.4rem;

                    }

                }

                button[data-btn-tab="0"]{
                            
                            background-color: ${props => props.darkMode === true && props.tabIndex === 0 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === true && props.tabIndex !== 0 && 'var(--brand-dark-mode-color)'};
    
    
                            background-color: ${props => props.darkMode === false && props.tabIndex === 0 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === false && props.tabIndex !== 0 && 'var(--bcg-light-mode)'};
    
                            border: ${props => props.tabIndex === 0 ? '2px solid var(--brand-color)' : '2px solid var(--brand-color)'};
    
                            color: ${props => props.darkMode === true && props.tabIndex === 0 && '#fff'};
                            color: ${props => props.darkMode === true && props.tabIndex !== 0 && 'var(--brand-color)'};
    
                            color: ${props => props.darkMode === false && props.tabIndex === 0 && '#fff'};
                            color: ${props => props.darkMode === false && props.tabIndex !== 0 && 'var(--brand-color)'};
    
                            font-weight: ${props => props.tabIndex === 0 ? '600' : '300'};
                            
                }
                button[data-btn-tab="1"]{
                                
                            background-color: ${props => props.darkMode === true && props.tabIndex === 1 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === true && props.tabIndex !== 1 && 'var(--brand-dark-mode-color)'};
    
    
                            background-color: ${props => props.darkMode === false && props.tabIndex === 1 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === false && props.tabIndex !== 1 && 'var(--bcg-light-mode)'};
    
                            border: ${props => props.tabIndex === 1 ? '2px solid var(--brand-color)' : '2px solid var(--brand-color)'};
    
                            color: ${props => props.darkMode === true && props.tabIndex === 1 && '#fff'};
                            color: ${props => props.darkMode === true && props.tabIndex !== 1 && 'var(--brand-color)'};
    
                            color: ${props => props.darkMode === false && props.tabIndex === 1 && '#fff'};
                            color: ${props => props.darkMode === false && props.tabIndex !== 1 && 'var(--brand-color)'};
                            font-weight: ${props => props.tabIndex === 1 ? '600' : '300'};
                }
                button[data-btn-tab="2"]{
                                
                            background-color: ${props => props.darkMode === true && props.tabIndex === 2 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === true && props.tabIndex !== 2 && 'var(--brand-dark-mode-color)'};
    
    
                            background-color: ${props => props.darkMode === false && props.tabIndex === 2 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === false && props.tabIndex !== 2 && 'var(--bcg-light-mode)'};
    
                            border: ${props => props.tabIndex === 2 ? '2px solid var(--brand-color)' : '2px solid var(--brand-color)'};
    
                            color: ${props => props.darkMode === true && props.tabIndex === 2 && '#fff'};
                            color: ${props => props.darkMode === true && props.tabIndex !== 2 && 'var(--brand-color)'};
    
                            color: ${props => props.darkMode === false && props.tabIndex === 2 && '#fff'};
                            color: ${props => props.darkMode === false && props.tabIndex !== 2 && 'var(--brand-color)'};
                            
                            font-weight: ${props => props.tabIndex === 2 ? '600' : '300'};
                }
                button[data-btn-tab="3"]{
                                
                            background-color: ${props => props.darkMode === true && props.tabIndex === 3 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === true && props.tabIndex !== 3 && 'var(--brand-dark-mode-color)'};
    
    
                            background-color: ${props => props.darkMode === false && props.tabIndex === 3 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === false && props.tabIndex !== 3 && 'var(--bcg-light-mode)'};
    
                            border: ${props => props.tabIndex === 0 ? '2px solid var(--brand-color)' : '2px solid var(--brand-color)'};
    
                            color: ${props => props.darkMode === true && props.tabIndex === 3 && '#fff'};
                            color: ${props => props.darkMode === true && props.tabIndex !== 3 && 'var(--brand-color)'};
    
                            color: ${props => props.darkMode === false && props.tabIndex === 3 && '#fff'};
                            color: ${props => props.darkMode === false && props.tabIndex !== 3 && 'var(--brand-color)'};
    
                            font-weight: ${props => props.tabIndex === 3 ? '600' : '300'};
                }
                button[data-btn-tab="4"]{
                                
                            background-color: ${props => props.darkMode === true && props.tabIndex === 4 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === true && props.tabIndex !== 4 && 'var(--brand-dark-mode-color)'};
    
    
                            background-color: ${props => props.darkMode === false && props.tabIndex === 4 && 'var(--brand-color)'};
                            background-color: ${props => props.darkMode === false && props.tabIndex !== 4 && 'var(--bcg-light-mode)'};
    
                            border: ${props => props.tabIndex === 4 ? '2px solid var(--brand-color)' : '2px solid var(--brand-color)'};
    
                            color: ${props => props.darkMode === true && props.tabIndex === 4 && '#fff'};
                            color: ${props => props.darkMode === true && props.tabIndex !== 4 && 'var(--brand-color)'};
    
                            color: ${props => props.darkMode === false && props.tabIndex === 4 && '#fff'};
                            color: ${props => props.darkMode === false && props.tabIndex !== 4 && 'var(--brand-color)'};
    
                            font-weight: ${props => props.tabIndex === 4 ? '600' : '300'};
                }
            }
        }

        .content{
            
            margin-bottom: 1rem;

        }

        .grid{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            justify-items: center;
            gap: 2rem;

            @media(max-width: 1180px){

                grid-template-columns: 1fr 1fr;

            }

            @media(max-width: 768px){

                min-height: 70vh;
                
                grid-template-columns: 1fr 1fr;

            }

            @media(max-width: 720px){

                grid-template-columns: 1fr;
                justify-items: center;

            }

        }

        div[data-tab="0"]{

            display: ${props => props.tabIndex === 0 ? 'block' : 'none'};

        }

        div[data-tab="1"]{

            display: ${props => props.tabIndex === 1 ? 'block' : 'none'};

        }

        div[data-tab="2"]{

            display: ${props => props.tabIndex === 2 ? 'block' : 'none'};

        }

        div[data-tab="3"]{

            display: ${props => props.tabIndex === 3 ? 'block' : 'none'};

        }

        div[data-tab="4"]{

            display: ${props => props.tabIndex === 4 ? 'block' : 'none'};

        }

    }

`