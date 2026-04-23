import { Logger } from 'winston';
import devLogger from './devLogger';
import productionLogger from './productionLogger';

let logger: Logger = devLogger();

if (process.env.NODE_ENV === 'production') {
  logger = productionLogger();
}

export default logger;
