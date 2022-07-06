import express from "express";
import bcrypt from 'bcrypt'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

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
            avatarImg: 'https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg', // temporary
            createdAt: new Date(),
        })

        user.save()

        res.status(201).send({

            id: user._id,
            name: user.name,
            email: user.email,
            avatarImg: user.avatarImg

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
                email: user.email,
                avatarImg: user.avatarImg,
                mediaAdded: user.mediaAdded

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

//GET MEDIA USER'S MEDIA
userRouter.get('/media', expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.body.id)

    if (!user) {
        return res.status(404).send("User Don't Exist.")
    }

    try {

        return res.status(200).send({

            id: user._id,
            name: user.name,
            email: user.email,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded

        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send(user)
    }

}))

//ADD MEDIA TO USER
userRouter.post('/add-media', expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.body.id)

    if (!user) {
        return res.status(404).send("User Don't Exist.")
    }

    try {

        user.mediaAdded.push(req.body.media)

        await user.save()

        return res.status(201).send({

            id: user._id,
            name: user.name,
            email: user.email,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded

        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send(user)
    }

}))

//REMOVE MEDIA FROM USER
userRouter.post('/remove-media', expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.body.id)

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
            email: user.email,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded

        })


    }
    catch (error) {
        console.log(error)
        return res.status(500).send()
    }

}))

//UPDATE USER PROFILE
userRouter.put('/update-user-profile', expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.body.id)

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
                email: user.email,
                avatarImg: user.avatarImg,
                mediaAdded: user.mediaAdded
            })

        }
    }
    catch (error) {

        return res.status(500).send(`${error}`)

    }

}))

//CHANGE USER AVATAR IMAGE
userRouter.put('/change-user-avatar-image', expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.body.id)

    if(!user){
        return res.status(404).send('User Not Found')
    }

    try{

        user.avatarImg = req.body.newAvatarImg

        user.save()

        return res.status(200).send({
            id: user._id,
            name: user.name,
            email: user.email,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded
        })

    }
    catch(error){
        return res.status(500).send(error)
    }

}))

//ERASE MEDIA DATA
userRouter.put('/erase-media-added-data', expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.body.id)

    if(!user){
        return res.status(404).send('User Not Found')
    }

    try{

       user.mediaAdded = user.mediaAdded.splice(0,0)

       user.save()

        return res.status(200).send({
            id: user._id,
            name: user.name,
            email: user.email,
            avatarImg: user.avatarImg,
            mediaAdded: user.mediaAdded
        })

    }
    catch(error){
        return res.status(500).send(error)
    }

}))

export default userRouter;