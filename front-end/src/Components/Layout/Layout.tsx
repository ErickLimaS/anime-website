import React from 'react'
import AsideNavLinks from './AsideNavLinks'
import * as C from './styles'

function Layout({ children }: any) {
    return (
        <C.Layout>

            <AsideNavLinks />

            <C.MainContent>
                {children}
            </C.MainContent>

        </C.Layout>
    )
}

export default Layout