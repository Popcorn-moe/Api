import schema from './src/schema'
import {
	instrument,
	report,
	createContext,
	instrumentMiddleware
} from './src/monitor'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { MongoClient } from 'mongodb'
import passport from 'passport'
import JwtStrategy from './src/auth/JwtStrategy'
import graphqlUpload from './src/middlewares/graphqlUpload'
import cors from 'cors'
import multer from 'multer'
import { join } from 'path'
import { FileStorage } from './src/storage'
import AnonymousStrategy from 'passport-anonymous'

instrument(schema)

const url = 'mongodb://localhost:27017/popcornmoe_backend'
const app = express()
const storage = new FileStorage(join(__dirname, 'uploads'))

storage.register(app)
app.use(logger('dev'))
app.use(cookieParser())
app.use(
	cors({
		origin: [
			'http://localhost:8080',
			'http://localhost:8000',
			'https://popcorn.moe'
		],
		credentials: true
	})
)
app.use(passport.initialize())
passport.serializeUser((user, cb) => cb(null, user))
passport.use(new AnonymousStrategy())

MongoClient.connect(url).then(db => {
	app.use((req, res, next) => {
		req.db = db
		req.storage = storage
		next()
	})
	app.use(
		'/graphql',
		passport.authenticate(['jwt', 'anonymous']),
		graphqlUpload(
			multer({
				storage: storage.createMulterStorage()
			})
		),
		instrumentMiddleware(
			graphqlHTTP({
				schema,
				graphiql: true
			})
		)
	)

	passport.use(new JwtStrategy(db.collection('users')))

	console.log('Connected on mongodb')
})

app.listen(3030, () => console.log('Listening on port 3030'))
