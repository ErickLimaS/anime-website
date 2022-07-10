import jwt from "jsonwebtoken";

export const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email
        },
        process.env.SECRET,
        {
            expiresIn: '1h'//test
        }
    )

}

export const isAuth = (req, res, next) => {

    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).send({ Message: 'No Token' })
    }
    else {
        //gets token after BEARER ******
        const token = authorization.slice(7, authorization.length);

        jwt.verify(

            token, process.env.SECRET, (err, decode) => {

                if (err) {
                    return res.status(401).send({ Message: 'Invalid Token' })
                }
                else {
                    req.user = decode;
                    next()
                }

            }

        )
    }


}