import styled from "styled-components";

interface Props {
    hasText: any;
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
        background-color: #f3f2ff;
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

        background-color: #f3f2ff!important;

        border: none;
        border-right: none;
        border-radius: 18px 0 0 18px;

        margin-right: 1rem;

        color: #ff5ebc;

        height: 20px;
        width: auto;

        /* padding: 0.9rem 1rem; */

        *{
            color: #ff5ebc;
        }
    }
       
    input{
        background-color: #f3f2ff;
        outline: 0;
        border: none;
        border-left: none;
        border-radius: 0 0 0 0;

        padding: 0.5rem 1rem;

        height: 30px;

        font-size: 1.6rem;
        font-weight: 400;

        :-webkit-autofill,
        :-webkit-autofill:hover, 
        :-webkit-autofill:focus, 
        :-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px #f3f2ff inset !important;
        }

        :active{
            
            background-color: #f3f2ff;
        }

        :focus{
            background-color: #f3f2ff;
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

        background-color: #f3f2ff;
        padding: 1.1rem;
        border: none;
        border-radius: 0 18px 18px 0;
        font-size: 1.4rem;
    }
    
`

export const SearchResults = styled.div`

    z-index: 1000;

    position: relative;
    
    margin: 1rem 0;
    padding: 1rem;

    background-color: #ffa2c8;

    border-radius: 4px;

    @media(min-width: 620px) and (max-width: 768px){

        display: grid;
        grid-template-columns: auto auto;

    }

    div.heading-search-results{

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        @media(min-width: 620px) and (max-width: 768px){

            justify-content: space-evenly;

        }

        h1{
            font-size: 1.8rem;
            font-weight: 400;
            color: #fff;
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

        width: 300px;

        border-radius: 4px;

        border: 1px solid #ffa2c8;

        @media(max-width: 620px){
            width: -webkit-fill-available;
        }

        :hover{
            border: 1px solid #ff1a75;
        }

        a{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

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
                justify-content: space-around;

                margin: 1rem;

                @media(max-width: 425px){

                    height: 90%;

                }

                h2{
                    font-size: 1.6rem;
                    font-weight: 600;
                    color: #ff1a75;

                    @media(max-width: 425px){

                        font-size: 1.4rem;
                        
                    }

                }
                h3{
                    font-size: 1.1rem;
                    font-weight: 300;
                    color: #444444;

                    margin-bottom: 1rem ;
                }

                ul{
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;

                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #555555;

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