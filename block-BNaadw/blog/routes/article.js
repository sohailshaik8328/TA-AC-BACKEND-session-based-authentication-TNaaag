var express = require('express');
var router = express.Router();
var Article = require('../models/article-model');
var Comment = require('../models/comment-model');

router.get('/', (req, res, next) => {
    Article.find({}, (err, articles) => {
        if(err) return next(err);
        console.log(err, articles)
        res.render('articles', {articles});
    })
})

router.get('/new', (req, res, next) => {
    res.render('article-form');
  })

  router.post('/', (req, res, next) => {
    Article.create(req.body, (err, articles) => {
        if(err) return next(err);
        res.redirect('/articles')
    })
  })
  

  router.get('/:slug', (req, res, next) => {
      var slug = req.params.slug;
      Article.findOne({slug}).populate('comments').exec((err, article) => {
          if(err) return next(err);
          res.render('single-article', {article});
      })
  })

  router.get('/:slug/likes', (req, res, next) => {
      var slug = req.params.slug;
      Article.findOneAndUpdate({slug}, {$inc : {likes : 1}}, (err, article) =>{
          if(err) return next(err);
          res.redirect('/articles/' + slug);
      } )
  })

  router.get('/:slug/edit', (req, res, next) => {
      var slug = req.params.slug;
      Article.findOne({slug}, (err, article) => {
          if(err) return next(err);
          res.render('edit-article-form', {article});
      })
  })

  router.post('/:slug', (req, res, next) => {
      var slug = req.params.slug;
      Article.findOneAndUpdate(slug, req.body, (err, article) => {
          res.redirect('/articles/' + slug);
      })

  })

  router.get('/:slug/delete', (req, res, next) => {
      var slug = req.params.slug;
      Article.findOneAndRemove(slug, (err, article) => {
          res.redirect('/articles');
      })
  })

  router.post('/:slug/comments', (req, res, next) => {
      var slug = req.params.slug;
      req.body.articleId = slug;
        Comment.create(req.body, (err, comment) => {
            if(err) return next(err);
            Article.findOneAndUpdate(slug, {$push : {comments : comment._id}}, (err, updatedArticle) => {
                if(err) return next(err);
                console.log(updatedArticle)
                res.redirect('/articles/' + slug);
            })
        })
  })






module.exports = router;
