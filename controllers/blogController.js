const catchAsync = require('./../utils/catchAsync');

const Blog = require('../models/blogModel');
const factory = require('./handlerFactory');

exports.setUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getOwnBlogs = catchAsync(async (req, res, next) => {
  const filter = { user: req.user.id };
  // const doc = await features.query.explain();
  const data = await Blog.find(filter);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getAllBlogs = factory.getAll(Blog);
exports.getBlog = factory.getOne(Blog, { path: 'reviews' });
exports.createBlog = factory.createOne(Blog);
exports.updateBlog = factory.updateOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);
