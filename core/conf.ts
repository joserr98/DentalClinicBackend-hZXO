const config = {
    SECRET: process.env.SECRET!, // Secret of jsonwebtoken
    SALT_ROUND: Number(process.env.SALT_ROUND)!, // This is for hash method
    DB: process.env.DB!, 
    PORT: process.env.PORT!
}

export default config