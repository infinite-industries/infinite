/**
 * Utilities for the internal API endpoints -- don't use these in SSR code
 */

// logging support (copied from api-server)
const winston = require('winston')
const { createLogger, format, transports } = winston
const { combine, timestamp, label, printf, colorize } = format
const env = process.env.ENV || 'dev'
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level}: ${timestamp} [${label}] -- ${message}`
})

const labelOpt = { label: env + ':web-portal:' + process.pid }

const logger = createLogger({
  format: combine(
    label(labelOpt),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        label(labelOpt),
        timestamp(),
        colorize(),
        myFormat
      )
    })
  ]
})

module.exports = { logger }
