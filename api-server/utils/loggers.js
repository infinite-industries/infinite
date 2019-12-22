require('dotenv')
const winston = require('winston');
const { createLogger, format, transports, loggers  } = winston
const { combine, timestamp, label, printf, colorize, simple } = format
const env = process.env.ENV || 'dev'
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level}: ${timestamp} [${label}] -- ${message}`;
});

const labelOpt = { label: env + ':api-server:' + process.pid }
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