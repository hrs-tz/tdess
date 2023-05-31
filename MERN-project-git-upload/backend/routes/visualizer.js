const express = require('express')

const router = express.Router()

// GET all lines
router.get('/', (req, res) => {
    res.json({mssg: 'GET map and lines'})
})

// GET a single line
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET map and a single line'})
})

// POST a line departure
router.post('/:id', (req, res) => {
    res.json({mssg: 'POST a line departure'})
})

// UPDATE a line departure
router.post('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a line departure'})
})

module.exports = router