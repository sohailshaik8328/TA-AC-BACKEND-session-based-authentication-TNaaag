var express = require('express');
var router = express.Router();
var Article = require('../models/article-model');
var Comment = require('../models/comment-model');

router.get('/:slug/delete', (req, res, next) => {
    var slug = req.params.slug;
    Comment.findOneAndRemove(slug, (err, comment) => {
        if(err) return next(err);
        Article.findOneAndUpdate(comment.articleId, {$pull : {comments : comment._id}}, (err, article) => {
            // console.log(article)
            if(err) return next(err);
            res.redirect('/articles/' + comment.articleId)
        })
    })
    
})


// router.get('/:id/delete', (req, res, next) => {
//     var id = req.params.id;
//     Comment.findByIdAndRemove(id, (err, comment) => {
//         if(err) return next(err);
//         Article.findByIdAndUpdate(comment.articleId, {$pull : {comments : comment._id}}, (err, article) => {
//             // console.log(article)
//             if(err) return next(err);
//             res.redirect('/articles/' + comment.articleId)
//         })
//     })
    
// })

module.exports = router;