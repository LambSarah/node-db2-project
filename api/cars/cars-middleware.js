const Cars = require('./cars-model')
const db = require('../../data/db-config')
const vinValidator = require('vin-validator')

const checkCarId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const car = await Cars.getById(id)
    if (!car) {
      next({
        status: 404,
        message: `car with id ${id} is not found`
      })
    } else {
      res.car = car;
      next()
    }
  } catch (err) {
    next(err)
  }
}

const checkCarPayload = (req, res, next) => {
  const error = { status: 400 }
  const { vin, make, model, mileage } = req.body
  const reqFields = [vin, make, model, mileage]
  if (vin === undefined || make === undefined || model === undefined || mileage === undefined) {
    error.message(`${reqFields} is missing`)
  }

  if (error.message) {
    next(error)
  } else {
    next()
  }
}

const checkVinNumberValid = (req, res, next) => {
  const vin = req.body.vin
  const isValid = vinValidator.validate(vin)
  if (!isValid) {
    next({
      status: 400,
      message: `vin ${vin} is invalid`
    })
  } else {
    next()
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  try {
    const existing = await db('cars').where('vin', req.body.vin).first()

    if (existing) {
      next({ status: 400, message: `vin ${req.body.vin} already exists` })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

const notFound = (req, res, next) => { // eslint-disable-line
  res.status(404).json({
    message: 'Resource not found'
  })
}

const errorHandling = (err, req, res, next) => { // eslint-disable-line
  const status = err.status || 500
  res.status(status).json({
    message: err.message,
  })
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
  errorHandling,
  notFound
}