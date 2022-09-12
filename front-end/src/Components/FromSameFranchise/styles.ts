import styled from "styled-components";

interface Props {
    darkMode: boolean
}

export const Container = styled.div<Props>`

margin-top: 1rem;
border-top: 4px solid var(--pink-variant-1);

.heading-section{

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media(max-width: 768px){

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    h2{
        font-size: 2rem;
        font-weight: 600;
        margin: 2rem 0;
        color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#222222'};
    
        span{
            color: var(--pink-variant-1);
        }
    }

    >span{

        font-size: 1.4rem;
        color: ${props => props.darkMode ? 'var(--text-grey-variant)' : '#222222'};
        /* border-bottom: 1px solid var(--text-grey-variant); */

    }

}
ul{
    overflow: auto;
    /* width: 110vh; */
    display: flex;
    flex-direction: row;

    @media(max-width: 1080px){
        width: auto;
    }

    @media(min-width: 1080px){
        ::-webkit-scrollbar {
            height: 0px;
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
    }
}

`