// backend/config/database.js
const path = require('path');

module.exports = {
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', '.tmp', 'data.db'),
    },
    useNullAsDefault: true,
  },
};
