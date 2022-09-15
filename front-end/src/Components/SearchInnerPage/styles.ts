import styled from "styled-components";

interface Props {
    hasText: any;
    loading: boolean;
    darkMode: boolean;
}

interface Props2{
    darkMode: boolean;
}

export const Search = styled.div<Props>`

    form{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div{
            
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
    }

    svg#input-svg{
        background-color: ${props => props.darkMode ? '#212121' : '#f3f2ff'};
        border: none;
        border-right: none;
        border-radius: 18px 0 0 18px;

        color: #ff5ebc;

        height: 22px;
        width: auto;

        padding: 0.9rem 1rem;

        *{
            color: #ff5ebc;
        }
    }

    svg#input-loading-svg{
        
        transform: scale(2);

        background-color: ${props => props.darkMode ? '#212121!important' : '#f3f2ff!important'};

        border: none;
        border-right: none;
        border-radius: 18px 0 0 18px;

        color: #ff5ebc;

        height: 20px;
        width: auto;

        *{
            color: #ff5ebc;
        }
    }
       
    input{
        transition: all ease-in-out 150ms;
        background-color: ${props => props.darkMode ? '#212121' : '#f3f2ff'};
        outline: 0;
        border: none;
        border-left: none;
        border-radius: 0 0 0 0;

        padding: ${props => props.loading === true ? `0.5rem 1rem 0.5rem 3rem` : `0.5rem 1rem`};

        height: 30px;

        color: ${props => props.darkMode ? '#fff' : 'initial'};
        font-size: 1.6rem;
        font-weight: 400;

        @media(max-width: 620px){
            width: 50vw;
        }

        :-webkit-autofill,
        :-webkit-autofill:hover, 
        :-webkit-autofill:focus, 
        :-webkit-autofill:active{
            color: ${props => props.darkMode ? '#fff!important' : 'initial'};

            box-shadow: none;
            -webkit-box-shadow: 0 0 0 30px ${props => props.darkMode ? '#212121' : '#f3f2ff'} inset !important;
            
            -webkit-text-fill-color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : 'var(--black-variant)'}  !important;
        }

        :active{
            
            color: ${props => props.darkMode ? '#fff' : 'initial'};

            background-color: ${props => props.darkMode ? '#212121' : '#f3f2ff'};
        }

        :focus{

            color: ${props => props.darkMode ? '#fff' : 'initial'};

            background-color: ${props => props.darkMode ? '#212121' : '#f3f2ff'};

            ~button{
                cursor: pointer;
                padding: 1.1rem;
                background-color: #ff5ebc;

                svg{
                    transition: all ease-in 200ms;
                    opacity: 1;
                    color: #fff;
                }
            }
        }
    }
    button{

        background-color: ${props => props.hasText.current?.value?.length > 0 ? '#ff5ebc!important' : ''};

        cursor: ${props => props.hasText.current?.value?.length > 0 ? 'pointer!important' : 'default'};
        
        padding: ${props => props.hasText.current?.value?.length > 0 ? '1.1rem!important' : ''};

        svg{
            transition: all ease-in 200ms;
            opacity: ${props => props.hasText.current?.value?.length > 0 ? '1!important' : '0'};

            *{
                color: #fff;
            }
        }

        height: 40px;

        background-color: ${props => props.darkMode ? '#212121' : '#f3f2ff'};

        padding: 1.1rem;
        border: none;
        border-radius: 0 18px 18px 0;
        font-size: 1.4rem;
    }
    
`

export const SearchResults = styled.div<Props2>`

    z-index: 1000;

    position: relative;
    
    margin: 1rem 0;
    padding: 1rem 0rem;

    background-color: ${props => props.darkMode ? '#181818' : 'transparent'};

    border-radius: 4px;

    @media(min-width: 620px) and (max-width: 768px){

        display: grid;
        grid-template-columns: auto auto;
        justify-items: center;
        align-items: center;

    }

    div.heading-search-results{

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        @media(min-width: 620px) and (max-width: 768px){

            justify-content: space-evenly;
            flex-direction: column-reverse;

        }

        h1{
            font-size: 1.8rem;
            font-weight: 400;
            color: ${props => props.darkMode ? '#fff' : '#000'};
        }
        button{
            cursor: pointer;            
            outline: 0;
            border: 0px solid #c0c0c0;

            background-color: transparent;

            color: #777777;

            svg{
                padding: 0.5rem;
                transform: scale(1.5);
                fill: #fff;

                :hover{
                    transition: all ease-in-out 350ms;
                    fill: #ff1a75;
                }

            }

            
        }

    }

    .result-item{
        background-color: #fafafa;

        width: 293px;

        border-radius: 4px;

        border: 1px solid #ffa2c8;

        @media(max-width: 620px){
            width: initial;
        }

        :hover{
            border: 1px solid #ff1a75;
        }

        a{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            background-color: ${props => props.darkMode ? '#212121!important' : '#f3f2ff!important'};
            border-radius: 4px;

            img{
                width: 30%;

                border-radius: 4px 0 0 4px;

            }

            div.item-info{
                width: 70%;
                height: 100px;

                display: flex;
                flex-direction: column;
                justify-content: space-between;

                margin: 1rem;

                @media(max-width: 425px){

                    height: 90%;

                }

                h2{
                    font-size: 1.6rem;
                    font-weight: 600;
                    color: #ff1a75;

                    margin-bottom: 0.5rem;

                    span.adult-result{
                        font-size: 1.3rem;
                        font-weight: 200;
                        color: #fff;

                        margin-right: 0.5rem;

                        border-radius: 8px;

                        padding: 0.2rem 0.1rem!important;
                        
                        height: inherit;

                        background-color: ${props => props.darkMode ? '#3d3d3d' : '#777777'};

                    }

                    span.launch-year{
                        margin-left: 0.5rem;

                        font-size: 1.4rem;
                        color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#777777'};
                    }

                    @media(max-width: 425px){

                        font-size: 1.4rem;
                        
                    }

                }
                h3{
                    font-size: 1.1rem;
                    font-weight: 300;
                    color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#444444'};

                    /* margin-bottom: 1rem; */
                }
                h3.gogoanime{
                    
                    font-size: 1.3rem;
                    font-weight: 600;

                }

                ul{
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;

                    font-size: 1.2rem;
                    font-weight: 600;
                    color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#555555'};

                    @media(max-width: 425px){

                        margin: 1rem 0;

                    }

                    li:after{
                        white-space: pre;
                        content: ', ';
                    }

                    li:last-child:after{
                        content: ' ';
                    }
                }

                p{
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #ff1a75;
                }
            }
        }
        margin: 1rem 0;
    }

`