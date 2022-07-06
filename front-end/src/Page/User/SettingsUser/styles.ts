import styled from 'styled-components'

interface Props {

    tabIndex: number,
    handleAvatarImgPanel: boolean

}

export const Container = styled.div<Props>`

    display: flex;
    flex-direction: row;

    background-color: #fafafa;

    div.content{

        width: -webkit-fill-available;

        margin: 0 2rem;
        padding: 2rem 0;

        display: flex;
        flex-direction: row;
        justify-content: space-around;

        border-left: 2px solid #e6e6e6;

        @media(max-width: 768px){

            flex-direction: column;
            justify-content: center;
            align-items: center;

        }

        @media(max-width: 620px){

            border-left: 0;

            flex-direction: column;
            justify-content: center;
            align-items: center;

        }
    }

    .menu-profile{
        
        width: 20%;

        height: min-content;
        background-color: transparent;

        position: sticky;
        top: 5vh;

        @media(max-width: 768px){
            
            position: initial;

            width: 80%;

        }

        @media(max-width: 620px){
            
            position: initial;

            width: 100%;

            margin-bottom: 2rem;

        }

        ul{
            width: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            background-color: #ffd0e3;
            border-radius: 4px;

            li{
                cursor: pointer;

                width: -webkit-fill-available;
                height: 100%;

                padding: 2rem;

                font-size: 1.6rem;
                font-weight: 600;
                color: #444444;

                border-bottom: 2px solid #ff1a75;

                :hover{

                    background-color: #ff1a75;
                    color: #fff;

                }

                :first-child{

                    :hover{

                        border-radius: 4px 4px 0 0;

                    }
                }


                :last-child{

                    border-bottom: 0;

                    :hover{
                        
                        border-radius: 0 0 4px 4px;
                    }
                    
                }

            }

        }


    }

    div#index-0{
        display: ${props => props.tabIndex === 0 ? `flex` : 'none'};
    }
    div#index-1{
        display: ${props => props.tabIndex === 1 ? `flex` : 'none'};
    }
    div#index-2{
        display: ${props => props.tabIndex === 2 ? `flex` : 'none'};
    }

    div#index-0, div#index-1, div#index-2{

        width: 60%;

    }

    .user-info{

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        @media(max-width: 768px){

            width: 100%!important;

        }

        h1{
            margin: 1rem 0;

            font-size: 3rem;
            font-weight: 400;
        }


        .user-avatar{

            margin: 1rem 0;

            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            :hover{
                    
                img{
                    
                    opacity: 0.3;

                }

                div.middle{

                    opacity: 1;

                }

            }

            img{

                cursor: pointer;

                width: 20rem;
                height: auto;
                border-radius: 50%;
                backface-visibility: hidden;
                opacity: 1;

                transition: all ease-in 0.1s;
            }

            >div{
                
                cursor: pointer;

                display: flex;
                justify-content: center;
                align-items: center;

                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;

                width: 100%;

                span{

                    font-size: 1.8rem;
                    color: #ff1a75;

                }

            }

        }

        .avatar-img-panel{

            display: ${props => props.handleAvatarImgPanel ? 'flex' : 'none'};
            flex-direction: column;
            align-items: center;

            position: absolute;

            width: inherit;
            height: 100vh;

            @media(max-width: 380px){

                width: 70%!important;

            }

            @media(max-width: 768px){

                width: 90%!important;

            }

            opacity: 0.93;
            background-color: #444;
            border-radius: 4px;

            button{
                cursor: pointer;

                margin: 2rem 0;
                padding: 1rem;

                background-color: #ff1a75;
                border: 0;
                border-radius: 4px;
                
                font-size: 1.8rem;
                color: #fafafa;

                :hover{
                    opacity: 0.9;
                }
            }

            .imgs{
                display: grid;
                grid-template-columns: auto auto auto;
                justify-content: center;
                gap: 1rem;

                @media(max-width: 620px){
                    grid-template-columns: auto auto;
                }

                >div{
                    cursor: pointer;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    
                    border: 2px solid transparent;

                    img{
                        margin: 1rem;

                        width: 20rem;
                        height: auto;

                        border-radius: 50%;

                        @media(max-width: 1120px){
                            width: 15rem;
                        }
                        @media(max-width: 880px){
                            width: 12rem;
                        }
                        @media(max-width: 620px){
                            width: 12rem;
                        }
                    }
                    small{
                        font-size: 1.4rem;
                        color: #fafafa;
                    }

                    :hover{
                        border: 2px solid #ff1a75;
                        border-radius: 4px;
                    }
                }

                

            }

        }

        form{

            width: 100%;

            >div{
                
                width: auto;
                margin: 1rem;

                display: flex;
                flex-direction: column;

                label{
                    font-size: 1.8rem;
                    font-weight: 400;
                }
                input{

                    padding:  1rem;

                    border: 1px solid #c0c0c0;
                    border-radius: 4px;
                    outline: 0;

                    font-size: 1.8rem;
                }
                button{
                    cursor: pointer;

                    margin: 2rem 0;

                    padding: 1.2rem 1rem;

                    background-color: rgb(255, 82, 151);
                    border: 0;
                    border-radius: 4px;

                    font-size: 1.8rem;
                    color: #fff;

                    transition: all ease-in 0.2s;

                    :hover{
                        box-shadow: 0px 0px 10px 0px #777777;
                    }

                }

            }

        }

    }

    #index-1{

        @media(max-width: 768px){

            margin-top: 2rem;

            padding: 2rem;

            width: 80%!important;

        }

        justify-content: space-evenly;

        border: 2px solid #ffd0e3;
        border-radius: 4px;

        h1{
            font-size: 4rem;
        }

        >div{
            width: min-content;

            padding: 1rem 2rem;
            
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-wrap: wrap;

            background-color: #ffd0e3;
            border-radius: 4px;

            *{
                margin: 1rem 0;
            }

            @media(max-width: 620px){
                padding: 1rem;
            }

            label{
                font-size: 2.6rem;
                color: #111;
            }
            h2{
                font-size: 2.2rem;
                color: #222222;

                @media(max-width: 620px){
                    font-size: 1.6rem;
                }
            }
            button{
                padding: 1rem;

                border: 0;
                border-radius: 4px;

                background-color: #ff1a75;

                color: #fff;
            }
        }
    }

    #index-2{

        @media(max-width: 768px){

            margin-top: 2rem;

            padding: 2rem;

            width: 80%!important;

        }

        justify-content: space-evenly;

        border: 2px solid #ffd0e3;
        border-radius: 4px;

        h1{
            font-size: 4rem;
        }
        h2{
            font-size: 2rem;
            font-weight: 400;
        }
        button{
            cursor: pointer;

            background-color: #ff3333;

            padding: 1rem 2rem;

            border: 1px solid #ff1a1a;
            border-radius: 4px;

            font-size: 1.6rem;
            color: #fff;

            :hover{
                opacity: 0.9;
            }
        }

    }

`