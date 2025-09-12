import winston from "winston";
import morgan, { StreamOptions } from "morgan";

const serviceName = process.env.SERVICE_NAME || "app";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] [${serviceName}] ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
});

const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

const morganMiddleware = morgan("dev", { stream });

export { logger, morganMiddleware };
