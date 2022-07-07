import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { useDispatch, useSelector } from 'react-redux'
import { addMediaToUserAccount, removeMediaFromUserAccount } from '../../../redux/actions/userActions'

export default function AnimesReleasingThisWeek(data: any) {

    const [isAlreadyAdded, setIsAlreadyAdded] = useState<any>()

    let format;

    switch (data.data.format) {
        case 'TV':
            format = 'anime';
            break;
        case 'MANGA':
            format = 'manga';
            break;
        case 'MOVIE':
            format = 'movie';
            break;
        case 'NOVEL':
            format = 'novel';
            break;
        case 'SPECIAL':
            format = 'special';
            break;
        case 'ONE_SHOT':
            format = 'one-shot';
            break;
        case 'OVA':
            format = 'ova';
            break;
        case 'ONA':
            format = 'ona';
            break;
        default:
            format = 'anime'; //fix exception
            break;
    }

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {

        if (userInfo !== null && userInfo.mediaAdded !== null) {
            userInfo.mediaAdded.find((item: any) => {
                if (item.id === data.data.id) {
                    setIsAlreadyAdded(true)
                }
            })
        }

    }, [isAlreadyAdded, userInfo])

    // add media to user
    const dispatch: any = useDispatch()
    const navigate: any = useNavigate()

    const handleMediaToAccount = () => {

        // console.log(userInfo.name)

        //CHECKS if dont has on user account
        if (isAlreadyAdded == null || undefined) {

            if (userInfo) {

                dispatch(addMediaToUserAccount(userInfo.id, {
                    'addedAt': new Date(),
                    'id': Number(data.data.id),
                    'primaryColor': data.data.coverImage.color ? data.data.coverImage.color : '',
                    'fullTitle': data.data.title.romaji,
                    'nativeTitle': data.data.title.native,
                    'bannerImg': data.data.bannerImage ? data.data.bannerImage : '',
                    'coverImg': data.data.coverImage.large ? data.data.coverImage.large : data.data.coverImage.extraLarge || data.data.coverImage.medium,
                    'format': data.data.format,
                    'type': data.data.type,
                    'status': data.data.status,
                    'isAdult': Boolean(data.data.isAdult)
                }))

                setIsAlreadyAdded(true)

            }
            else {

                navigate('/login')

            }


        }
        else {

            //remove dispatch 
            dispatch(removeMediaFromUserAccount(userInfo.id, {

                'id': Number(data.data.id)

            }))

            setIsAlreadyAdded(null)


        }

    }

    return (

        <C.AnimeToBeListed info={data.data} isAlreadyAdded={isAlreadyAdded}>

            <div className='add-button'>
                <button type='button' onClick={() => handleMediaToAccount()}>
                    {isAlreadyAdded == null && (<PlusSvg />)}
                    {isAlreadyAdded && (<CheckSvg fill='#ff7fb2' />)}
                </button>
            </div>

            <div className='see-more-button'>
                {data.data.title.romaji.length > 25 ? (
                    <div className='name-fade'>
                        <h1>{data.data.title.romaji.slice(0, 25)}... ({format.toUpperCase()})</h1>
                        {/* <Score data={data.data.averageScore} /> */}
                    </div>

                ) : (
                    <>
                        <div className='name-fade'>
                            <h1>{data.data.title.romaji} ({format.toUpperCase()})</h1>
                            {/* <Score data={data.data.averageScore} /> */}
                        </div>

                    </>
                )}
                <Link to={`/${format}/${data.data.id}`}>See More</Link>
            </div>
        </C.AnimeToBeListed>
    )
}
