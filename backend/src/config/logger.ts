import { NODE_ENV } from '@/utils/constants';
import winston from 'winston';
import LokiTransport from 'winston-loki';

const customColors = {
  error: 'brightRed',
  warn: 'brightYellow',
  info: 'brightGreen',
  http: 'brightCyan',
  debug: 'brightBlue',
};

winston.addColors(customColors);

const env = NODE_ENV || 'development';

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
  // new LokiTransport({
  //   host: 'http://loki:3100', // Loki service in Docker Compose
  //   labels: { app: 'backend', env }, // Labels for filtering in Grafana
  //   json: true,
  //   format: winston.format.json(),
  //   replaceTimestamp: true,
  //   onConnectionError: (err) => console.error('Loki connection error:', err),
  // }),
];

if (env !== 'development') {
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
