async function setRedisKey({ redisClient, key, data }) {
    try {
        await redisClient.set(key, JSON.stringify(data));
        await redisClient.expire(key, process.env.REDIS_EXPIRATION);
        console.log(`#### -> Redis Key Set: Expiration ${process.env.REDIS_EXPIRATION} seconds`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    setRedisKey
}