import { Router } from 'express'
import logger from '../utils/logger.js'

const router = Router()

router.get('/', (req, res) => {
    logger.debug('Log de nivel debug')
    logger.http('Log de nivel http')
    logger.info('Log de nivel info')
    logger.warning('Log de nivel warning')
    logger.error('Log de nivel error')
    logger.fatal('Log de nivel fatal')

    res.json({
        status: 'success',
        message: 'Logs generados correctamente'
    })
})

export default router