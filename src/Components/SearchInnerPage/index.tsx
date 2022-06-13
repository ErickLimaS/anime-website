import React, { useRef, useState } from 'react'
import * as C from './styles'
import { ReactComponent as SearchSvg } from '../../imgs/svg/search.svg'
import API from '../../API/anilist'

export default function SearchInnerPage() {

    const searchInput: any = useRef()

    const [searchResults, setSearchResults] = useState([])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        const { data } = await API.getSeachResults(searchInput.current.value)
        setSearchResults(data)

        console.log(searchInput.current.value)
    }

    return (
        <C.Container>

            <form onSubmit={(e) => handleSearch(e)}>
                <div>
                    <label htmlFor='search-input' />
                    <SearchSvg id='input-svg' />
                    <input id='search-input' type='text' placeholder='Search' ref={searchInput}></input>
                    <button type='submit'>{' '}<SearchSvg /></button>
                </div>
            </form>

        </C.Container >

    )
}
function preventDefault() {
    throw new Error('Function not implemented.')
}

