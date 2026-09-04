import dotenv from 'dotenv';
dotenv.config();

const requieredEnvVars = ['MONGODB_URI'];

requieredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Falta configurar la variable de entorno: ${envVar}`)
  }
})

export const config = {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
}