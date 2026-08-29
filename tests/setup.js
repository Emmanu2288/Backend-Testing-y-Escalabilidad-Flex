import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const mongoose = (await import('mongoose')).default
const { config } = await import('../src/config/index.js')

export const mochaHooks = {
    async beforeAll() {
        await mongoose.connect(config.mongoUri)
    },
    async afterAll() {
        await mongoose.connection.close()
    }
}
