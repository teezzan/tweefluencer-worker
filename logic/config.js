var configlisten = {
    access_token: process.env.ACCESS_TOKEN_LISTEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_LISTEN,
    consumer_key: process.env.CONSUMER_KEY_LISTEN,
    consumer_secret: process.env.CONSUMER_SECRET_LISTEN
}
const configDM = {
    apiKey: process.env.API_KEY_DM,
    apiSecret: process.env.API_SECRET_DM,
    accessToken: process.env.ACCESS_TOKEN_DM,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_DM,
}
module.exports = { configlisten, configDM }