import express from "express";
import bcrypt from 'bcrypt'
import Axios from "axios"
import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router()

//REGISTER
userRouter.post('/register', expressAsyncHandler(async (req, res) => {

    const emailExist = await User.findOne({ email: req.body.email })

    if (emailExist) {
        return res.status(409).send('Email Already Registered.')
    }

    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            showAdultContent: false,
            avatarImg: 'https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg', // temporary
            createdAt: new Date(),
            updatedAt: new Date()
        })

        user.save()

        res.status(201).send({

            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            showAdultContent: user.showAdultContent,
            mediaAdded: [],
            alreadyWatched: [],
            episodesAlreadyWatched: [],
            episodesBookmarked: [],
            token: generateToken(user)

        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send()
    }

}))

//LOGIN
userRouter.post('/login', expressAsyncHandler(async (req, res) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).send("Email Not Registered.")
    }

    try {

        const passwordIsCorrect = await bcrypt.compare(req.body.password, user.password)

        if (passwordIsCorrect) {

            return res.status(200).send({

                id: user._id,
                name: user.name,
                avatarImg: user.avatarImg,
                mediaAdded: user.mediaAdded,
                showAdultContent: user.showAdultContent,
                alreadyWatched: user.alreadyWatched,
                episodesAlreadyWatched: user.episodesAlreadyWatched,
                episodesBookmarked: user.episodesBookmarked,
                updatedAt: user.updatedAt,
                token: generateToken(user)

            })

        }
        else {
            return res.status(400).send("Password Don't match.")
        }

    }
    catch (error) {
        console.log(error)
        return res.status(500).send()
    }

}))

//ENABLE/DISABLE ADULT CONTENT ON RESULTS
userRouter.put('/change-adult-content-option', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send('User Not Found')
    }

    try {
        user.showAdultContent = !user.showAdultContent

        user.save()

        return res.status(200).send({

            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded,
            showAdultContent: user.showAdultContent,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)
            
        })
    }
    catch (error) {

        return res.status(500).send('Internal Error')

    }

}))

//GET USER'S BOOKMARKED MEDIA
userRouter.get('/media', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send("User Don't Exist.")
    }

    try {

        return res.status(200).send({

            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded,
            showAdultContent: user.showAdultContent,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send(user)
    }

}))

//ADD MEDIA TO USER
userRouter.post('/add-media', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send("User Don't Exist.")
    }

    try {

        user.mediaAdded.push(req.body.media)

        await user.save()

        return res.status(201).send({

            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded,
            showAdultContent: user.showAdultContent,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)

        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send(user)
    }

}))

//REMOVE MEDIA FROM USER 
// **** CHANGE TO PUT
userRouter.post('/remove-media', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send("User Don't Exist.")
    }

    try {

        const newUserMediaList = user.mediaAdded.filter(item => {
            return item.id !== req.body.media.id
        })

        user.mediaAdded = newUserMediaList

        await user.save()

        return res.status(202).send({

            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            showAdultContent: user.showAdultContent,
            mediaAdded: user.mediaAdded,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)

        })


    }
    catch (error) {
        console.log(error)
        return res.status(500).send()
    }

}))

//UPDATE USER PROFILE
userRouter.put('/update-user-profile', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send(`User Don't Exist`)
    }

    const comparePassword = await bcrypt.compare(req.body.currentPassword, user.password)

    if (!comparePassword) {
        return res.status(400).send('Wrong Current Password')
    }

    try {

        if (comparePassword) {

            if (req.body.name !== '') {

                user.name = req.body.name

            }
            if (req.body.email !== '') {

                user.email = req.body.email

            }
            if (req.body.newPassword !== '') {

                user.password = await bcrypt.hash(req.body.newPassword, 10)

            }

            user.save()

            return res.status(200).send({
                id: user._id,
                name: user.name,
                avatarImg: user.avatarImg,
                showAdultContent: user.showAdultContent,
                mediaAdded: user.mediaAdded,
                alreadyWatched: user.alreadyWatched,
                episodesAlreadyWatched: user.episodesAlreadyWatched,
                episodesBookmarked: user.episodesBookmarked,
                updatedAt: user.updatedAt,
                token: generateToken(user)
            })

        }
    }
    catch (error) {

        return res.status(500).send(`${error}`)

    }

}))

//ADD TO MEDIA ALREADY WATCHED
userRouter.post('/add-already-watched', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id, '-password -email')

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found / Dont Exist' })
    }

    try {

        // CHECKS IF MEDIA WAS PREVIOUSLY ADDED TO WATCHED
        if (req.body.media.fromGoGoAnime === true) {

            const alreadyExist = user.alreadyWatched.find(item => item.idGoGoAnime === req.body.media.idGoGoAnime)

            if (alreadyExist) {

                return res.status(409).send({ msg: 'Already Added' })

            }

        }
        else {

            const alreadyExist = user.alreadyWatched.find(item => item.id === req.body.media.id)

            if (alreadyExist) {

                return res.status(409).send({ msg: 'Already Added' })

            }
        }

        user.alreadyWatched.push(req.body.media)

        await user.save()

        return res.status(201).send({
            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            showAdultContent: user.showAdultContent,
            mediaAdded: user.mediaAdded,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)
        })

    }
    catch (error) {

        return res.status(500).send(error)

    }

}))

//REMOVE MEDIA FROM ALREADY WATCHED
userRouter.put('/remove-already-watched', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id, '-password -email')

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found / Dont Exist' })
    }

    try {

        // CHECKS TYPE OF MEDIA THEN FILTER ONLY THE ONE THE ID MATCHS ON AlreadyWatched
        if (req.body.media.fromGoGoAnime === true) {

            const newAlreadyWatched = user.alreadyWatched.filter(item => item.idGoGoAnime != req.body.media.idGoGoAnime)

            user.alreadyWatched = newAlreadyWatched

            await user.save()

            return res.status(200).send({
                id: user._id,
                name: user.name,
                avatarImg: user.avatarImg,
                showAdultContent: user.showAdultContent,
                mediaAdded: user.mediaAdded,
                alreadyWatched: user.alreadyWatched,
                episodesAlreadyWatched: user.episodesAlreadyWatched,
                episodesBookmarked: user.episodesBookmarked,
                updatedAt: user.updatedAt,
                token: generateToken(user)
            })

        }
        else {

            const newAlreadyWatched = user.alreadyWatched.filter(item => item.id != req.body.media.id)

            user.alreadyWatched = newAlreadyWatched

            await user.save()

            return res.status(200).send({
                id: user._id,
                name: user.name,
                avatarImg: user.avatarImg,
                mediaAdded: user.mediaAdded,
                alreadyWatched: user.alreadyWatched,
                episodesAlreadyWatched: user.episodesAlreadyWatched,
                episodesBookmarked: user.episodesBookmarked,
                token: generateToken(user)
            })

        }

    }
    catch (error) {

        return res.status(500).send(error)

    }

}))

//ADD TO EPISODES ALREADY WATCHED
userRouter.post('/add-episode-already-watched', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id, '-password -email')

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found / Dont Exist' })
    }

    try {

        // CHECKS MEDIA ORIGIN
        if (req.body.media.fromGoGoAnime === true) {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO WATCHED
            const alreadyExist = user.episodesAlreadyWatched.find(
                item => item.idGoGoAnime === req.body.media.idGoGoAnime
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {
                    return res.status(409).send({ msg: 'Already Added' })
                }
                else {

                    user.episodesAlreadyWatched.find(item => {
                        if (item.idGoGoAnime === req.body.media.idGoGoAnime) {
                            item.episodes.push(req.body.media.episodes)
                        }
                    })

                    await user.save()

                    return res.status(201).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        updatedAt: user.updatedAt,
                        token: generateToken(user)

                    })

                }

            }
            else {
                user.episodesAlreadyWatched.push(req.body.media)

                await user.save()

                return res.status(201).send({

                    id: user._id,
                    name: user.name,
                    avatarImg: user.avatarImg,
                    showAdultContent: user.showAdultContent,
                    mediaAdded: user.mediaAdded,
                    alreadyWatched: user.alreadyWatched,
                    episodesAlreadyWatched: user.episodesAlreadyWatched,
                    episodesBookmarked: user.episodesBookmarked,
                    token: generateToken(user)

                })
            }

        }
        else {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO WATCHED
            const alreadyExist = user.episodesAlreadyWatched.find(
                item => item.id === req.body.media.id
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {
                    return res.status(409).send({ msg: 'Already Added' })
                }
                else {

                    user.episodesAlreadyWatched.find(item => {
                        if (item.id === req.body.media.id) {
                            item.episodes.push(req.body.media.episodes)
                        }
                    })

                    await user.save()

                    return res.status(201).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        token: generateToken(user)

                    })

                }
            }
            else {
                user.episodesAlreadyWatched.push(req.body.media)

                await user.save()

                return res.status(201).send({

                    id: user._id,
                    name: user.name,
                    avatarImg: user.avatarImg,
                    showAdultContent: user.showAdultContent,
                    mediaAdded: user.mediaAdded,
                    alreadyWatched: user.alreadyWatched,
                    episodesAlreadyWatched: user.episodesAlreadyWatched,
                    episodesBookmarked: user.episodesBookmarked,
                    token: generateToken(user)

                })
            }

        }

    }
    catch (error) {

        return res.status(500).send(error)

    }

}))

//REMOVE EPISODES FROM ALREADY WATCHED
userRouter.put('/remove-episode-already-watched', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id, '-password -email')

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found / Dont Exist' })
    }

    try {

        // CHECKS MEDIA ORIGIN
        if (req.body.media.fromGoGoAnime === true) {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO WATCHED
            const alreadyExist = user.episodesAlreadyWatched.find(
                item => item.idGoGoAnime === req.body.media.idGoGoAnime
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {

                    const newEpisodeList = alreadyExist.episodes.filter(item =>
                        item.episodeId !== req.body.media.episodes.episodeId
                    )

                    user.episodesAlreadyWatched.find(item => {
                        if (item.idGoGoAnime === req.body.media.idGoGoAnime) {
                            item.episodes = newEpisodeList
                        }
                    })

                    await user.save()

                    return res.status(200).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        updatedAt: user.updatedAt,
                        token: generateToken(user)

                    })

                }
                else {

                    return res.status(404).send({ msg: 'Episode Not Found' })

                }

            }
            else {

                return res.status(404).send({ msg: 'Media From This Episode Not Found' })

            }

        }
        else {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO WATCHED
            const alreadyExist = user.episodesAlreadyWatched.find(
                item => item.id === req.body.media.id
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {

                    const newEpisodeList = alreadyExist.episodes.filter(item =>
                        item.episodeId !== req.body.media.episodes.episodeId
                    )

                    user.episodesAlreadyWatched.find(item => {
                        if (item.id === req.body.media.id) {
                            item.episodes = newEpisodeList
                        }
                    })

                    await user.save()

                    return res.status(200).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        token: generateToken(user)

                    })

                }
                else {

                    return res.status(404).send({ msg: 'Episode Not Found' })

                }

            }
            else {

                return res.status(404).send({ msg: 'Media From This Episode Not Found' })

            }

        }

    }
    catch (error) {

        return res.status(500).send(error)

    }

}))

//ADD TO BOOKMARKED EPISODES 
userRouter.post('/add-episode-to-bookmarks', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id, '-password -email')

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found / Dont Exist' })
    }

    try {

        // CHECKS MEDIA ORIGIN
        if (req.body.media.fromGoGoAnime === true) {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO BOOKMARKS
            const alreadyExist = user.episodesBookmarked.find(
                item => item.idGoGoAnime === req.body.media.idGoGoAnime
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyBookmarked = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyBookmarked) {
                    return res.status(409).send({ msg: 'Already Added' })
                }
                else {

                    user.episodesBookmarked.find(item => {
                        if (item.idGoGoAnime === req.body.media.idGoGoAnime) {
                            item.episodes.push(req.body.media.episode)
                        }
                    })

                    await user.save()

                    return res.status(201).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        updatedAt: user.updatedAt,
                        token: generateToken(user)

                    })

                }

            }
            else {
                user.episodesBookmarked.push(req.body.media)

                await user.save()

                return res.status(201).send({

                    id: user._id,
                    name: user.name,
                    avatarImg: user.avatarImg,
                    showAdultContent: user.showAdultContent,
                    mediaAdded: user.mediaAdded,
                    alreadyWatched: user.alreadyWatched,
                    episodesAlreadyWatched: user.episodesAlreadyWatched,
                    episodesBookmarked: user.episodesBookmarked,
                    token: generateToken(user)

                })
            }

        }
        else {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO BOOKMARKS
            const alreadyExist = user.episodesBookmarked.find(
                item => item.id === req.body.media.id
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {
                    return res.status(409).send({ msg: 'Already Added' })
                }
                else {

                    user.episodesBookmarked.find(item => {
                        if (item.id === req.body.media.id) {
                            item.episodes.push(req.body.media.episodes)
                        }
                    })

                    await user.save()

                    return res.status(201).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        token: generateToken(user)

                    })

                }
            }
            else {
                user.episodesBookmarked.push(req.body.media)

                await user.save()

                return res.status(201).send({

                    id: user._id,
                    name: user.name,
                    avatarImg: user.avatarImg,
                    showAdultContent: user.showAdultContent,
                    mediaAdded: user.mediaAdded,
                    alreadyWatched: user.alreadyWatched,
                    episodesAlreadyWatched: user.episodesAlreadyWatched,
                    episodesBookmarked: user.episodesBookmarked,
                    token: generateToken(user)

                })
            }

        }

    }
    catch (error) {

        return res.status(500).send(error)

    }

}))

//REMOVE FROM BOOKMARKED EPISODES
userRouter.put('/remove-episode-from-bookmarks', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id, '-password -email')

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found / Dont Exist' })
    }

    try {

        // CHECKS MEDIA ORIGIN
        if (req.body.media.fromGoGoAnime === true) {

            // CHECKS IF EPISODE'S ANIME TITLE WAS PREVIOUSLY ADDED TO BOOKMARKS
            const alreadyExist = user.episodesBookmarked.find(
                item => item.idGoGoAnime === req.body.media.idGoGoAnime
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {

                    const newEpisodeList = alreadyExist.episodes.filter(item =>
                        item.episodeId !== req.body.media.episodes.episodeId
                    )

                    user.episodesBookmarked.find(item => {
                        if (item.idGoGoAnime === req.body.media.idGoGoAnime) {
                            item.episodes = newEpisodeList
                        }
                    })

                    await user.save()

                    return res.status(200).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        updatedAt: user.updatedAt,
                        token: generateToken(user)

                    })

                }
                else {

                    return res.status(404).send({ msg: 'Episode Not Found' })

                }

            }
            else {

                return res.status(404).send({ msg: 'Media From This Episode Not Found' })

            }

        }
        else {

            // CHECKS IF MEDIA WAS PREVIOUSLY ADDED TO WATCHED
            const alreadyExist = user.episodesBookmarked.find(
                item => item.id === req.body.media.id
            )

            if (alreadyExist) {

                // CHECKS IF EPISODE WAS PREVEOUSLY ADDED
                const episodeAlreadyWatched = alreadyExist.episodes.find(
                    item => item.episodeId === req.body.media.episodes.episodeId
                )

                if (episodeAlreadyWatched) {

                    const newEpisodeList = alreadyExist.episodes.filter(item =>
                        item.episodeId !== req.body.media.episodes.episodeId
                    )

                    user.episodesBookmarked.find(item => {
                        if (item.id === req.body.media.id) {
                            item.episodes = newEpisodeList
                        }
                    })
                    await user.save()

                    return res.status(200).send({

                        id: user._id,
                        name: user.name,
                        avatarImg: user.avatarImg,
                        showAdultContent: user.showAdultContent,
                        mediaAdded: user.mediaAdded,
                        alreadyWatched: user.alreadyWatched,
                        episodesAlreadyWatched: user.episodesAlreadyWatched,
                        episodesBookmarked: user.episodesBookmarked,
                        token: generateToken(user)

                    })

                }
                else {

                    return res.status(404).send({ msg: 'Episode Not Found' })

                }

            }
            else {

                return res.status(404).send({ msg: 'Media From This Episode Not Found' })

            }

        }

    }
    catch (error) {

        return res.status(500).send(error)

    }

}))

//CHANGE USER AVATAR IMAGE
userRouter.put('/change-user-avatar-image', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send('User Not Found')
    }

    try {

        user.avatarImg = req.body.newAvatarImg

        user.save()

        return res.status(200).send({
            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            showAdultContent: user.showAdultContent,
            mediaAdded: user.mediaAdded,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)
        })

    }
    catch (error) {
        return res.status(500).send(error)
    }

}))

//ERASE MEDIA DATA
userRouter.put('/erase-media-added-data', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).send('User Not Found')
    }

    try {

        user.mediaAdded = user.mediaAdded.splice(0, 0)

        user.save()

        return res.status(200).send({
            id: user._id,
            name: user.name,
            avatarImg: user.avatarImg,
            showAdultContent: user.showAdultContent,
            mediaAdded: user.mediaAdded,
            alreadyWatched: user.alreadyWatched,
            episodesAlreadyWatched: user.episodesAlreadyWatched,
            episodesBookmarked: user.episodesBookmarked,
            updatedAt: user.updatedAt,
            token: generateToken(user)
        })

    }
    catch (error) {
        return res.status(500).send(error)
    }

}))

// ** STILL WORKING ON IT ** - UPADATE ANIMES EPISODES INFO OF USER/ GETS UPDATE TIME AND CHECK IF THERES NEW EPISODES
userRouter.get('/update-media-info', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    const GOGOANIME_URL = `https://riimuru-gogo-anime-api.herokuapp.com`
    const BASE_URL = 'https://graphql.anilist.co/'

    if (!user) {
        return res.status(404).send({ msg: 'User Not Found' })
    }

    try {

        let data = []

        user.mediaAdded.forEach(async item => {

            if (item.fromGoGoAnime === true) {
                data.push(
                    await fetch(`${GOGOANIME_URL}/anime-details/${item.idGoGoAnime}`, {
                        mode: 'cors',
                        method: 'GET'
                    })
                )
            }
            else {
                data.push('no')
            }

        })

        return res.status(200).send(data)

    }
    catch (error) {
        return res.status(500).send({ msg: `${error}` })
    }

}))

export default userRouter;
