import styled from 'styled-components'

interface Props {

    tabIndex: number,
    handleAvatarImgPanel: boolean
    darkMode: boolean

}

export const Container = styled.div<Props>`

    display: flex;
    flex-direction: row;

    background-color: ${props => props.darkMode ? 'var(bcg-dark-mode)' : 'var(--bcg-light-mode)'};

    div.content{

        width: 100%;
        min-height: 100vh;

        margin-right: 2rem;
        padding: 2rem;

        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 0 20px;

        @media(max-width: 1080px){

            margin: 20px 0;
            padding: 0rem;

            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;

        }

        @media(max-width: 768px){

            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin-right: 0;

        }

        @media(max-width: 620px){

            flex-direction: column;
            justify-content: center;
            align-items: center;

        }
    }

    div.menu{
        
        height: min-content;
        background-color: transparent;

        position: sticky;
        top: 5vh;

        #tab-0{
            
            background-color: ${props => props.darkMode === true && props.tabIndex === 0 && 'var(--brand-color)'};
            background-color: ${props => props.darkMode === true && props.tabIndex !== 0 && 'var(--brand-dark-mode-color)'};

            background-color: ${props => props.darkMode === false && props.tabIndex === 0 && 'var(--brand-color)'};
            background-color: ${props => props.darkMode === false && props.tabIndex !== 0 && 'var(--bcg-light-mode)'};

            color: ${props => props.darkMode === true && props.tabIndex === 0 && '#fff'};
            color: ${props => props.darkMode === true && props.tabIndex !== 0 && 'var(--brand-color)'};

            color: ${props => props.darkMode === false && props.tabIndex === 0 && '#fff'};
            color: ${props => props.darkMode === false && props.tabIndex !== 0 && 'var(--brand-color)'};

        }
        #tab-1{
            
            background-color: ${props => props.darkMode === true && props.tabIndex === 1 && 'var(--brand-color)'};
                        background-color: ${props => props.darkMode === true && props.tabIndex !== 1 && 'var(--brand-dark-mode-color)'};


                        background-color: ${props => props.darkMode === false && props.tabIndex === 1 && 'var(--brand-color)'};
                        background-color: ${props => props.darkMode === false && props.tabIndex !== 1 && 'var(--bcg-light-mode)'};

                        color: ${props => props.darkMode === true && props.tabIndex === 1 && '#fff'};
                        color: ${props => props.darkMode === true && props.tabIndex !== 1 && 'var(--brand-color)'};

                        color: ${props => props.darkMode === false && props.tabIndex === 1 && '#fff'};
                        color: ${props => props.darkMode === false && props.tabIndex !== 1 && 'var(--brand-color)'};
            
        }
        #tab-2{
            
            background-color: ${props => props.darkMode === true && props.tabIndex === 2 && 'var(--brand-color)'};
                        background-color: ${props => props.darkMode === true && props.tabIndex !== 2 && 'var(--brand-dark-mode-color)'};

                        background-color: ${props => props.darkMode === false && props.tabIndex === 2 && 'var(--brand-color)'};
                        background-color: ${props => props.darkMode === false && props.tabIndex !== 2 && 'var(--bcg-light-mode)'};

                        color: ${props => props.darkMode === true && props.tabIndex === 2 && '#fff'};
                        color: ${props => props.darkMode === true && props.tabIndex !== 2 && 'var(--brand-color)'};

                        color: ${props => props.darkMode === false && props.tabIndex === 2 && '#fff'};
                        color: ${props => props.darkMode === false && props.tabIndex !== 2 && 'var(--brand-color)'};
        }
        #tab-3{
            
            background-color: ${props => props.darkMode === true && props.tabIndex === 3 && 'var(--brand-color)'};
                        background-color: ${props => props.darkMode === true && props.tabIndex !== 3 && 'var(--brand-dark-mode-color)'};


                        background-color: ${props => props.darkMode === false && props.tabIndex === 3 && 'var(--brand-color)'};
                        background-color: ${props => props.darkMode === false && props.tabIndex !== 3 && 'var(--bcg-light-mode)'};

                        color: ${props => props.darkMode === true && props.tabIndex === 3 && '#fff'};
                        color: ${props => props.darkMode === true && props.tabIndex !== 3 && 'var(--brand-color)'};

                        color: ${props => props.darkMode === false && props.tabIndex === 3 && '#fff'};
                        color: ${props => props.darkMode === false && props.tabIndex !== 3 && 'var(--brand-color)'};

        }

        @media(max-width: 1080px){
            
            position: initial;

            max-width: 100%;

        }

        @media(max-width: 625px){
            
            width: 100%;

            margin-bottom: 2rem;

        }

        ul{
            width: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            background-color: inherit;

            border: ${props => props.darkMode === false ? '2px solid var(--brand-color)' : 'initial'};
            
            border-radius: 4px;

            
            @media(max-width: 1080px){
                
                display: grid;
                grid-template-columns: repeat(4, 1fr);

            }

            @media(max-width: 625px){
                
                display: flex;
                flex-direction: column;
                align-items: center;

            }

            li{
                cursor: pointer;

                width: 80%;

                padding: 20px;

                font-size: 1.6rem;
                font-weight: 600;
                color: #444444;

                border-bottom: 2px solid var(--brand-color);

                @media(max-width: 1080px){
                    
                    padding: 16px;
                    font-size: 1.4rem;

                    width: 120px;

                    border: none;
                    border-radius: none;

                }

                @media(max-width: 625px){
                    
                    padding: 20px;
                    border-bottom: 2px solid var(--brand-color);
                    width: 80%;

                }

                :hover{

                    background-color: var(--brand-color)!important;
                    color: #fff!important;

                }

                :first-child{

                    border-radius: ${props => props.darkMode === true ? '4px 4px 0 0' : 'initial'};

                    @media(max-width: 1080px){
                    
                        border-radius: 4px 0px 0px 4px;

                    }

                    @media(max-width: 625px){
                    
                        border-radius: ${props => props.darkMode === true ? '4px 4px 0 0' : 'initial'};

                    }
                }


                :last-child{

                    border-bottom: 0;

                    border-radius: ${props => props.darkMode === true ? '0 0 4px 4px' : 'initial'};

                    @media(max-width: 1080px){
                    
                        border-radius: 0px 4px 4px 0px;

                    }

                    @media(max-width: 625px){
                    
                        border-radius: ${props => props.darkMode === true ? '0 0 4px 4px' : 'initial'};

                    }
                    
                }

            }

        }


    }
    
    div#index-1, div#index-2{

        min-height: 50vh;
        max-height: 70vh;
    }
                                                                                            
    .user-info{

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        
        @media(max-width: 1080px){

            width: 100%;

        }

        @media(max-width: 768px){

            width: 100%!important;

        }

        h1{
            margin: 1rem 0;

            color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : 'initial'};
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
                height: 20rem;
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
                    color: var(--brand-color);

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

            overflow: auto;

            ::-webkit-scrollbar {
                    width: 8px;
            }

            ::-webkit-scrollbar-track {
                    background: #f1f1f1; 
            }
                
            ::-webkit-scrollbar-thumb {
                    background: #888;

                    border-radius: 2px;
            }

            ::-webkit-scrollbar-thumb:hover {
                    background: #555; 
            } 

            @media(max-width: 380px){

                width: 70%!important;

            }

            @media(max-width: 768px){

                width: 90%!important;

            }

            opacity: 0.97;
            background-color: #444;
            border-radius: 4px;

            button{
                cursor: pointer;

                margin: 2rem 0;
                padding: 1rem;

                background-color: var(--brand-color);
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
                    
                    img{
                        margin: 1rem;

                        width: 14rem;
                        height: 14rem;

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
                        border: 2px solid var(--brand-color);
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
                    color: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'initial'};
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

    div#index-0{
        display: ${props => props.tabIndex === 0 ? `flex` : 'none'};

    }
    #index-1{

        display: ${props => props.tabIndex === 1 ? `flex` : 'none'};

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

            @media(max-width: 425px){

                font-size: 2.6rem;
                font-weight: 600;

            }
        }

        >div{
            width: inherit;

            padding: 1rem 2rem;
            
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-wrap: wrap;

            background-color: ${props => props.darkMode ? 'var(--black-variant)' : '#ffd0e3'};
            border-radius: 4px;

            *{
                margin: 1rem 0;
            }

            @media(max-width: 620px){
                padding: 1rem;
            }

            label{
                font-size: 2.6rem;
                color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : '#111'};
            }
            h2{
                
                color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : 'initial'}; 
                font-size: 2rem;

            }
            span{
                font-size: 2.2rem;
                color: var(--white);

                @media(max-width: 620px){
                    font-size: 1.6rem;
                }

                @media(max-width: 375px){
                    font-size: 1.2rem;
                }
            }
            button{
                cursor: pointer;

                padding: 1rem;

                border: 0;
                border-radius: 4px;

                background-color: var(--brand-color);

                color: #fff;

                :hover{
                    opacity: 0.85;
                }
            }
        }
    }

    #index-2{

        display: ${props => props.tabIndex === 2 ? `flex` : 'none'};

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

            @media(max-width: 425px){

                font-size: 2.6rem;
                font-weight: 600;

            }

        }
        h2{ 
            color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#ffd0e3'};
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

    #index-3{

        display: ${props => props.tabIndex === 3 ? `flex` : 'none'};

        @media(max-width: 768px){

            margin-top: 2rem;

            padding: 2rem;

            width: 85%!important;

        }

        @media(max-width: 425px){

            padding: 1rem;

            width: 90%!important;

        }

        justify-content: space-evenly;

        border: 2px solid #ffd0e3;
        border-radius: 4px;

        h1{
            font-size: 4rem;

            @media(max-width: 425px){

                font-size: 2.6rem;
                font-weight: 600;

            }

        }
        h2{
            color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : '#ffd0e3'};
            font-size: 2rem;
            font-weight: 400;

            span{
                color: rgb(255, 51, 51);
            }

        }
        button{
            cursor: pointer;

            background-color: #f92f7f;

            padding: 1rem 2rem;

            border: 1px solid #f92f7f;
            border-radius: 4px;

            font-size: 1.6rem;
            color: #fff;

            :hover{
                opacity: 0.9;
            }
        }

        form{
            width: 80%;
            
            @media(max-width: 768px){

                width: 95%;

                margin: 2rem 0;

            }

        }

        .radio-inputs{
            background-color: ${props => props.darkMode ? 'var(--black-variant)' : '#ffdcea'};

            padding: 1rem;

            border-radius: 4px;

            @media(max-width: 425px){

                margin: 2rem 0;

            }

            label{
                color: ${props => props.darkMode ? 'var(--text-grey-variant2)' : '#222222'};
            }
        }

        input[type=radio]{
            margin-right: 2rem;

            transform: scale(1.4);

        }

        small{
            color: ${props => props.darkMode ? 'var(--text-grey-variant)' : 'initial'};
            font-size: 1.4rem;
        }

    }
`