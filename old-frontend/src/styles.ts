import styled from 'styled-components'

interface Props {
    darkMode: boolean
}

export const Container = styled.div<Props>`

    background-color: ${props => props.darkMode ? 'var(--bcg-dark-mode)' : 'var(--bcg-light-mode)'};

`