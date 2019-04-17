const express = require('express');
const router = express.Router();

const checksum = require('../lib/checksum');
const config = require('../config');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    amount: 100,
    buyerEmail: 'a@a.com',
    currency: 'INR',
    merchantIdentifier: config.mobikwikMerchantID,
    orderId: new Date().getTime(),
    returnUrl: 'http://localhost:5000/response',
    transactionAmount: Number(100 / 100).toFixed(2)
  });
});

router.post('/transact', (req, res) => {
  let checksumString = checksum.getRequestChecksumString(req.body);
  let calculatedChecksum = checksum.calculateChecksum(checksumString);

  console.log(req.body);

  console.log(checksumString);
  console.log(calculatedChecksum);

  res.render('transact', {
    formSubmitURL: config.mobikwikURL,
    data: req.body,
    checksum: calculatedChecksum
  });
  res.end();
});

router.post('/response', (req, res) => {
  let checksumString = checksum.getResponseChecksumString(req.body);
  let calculatedChecksum = checksum.calculateChecksum(checksumString);

  let isChecksumValid = calculatedChecksum.toString() === (req.body.checksum).toString();

  let responseCode = req.body.responseCode;

  console.log(req.body);
  console.log(req.body.pgTransTime);
  console.log(new Date(req.body.pgTransTime));
  console.log(new Date(req.body.pgTransTime).toLocaleString());

  if (!isChecksumValid || (responseCode !== '100' && responseCode !== '601')) {
    res.render('responseError', {
      amount: Number(req.body.amount / 100).toFixed(2),
      txnId: req.body.pgTransId,
      errorCode: req.body.responseCode,
      reason: req.body.responseDescription
    });
  } else {
    res.render('responseSuccess', {
      amount: Number(req.body.amount / 100).toFixed(2),
      txnId: req.body.pgTransId
    });
  }
});

module.exports = router;
