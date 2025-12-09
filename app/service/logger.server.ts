import {
  createLogger,
  format,
  transports,
  config as winstonConfig,
} from "winston";

const { combine, splat, timestamp, prettyPrint } = format;

export const logger = createLogger({
  level: "info",
  levels: winstonConfig.npm.levels,
  format: combine(
    splat(),
    format.errors({ stack: true }),
    timestamp({ format: "isoDateTime" }),
    prettyPrint({ colorize: true }),
  ),
  transports: [new transports.Console()],
});
