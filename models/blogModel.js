const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
      unique: true,
      trim: true,
      maxlength: [50, 'A blog title must have less or equal then 50 characters'],
      minlength: [3, 'A blog title must have more or equal then 3 characters']
      // validate: [validator.isAlpha, 'Tour title must only contain characters']
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: String,
    images: {
      type: [String],
      default: ['blog-1.jpg']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Blog must belong to an author/ admin']
    },
    category: {
      type: String,
      default: 'Web development',
      select: true
    },
    comments: {
      type: Number,
      default: 0,
      select: true
    },
    /* lastUpdated: {
    type: Date,
    default: Date.now(),
    select: false
  }, */
    isHidden: {
      type: Boolean,
      default: false,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

blogSchema.index({ ratingsAverage: -1, title: 1 });
blogSchema.index({ slug: 1 });

blogSchema.virtual('shortDescription').get(function() {
  return this.description.substring(0, 200);
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
blogSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
// DOCUMENT MIDDLEWARE: runs before .findByIdAndUpdate()
blogSchema.pre('findOneAndUpdate', function(next) {
  // this.slug = slugify(this.title, { lower: true });
  this.getUpdate().slug = slugify(this.getUpdate().title, { lower: true });
  next();
});

blogSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

blogSchema.pre(/^find/, function(next) {
  this.find({ isHidden: { $ne: true } });

  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
