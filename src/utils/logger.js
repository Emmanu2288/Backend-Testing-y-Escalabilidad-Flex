import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { config } from '../config/index.js'

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red bold',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}

winston.addColors(customLevels.colors)

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}] ${message}`
    })
)

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
)

const errorFileTransport = new DailyRotateFile({
    filename: 'logs/errors-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '14d',
    format: fileFormat
})

const defaultLevel = config.nodeEnv === 'production' ? 'info' : 'debug'

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: config.logLevel || defaultLevel,
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        errorFileTransport
    ]
})

export default logger
