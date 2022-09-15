import * as C from './styles'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import { useSelector } from 'react-redux'
import API from '../../../API/anilist'


export default function NavButtons({ param, section, mediaFormat, indexPageReleasingThisWeek, setIndexPageTopRated, setLoadingSectionTopRated, indexPageTopRated, setTopRated, setLoadingSectionReleasingThisWeek, setReleasingThisWeek, setIndexPageReleasingThisWeek, topRated, releasingThisWeek }: any) {

    //handles button navigation through results to topRated and Releasing sections
    const handleSectionPreviousPage = async (section: String, mediaType: String, mediaFormat?: String) => {

        switch (section) {

            case 'top-rated':
                setLoadingSectionTopRated(true)

                let page;

                if (indexPageTopRated <= 1) {
                    page = 1
                    setIndexPageTopRated(1)
                }
                else {
                    page = indexPageTopRated - 1
                    setIndexPageTopRated(indexPageTopRated - 1)
                }

                const data = await API.getTopRated(mediaType, mediaFormat && mediaFormat, page);
                setTopRated(data)

                setLoadingSectionTopRated(false)
                break;

            case 'releasing-this-week':
                setLoadingSectionReleasingThisWeek(true)

                let page1

                if (indexPageReleasingThisWeek <= 1) {
                    page1 = 1
                    setIndexPageReleasingThisWeek(1)
                }
                else {
                    page1 = indexPageReleasingThisWeek - 1
                    setIndexPageReleasingThisWeek(indexPageReleasingThisWeek - 1)
                }

                const data1 = await API.getReleasingThisWeek(mediaType, mediaFormat && mediaFormat, page1);
                setReleasingThisWeek(data1)

                setLoadingSectionReleasingThisWeek(false)
                break;

        }

    }

    //handles button navigation through results to topRated and Releasing sections
    const handleSectionNextPage = async (section: String, mediaType: String, mediaFormat?: String) => {

        switch (section) {

            case 'top-rated':
                setLoadingSectionTopRated(true)

                const page = indexPageTopRated + 1
                setIndexPageTopRated(indexPageTopRated + 1)

                const data = await API.getTopRated(mediaType, mediaFormat && mediaFormat, page);
                setTopRated(data)

                setLoadingSectionTopRated(false)
                break;

            case 'releasing-this-week':
                setLoadingSectionReleasingThisWeek(true)

                const page1 = indexPageReleasingThisWeek + 1
                setIndexPageReleasingThisWeek(indexPageReleasingThisWeek + 1)

                const data1 = await API.getReleasingThisWeek(mediaType, mediaFormat && mediaFormat, page1);
                setReleasingThisWeek(data1)

                setLoadingSectionReleasingThisWeek(false)
                break;

        }

    }

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    return (
        <C.NavButtons darkMode={darkMode}>
            <button
                type='button'
                disabled={
                    (param === 'releasing-this-week' &&
                        indexPageReleasingThisWeek === 1 ? true : false) ||
                    (param === 'top-rated' &&
                        indexPageTopRated === 1 ? true : false)
                }
                onClick={() => handleSectionPreviousPage(param, section, mediaFormat)}
            >
                <AngleLeftSolidSvg />
            </button>

            <button
                type='button'
                disabled={
                    (param === 'releasing-this-week' &&
                        releasingThisWeek && releasingThisWeek.length !== 4 ? true : false
                    ) ||
                    (param === 'top-rated' &&
                        topRated && topRated.length !== 3 ? true : false
                    )
                }
                onClick={() => handleSectionNextPage(param, section, mediaFormat)}
            >
                <AngleRightSolidSvg />
            </button>
        </C.NavButtons>
    )
}
