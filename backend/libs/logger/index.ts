import winston from "winston";
import morgan, { StreamOptions } from "morgan";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

const morganMiddleware = morgan("combined", { stream });

export { logger, morganMiddleware };
