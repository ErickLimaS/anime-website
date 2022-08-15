import Axios from 'axios'
import { userInfo } from 'os'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AlreadyWatchedHistoryPage from '../../../Components/AlreadyWatchedHistotyPage'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import * as C from './styles'

export default function HistoryMediaAdded() {

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const [loading, setLoading] = useState<boolean>(true)
    const [tabIndex, setTabIndex] = useState<number>(0)

    const [alreadyWatchedMedia, setAlreadyWatchedMedia] = useState([])
    const [last30Days, setLast30Days] = React.useState<any[]>([])
    const [last3Months, setLast3Months] = React.useState<any[]>([])
    const [last6Months, setLast6Months] = React.useState<any[]>([])
    const [last1Year, setLast1Year] = React.useState<any[]>([])

    // sort the items within the Date Range Selected
    const sortedDateRange = (item: any, target: string) => {

        // function to set the limit date to sort
        const targetChosed = () => {

            switch (target) {
                case '30 Days':
                    return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate())
                case '3 Months':
                    return new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate())
                case '6 Months':
                    return new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate())
                case '1 Year':
                    return new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
                default:
                    return new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
            }
        }

        // date of the current item 
        const dateToBeProcessed = new Date(item.addedAt)

        // current date
        const currentDate = new Date()

        // receives the target date from the function
        let targetDate: Date = targetChosed();

        // if date is between the Target and Current, it pushs the item to a new array
        if (dateToBeProcessed >= targetDate && dateToBeProcessed <= currentDate) {

            switch (target) {
                case '30 Days':
                    return setLast30Days(oldArray => [...oldArray, item])
                case '3 Months':
                    return setLast3Months(oldArray => [...oldArray, item])
                case '6 Months':
                    return setLast6Months(oldArray => [...oldArray, item])
                case '1 Year':
                    return setLast1Year(oldArray => [...oldArray, item])
                default:
                    return setLast1Year(oldArray => [...oldArray, item])
            }

        }
    }

    useEffect(() => {

        document.title = 'History | AniProject'

        const load = async () => {

            setLoading(true)

            const URL = 'https://cors-anywhere.herokuapp.com/https://animes-website-db.herokuapp.com/users/already-watched-media'

            const { data } = await Axios({
                url: `${URL}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            })

            setAlreadyWatchedMedia(data)

            // sorting date 
            data.forEach((item: any) => {
                
                sortedDateRange(item, '30 Days')
                sortedDateRange(item, '3 Months')
                sortedDateRange(item, '6 Months')
                sortedDateRange(item, '1 Year')

            })

            setLoading(false)

        }
        load()

    }, [])


    return (

        <C.Container tabIndex={tabIndex}>

            <AsideNavLinks />

            <div className='history'>

                {loading ? (

                    <>loading</>

                ) : (
                    <>
                        <div className='heading'>
                            <h1>
                                History
                            </h1>

                            <div className='sort-buttons'>

                                <button type='button' onClick={() => setTabIndex(0)} id='button-tab-0'>
                                    All Time
                                </button>
                                <button type='button' onClick={() => setTabIndex(1)} id='button-tab-1'>
                                    Last 30 Days
                                </button>
                                <button type='button' onClick={() => setTabIndex(2)} id='button-tab-2'>
                                    Last 3 Months
                                </button>
                                <button type='button' onClick={() => setTabIndex(3)} id='button-tab-3'>
                                    Last 6 Months
                                </button>
                                <button type='button' onClick={() => setTabIndex(4)} id='button-tab-4'>
                                    Last 1 Year
                                </button>

                            </div>
                        </div>

                        <div className='content'>
                            {alreadyWatchedMedia != null || undefined ? (
                                <>

                                    <div id='div-tab-0'>
                                        <div className='grid'>

                                            {alreadyWatchedMedia.length > 0 ? (

                                                alreadyWatchedMedia.map((item: any, key: any) => (

                                                    <AlreadyWatchedHistoryPage key={key} data={item} />

                                                ))

                                            ) : (

                                                <div className='no-media'>

                                                    <h1>
                                                        There is no Media Added to your Already Watched List!
                                                    </h1>

                                                    <p>

                                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                                    </p>

                                                    <p>

                                                        Use it as much as you want!

                                                    </p>

                                                </div>

                                            )}

                                        </div>
                                    </div>

                                    <div id='div-tab-1'>
                                        { }
                                        <div className='grid'>

                                            {last30Days.length > 0 ? (

                                                last30Days.map((item: any, key: any) => (

                                                    <AlreadyWatchedHistoryPage key={key} data={item} />

                                                ))

                                            ) : (

                                                <div className='no-media'>

                                                    <h1>
                                                        There is no Media Added to your Already Watched List!
                                                    </h1>

                                                    <p>

                                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                                    </p>

                                                    <p>

                                                        Use it as much as you want!

                                                    </p>

                                                </div>

                                            )}

                                        </div>
                                    </div>

                                    <div id='div-tab-2'>
                                        <div className='grid'>

                                            {last3Months.length > 0 ? (

                                                last3Months.map((item: any, key: any) => (

                                                    <AlreadyWatchedHistoryPage key={key} data={item} />

                                                ))

                                            ) : (

                                                <div className='no-media'>

                                                    <h1>
                                                        There is no Media Added to your Already Watched List!
                                                    </h1>

                                                    <p>

                                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                                    </p>

                                                    <p>

                                                        Use it as much as you want!

                                                    </p>

                                                </div>

                                            )}

                                        </div>
                                    </div>

                                    <div id='div-tab-3'>
                                        <div className='grid'>

                                            {last6Months.length > 0 ? (

                                                last6Months.map((item: any, key: any) => (

                                                    <AlreadyWatchedHistoryPage key={key} data={item} />

                                                ))

                                            ) : (

                                                <div className='no-media'>

                                                    <h1>
                                                        There is no Media Added to your Already Watched List!
                                                    </h1>

                                                    <p>

                                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                                    </p>

                                                    <p>

                                                        Use it as much as you want!

                                                    </p>

                                                </div>

                                            )}

                                        </div>
                                    </div>

                                    <div id='div-tab-4'>
                                        <div className='grid'>

                                            {last1Year.length > 0 ? (

                                                last1Year.map((item: any, key: any) => (

                                                    <AlreadyWatchedHistoryPage key={key} data={item} />

                                                ))

                                            ) : (

                                                <div className='no-media'>

                                                    <h1>
                                                        There is no Media Added to your Already Watched List!
                                                    </h1>

                                                    <p>

                                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                                    </p>

                                                    <p>

                                                        Use it as much as you want!

                                                    </p>

                                                </div>

                                            )}

                                        </div>
                                    </div>
                                </>
                            ) : (

                                <div className='no-items-bookmarked'>

                                    <h2>There's Nothing Marked on Your Bookmarks</h2>

                                    <p>

                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                    </p>

                                    <p>

                                        Use it as much as you want!

                                    </p>

                                </div>

                            )}

                        </div>

                    </>

                )}

            </div>

        </C.Container>

    )
}
