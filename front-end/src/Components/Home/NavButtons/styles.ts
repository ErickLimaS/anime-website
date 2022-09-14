import styled from 'styled-components'

interface itemData {
    // info: any;
    darkMode: boolean
}

export const NavButtons = styled.div<itemData>`

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
                            border: ${props => props.darkMode ? '1px solid var(--text-grey-variant2)' : '1px solid #c0c0c0'};

                            svg{
                                width: 0.7rem;
                                height: auto;

                                fill: ${props => props.darkMode ? 'var(--text-grey-variant2)' : '#444'};
                            }

                            :hover{
                                border: 1px solid #999999;
                            }

                        }

                        button[disabled]{
                            cursor: default;

                            opacity: 0.5;
                            
                            border-color: #dddddd;

                            svg{
                                ${props => props.darkMode ? 'var(--text-grey-variant)!important' : '#444!important'};
                            }

                        }
                        

`
