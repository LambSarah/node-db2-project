const express = require('express')
const Cars = require('./cars-model')
const {
	checkCarId,
	checkCarPayload,
	checkVinNumberValid,
	checkVinNumberUnique
} = require('./cars-middleware')

const router = express.Router()
router.use(express.json())

router.get('/', (req, res, next) => {
	Cars.getAll()
		.then(cars => {
			res.status(200).json(cars)
		}
		).catch(err => {
			next(err)
		})
})


router.get('/:id', checkCarId, async (req, res, next) => {
	try {
		const car = await Cars.getById(req.params.id)
		res.json(car)
	} catch (err) {
		next(err)
	}
})

router.post('/',
	checkCarId,
	checkCarPayload,
	checkVinNumberValid,
	checkVinNumberUnique, async (req, res, next) => {
		try {
			const newCar = await Cars.create(req.body.car)
			res.status(201).json(newCar)
		} catch (err) {
			next(err)
		}
	})

module.exports = router