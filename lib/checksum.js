const crypto = require('crypto');

const secret = require('../config').mobikwikSecretKey;
const {
  requestChecksumSequence,
  responseChecksumSequence
} = require('../constants');

const createChecksumString = (checksumSequence, data) => {
  let checksumString = '';

  for (let key in checksumSequence) {
    if (data[checksumSequence[key]]) {
      checksumString += checksumSequence[key] + '=' + data[checksumSequence[key]].toString() + '&';
    }
  }

  return checksumString;
};

exports.getRequestChecksumString = (data) => {
  return createChecksumString(requestChecksumSequence, data);
};

exports.getResponseChecksumString = (data) => {
  return createChecksumString(responseChecksumSequence, data);
};

exports.calculateChecksum = (checksumString) => {
  return crypto.createHmac('sha256', secret).update(checksumString).digest('hex');
};
