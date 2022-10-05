import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import AlreadyWatchedHistoryPage from '../../../Components/AlreadyWatchedHistotyPage'
import { logoutUser } from '../../../redux/actions/userActions'
import * as C from './styles'

export default function HistoryMediaAdded() {

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

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

                    for (let i = 0; i < last30Days.length; i++) {
                        console.log(last30Days)

                        if (last30Days[i].fullTitle === item.fullTitle) {
                            return last30Days
                        }


                    }


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

    const dispatch: any = useDispatch()

    useEffect(() => {

        window.scrollTo(0, 0);
        document.title = 'History | AniProject'

        const load = async () => {

            setLoading(true)

            try {

                const URL = 'https://animes-website-db.herokuapp.com/users/already-watched-media'

                const { data } = await Axios({
                    url: `${URL}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                })

                // all data, no sorting
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
            catch (error: any) {

                //store current media url to redirect if user is not logged in
                const redirect = window.location.pathname ? `${window.location.pathname}` : ''

                switch (error.response.status) {
                    case 403: //CORS
                        Swal.fire({

                            icon: 'info',
                            title: 'Error',
                            titleText: `${error.response.status}: Before Doing It!`,
                            text: 'First, we need you to activate what makes our DataBase works. Enter on The Link below and Try Again!',
                            allowOutsideClick: false,
                            footer: 'https://cors-anywhere.herokuapp.com/',
                            didClose: () => {
                                window.location.reload()
                            }
                        })
                        break
                    case 401: //TOKEN VALIDATION/EXPIRATION
                        Swal.fire({
                            icon: 'warning',
                            title: 'Security First!',
                            titleText: `${error.response.status}: Security First!`,
                            text: 'You Will Need To Login Again So We Will Make Your Account Secure!',
                            allowOutsideClick: false,
                            didClose: () => {

                                dispatch(logoutUser())
                                window.location.href = redirect !== '' ? `/login?redirect=${redirect.slice(1, redirect.length)}` : '/login'

                            }
                        })
                        break
                    default:
                        Swal.fire({

                            icon: 'error',
                            title: 'Error',
                            titleText: `${error.response.status}: Something Happen!`,
                            text: "We Don't Know What Happen. But Try Again!",
                            footer: 'Or report this on My GitHub: www.github.com/ErickLimaS',
                            didClose: () => {
                                window.location.reload()
                            }

                        })
                        break
                }

            }

        }
        load()

    }, [])


    return (

        <C.Container
            tabIndex={tabIndex}
            darkMode={darkMode}
        >

            <div className='history'>

                {loading ? (

                    <>

                        <div className='loading-skeleton-heading '></div>

                        <div className='loading-skeleton'></div>
                        <div className='loading-skeleton'></div>
                        <div className='loading-skeleton'></div>

                    </>

                ) : (
                    <>
                        <div className='heading'>
                            <h1>
                                History
                            </h1>

                            <div className='sort-buttons'>

                                <button type='button'
                                    name={`All Time (${alreadyWatchedMedia.length}`}
                                    onClick={() => setTabIndex(0)} 
                                    data-btn-tab="0"
                                >
                                    All Time ({alreadyWatchedMedia.length})
                                </button>

                                <button type='button'
                                    name={`Last 30 Days (${last30Days.length}`}
                                    onClick={() => setTabIndex(1)}
                                    data-btn-tab="1"
                                >
                                    Last 30 Days ({last30Days.length})
                                </button>

                                <button type='button'
                                    name={`Last 3 Months (${last3Months.length}`}
                                    onClick={() => setTabIndex(2)}
                                    data-btn-tab="2"
                                >
                                    Last 3 Months ({last3Months.length})
                                </button>

                                <button type='button'
                                    name={`Last 6 Months (${last6Months.length}`}
                                    onClick={() => setTabIndex(3)}
                                    data-btn-tab="3"
                                >
                                    Last 6 Months ({last6Months.length})
                                </button>

                                <button
                                    type='button'
                                    name={`Last 1 Year (${last1Year.length}`}
                                    onClick={() => setTabIndex(4)}
                                    data-btn-tab="4"
                                >
                                    Last 1 Year ({last1Year.length})
                                </button>

                            </div>
                        </div>

                        <div className='content'>
                            {alreadyWatchedMedia != null || undefined ? (
                                <>

                                    <div data-tab="0" >
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

                                    <div data-tab="1">
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

                                    <div data-tab="2">
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

                                    <div data-tab="3">
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

                                    <div data-tab="4">
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

                                    <h2>There's Nothing Marked on Your History</h2>

                                    <p>

                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it as already watched.

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
