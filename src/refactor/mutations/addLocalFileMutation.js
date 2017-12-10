const addFileMutation = require('./addFileMutation');

function addLocalFileMutation(backup, payload) {
  return addFileMutation(backup, 'local', payload);
}

module.exports = addLocalFileMutation;
