const express = require("express")
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const carsRouter = require('./cars/cars-router')
const { errorHandling, notFound } = require('./cars/cars-middleware')
const server = express()


server.use(express.json())
server.use(morgan('dev', {
	stream: fs.createWriteStream(path.join('../access.log'), { flags: 'a' })
}))

server.use('/api/cars', carsRouter)
server.get('/', function (req, res) {
	res.send('Welcome to CARS API')
}
)
server.use('*', notFound)
server.use(errorHandling)
module.exports = server