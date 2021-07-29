var express = require('express');
var router = express.Router();
var Product = require('../models/product-model');
var Comment = require('../models/comment-model');

router.get('/', (req, res, next) => {
    Product.find({}, (err, products) => {
        if(err) return next(err);
        console.log(err, products)
        res.render('products', {products});
    })
})


router.get('/admin-product', (req, res, next) => {
    Product.find({}, (err, products) => {
        if(err) return next(err);
        console.log(err, products)
        res.render('admin-product', {products});
    })
})

router.get('/user-products', (req, res, next) => {
    Product.find({}, (err, products) => {
        if(err) return next(err);
        console.log(err, products)
        res.render('user-products', {products});
    })})

  

router.get('/new', (req, res, next) => {
    res.render('product-form');
  })

  router.post('/', (req, res, next) => {
    Product.create(req.body, (err, products) => {
        if(err) return next(err);
        res.redirect('/products')
    })
  })
  

  router.post('/admin-product', (req, res, next) => {
    Product.create(req.body, (err, products) => {
        if(err) return next(err);
        res.redirect('/products/admin-product')
    })
  })

  router.get('/:slug', (req, res, next) => {
      var slug = req.params.slug;
      Product.findOne({slug}).populate('comments').exec((err, product) => {
          if(err) return next(err);
          res.render('single-product', {product});
      })
  })

  router.get('/:slug/user-single-product', (req, res, next) => {
    var slug = req.params.slug;
    Product.findOne({slug}).populate('comments').exec((err, product) => {
        if(err) return next(err);
        res.render('user-single-product', {product});
    })
})

router.get('/:slug/admin-single-product', (req, res, next) => {
    var slug = req.params.slug;
    Product.findOne({slug}).populate('comments').exec((err, product) => {
        if(err) return next(err);
        res.render('admin-single-product', {product});
    })
})

let cart = [];
router.get('/:slug/add-to-cart', (req, res, next) => {
    var slug = req.params.slug;
    Product.findOne({slug}).exec((err, product) => {
        console.log(product)
        if(err) return next(err);
        cart.push(product);
        res.render('add-to-cart', {product : cart});
    })
})


  router.get('/:slug/likes', (req, res, next) => {
      var slug = req.params.slug;
      Product.findOneAndUpdate({slug}, {$inc : {likes : 1}}, (err, product) =>{
          if(err) return next(err);
          res.redirect('/products/' + slug);
      } )
  })

  router.get('/:slug/likes/user-single-likes', (req, res, next) => {
    var slug = req.params.slug;
    Product.findOneAndUpdate({slug}, {$inc : {likes : 1}}, (err, product) =>{
        if(err) return next(err);
        res.redirect('/products/' + slug + '/user-single-product');
    } )
})

  router.get('/:slug/edit', (req, res, next) => {
      var slug = req.params.slug;
      Product.findOne({slug}, (err, product) => {
          if(err) return next(err);
          res.render('edit-product-form', {product});
      })
  })

  router.post('/:slug/admin-single-product', (req, res, next) => {
      var slug = req.params.slug;
      Product.findOneAndUpdate(slug, req.body, (err, product) => {
          res.redirect('/products/' + slug + '/admin-single-product');
      })

  })

  router.get('/:slug/delete', (req, res, next) => {
      var slug = req.params.slug;
      Product.findOneAndRemove(slug, (err, product) => {
          res.redirect('/products/admin-product');
      })
  })

  router.post('/:slug/comments', (req, res, next) => {
      var slug = req.params.slug;
      req.body.articleId = slug;
        Comment.create(req.body, (err, comment) => {
            if(err) return next(err);
            Product.findOneAndUpdate(slug, {$push : {comments : comment._id}}, (err, updatedproduct) => {
                if(err) return next(err);
                console.log(updatedproduct)
                res.redirect('/products/' + slug);
            })
        })
  })






module.exports = router;
