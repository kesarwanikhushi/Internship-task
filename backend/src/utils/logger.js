const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const serverLogPath = path.join(logsDir, 'server.log');
const errorLogPath = path.join(logsDir, 'error.log');

const getTimestamp = () => {
  return new Date().toISOString();
};

const writeToFile = (filePath, message) => {
  const logMessage = `[${getTimestamp()}] ${message}\n`;
  fs.appendFileSync(filePath, logMessage);
};

const logger = {
  info: (message) => {
    const logMessage = `INFO: ${message}`;
    console.log(logMessage);
    writeToFile(serverLogPath, logMessage);
  },
  error: (message) => {
    const logMessage = `ERROR: ${message}`;
    console.error(logMessage);
    writeToFile(errorLogPath, logMessage);
    writeToFile(serverLogPath, logMessage);
  },
  warn: (message) => {
    const logMessage = `WARN: ${message}`;
    console.warn(logMessage);
    writeToFile(serverLogPath, logMessage);
  },
};

module.exports = logger;
