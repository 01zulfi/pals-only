const { body, validationResult } = require('express-validator');
const Message = require('../models/message');
require('../models/user');

exports.getMessages = (req, res, next) => {
  Message.find({})
    .sort({ createdAt: -1 })
    .populate('author')
    .exec((err, result) => {
      if (err) return next(err);
      return res.render('index', { messages: result, title: 'Pals Only' });
    });
};

exports.createMessageGet = (req, res, next) => {
  res.render('message-form', { title: 'New Message | Pals Only' });
  return res.end();
};

exports.createMessagePost = [
  body('title', 'Message Title must not be empty').trim().notEmpty().escape(),
  body('body').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('message-form', {
        title: 'New Message | Pals Only',
        errors: errors.array(),
      });
    }
    const message = new Message({
      title: req.body.title,
      body: req.body.body,
      author: req.user._id,
    });
    return message.save((err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  },
];

exports.deleteMessage = (req, res, next) =>
  /* eslint-disable implicit-arrow-linebreak */
  Message.findByIdAndRemove(req.body.messageId, (err) => {
    if (err) return next(err);
    return res.redirect(req.headers.referer);
  });
