const fs = require('fs');

const logFilePath =`${__dirname}/logs/api-server.logs`;

try {
    fs.writeFileSync(logFilePath, '');
} catch(ex) {
    console.error('Error clearing log file', ex);
}

