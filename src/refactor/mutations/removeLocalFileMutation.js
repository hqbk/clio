const removeFileMutation = require('./removeFileMutation');

function removeLocalFileMutation(backup, payload) {
  return removeFileMutation(backup, 'local', payload);
}

module.exports = removeLocalFileMutation;
