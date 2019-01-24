const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/googleUser')
const Post = require('../models/post')
const { ensureAuthenticated } = require('../helpers/auth')

const router = express.Router()

router.get('/search', (req, res) => {
    res.render('posts/search')
})

router.get('/', (req, res) => {
    if (req.query.page && req.query.page != '' && req.query.search && req.query.search != '') {
        Post
            .find({ title: { $regex: req.query.search } })
            .skip((parseInt(req.query.page) - 1) * 15)
            .limit(15)
            .populate('user')
            .then(posts => {
                res.render('posts/index', { posts, lastIndex: parseInt(req.query.page) + 1, searchWord: req.query.search })
            })
    } else {
        res.redirect('/post/search')
    }
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('posts/add.ejs')
})

router.post('/add', ensureAuthenticated, (req, res) => {

    let post = new Post({
        title: req.body.title,
        description: req.body.body,
        questions: [req.body.q1, req.body.q2],
        answers: [],
        user: req.user.id
    })
    post
        .save()
        .then(data => {
            res.redirect(`/post/show/${data._id}`)
        })

})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Post
        .findOne({ _id: req.params.id })
        .then((post) => {
            if (post.user != req.user.id) {
                res.redirect('/post/search')
            } else {
                res.render('posts/edit', { post })
            }
        })
})

router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    Post
        .findOne({ _id: req.params.id })
        .then((data) => {
            data.title = req.body.title
            data.description = req.body.body
            data.questions[0] = req.body.q1
            data.questions[1] = req.body.q2
            data
                .save()
                .then(post => {
                    res.redirect('/dashboard')
                })
        })
})

router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    Post
        .remove({ _id: req.params.id })
        .then(() => {
            res.redirect('/dashboard')
        })
})

router.get('/verfiy/:id', ensureAuthenticated, (req, res) => {
    Post
        .findOne({ _id: req.params.id })
        .populate('user')
        .then(post => {
            res.render('posts/verfiy', { post })
        })
})

router.post('/verfiy/:id', ensureAuthenticated, (req, res) => {
    Post
        .findOne({ _id: req.params.id })
        .populate('user')
        .then(post => {
            post.answers.push({user: req.user.id, content: [req.body.ans1, req.body.ans2]})

            post
                .save()
                .then(post => {
                    res.redirect('/dashboard')
                })
        })
})

router.get('/show/:id', (req, res) => {
    Post
        .findOne({ _id: req.params.id })
        .populate('user')
        .populate('answers.user')
        .then((post) => {
            res.render('posts/show', { post })
        })
})

router.get('/user/:id', (req, res) => {
    Post
        .find({
            user: req.params.id
        })
        .populate('user')
        .then((posts) => {
            res.render('posts/index', { posts })
        })
})

router.get('/my', ensureAuthenticated, (req, res) => {
    Post
        .find({
            user: req.user.id
        })
        .populate('user')
        .then((posts) => {
            res.render('posts/index', { posts })
        })
})

module.exports = router