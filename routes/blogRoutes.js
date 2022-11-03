const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', blogController.checkID);

// POST /blog/234fad4/comments
// GET /blog/234fad4/comments

//router.use('/:blogId/comments', commentsRouter);
router
  .route('/get-my-blogs')
  .get(
    authController.protect,
    authController.restrictTo('author', 'admin'),
    blogController.getOwnBlogs
  );

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    authController.restrictTo('author', 'admin'),
    blogController.setUserIds,
    blogController.createBlog
  );

router
  .route('/:id')
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    authController.restrictTo('author', 'admin'),
    //blogController.uploadBlogImages,
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    authController.restrictTo('author', 'admin'),
    blogController.deleteBlog
  );

module.exports = router;
