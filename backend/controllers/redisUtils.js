async function setRedisKey({ redisClient, key, data }) {

    await redisClient.set(key, JSON.stringify(data), {
        type: "EX",
        value: process.env.REDIS_EXPIRATION
    })

    return
};

module.exports = {
    setRedisKey
}