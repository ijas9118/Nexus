import winston from 'winston';

import { env } from '../utils/env-validation';

const customColors = {
  error: 'brightRed',
  warn: 'brightYellow',
  info: 'brightGreen',
  http: 'brightCyan',
  debug: 'brightBlue',
};

winston.addColors(customColors);

const envValue = env.NODE_ENV || 'development';

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
];

if (envValue !== 'development') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log', level: 'info' })
  );
}

const logger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports,
});

export default logger;
