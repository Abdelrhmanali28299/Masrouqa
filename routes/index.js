const express = require('express')
const mongoose = require('mongoose')
const Post = require('../models/post')
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')
const router = express.Router()

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Post
        .find({ user: req.user.id })
        .populate('user')
        .sort({ date: 'desc' })
        .then(posts => {
            res.render('index/dashboard', { posts })
        })
})

router.get('/about', (req, res) => {
    res.render('index/about')
})

module.exports = router