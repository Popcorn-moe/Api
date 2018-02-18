import schema from './src/schema'
import { PubSub } from 'graphql-subscriptions'
import {
	instrument,
	report,
	createContext,
	instrumentMiddleware
} from './src/graphql/monitor'
import memoize from './src/graphql/memoize'
import express from 'express'
import {
	SubscriptionServer,
	SubscriptionManager
} from 'subscriptions-transport-sse'
import { execute, subscribe } from 'graphql'
import { graphqlExpress } from 'apollo-server-express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { MongoClient } from 'mongodb'
import passport from 'passport'
import JwtStrategy from './src/auth/JwtStrategy'
import cors from 'cors'
import { apolloUploadExpress } from 'apollo-upload-server'
import bodyParser from 'body-parser'
import { join } from 'path'
import { FileStorage } from './src/storage'
import AnonymousStrategy from 'passport-anonymous'

memoize(schema)
instrument(schema)

const url = 'mongodb://localhost:27017/popcornmoe_backend'
const app = express()
const storage = new FileStorage(join(__dirname, 'uploads'))
export const pubsub = new PubSub()

storage.register(app)
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
	cors({
		origin: [
			'http://localhost:8080',
			'http://localhost:8000',
			'http://localhost:3000',
			'https://popcorn.moe',
			'https://admin.popcorn.moe',
			'https://dev.popcorn.moe'
		],
		credentials: true
	})
)

app.use(passport.initialize())
passport.serializeUser((user, cb) => cb(null, user))
passport.use(new AnonymousStrategy())

SubscriptionServer(
	{
		onSubscribe: (msg, params) => console.log(msg, params),
		subscriptionManager: new SubscriptionManager({
			schema,
			pubsub
		})
	},
	{
		express: app,
		path: '/subscriptions'
	}
)

MongoClient.connect(url).then(db => {
	app.use((req, res, next) => {
		req.db = db
		req.storage = storage
		req.pubsub = pubsub
		next()
	})
	app.post(
		'/graphql',
		passport.authenticate(['jwt', 'anonymous']),
		apolloUploadExpress(),
		instrumentMiddleware((req, res, next) =>
			graphqlExpress({
				schema,
				context: req,
				tracing: true,
				formatError(e) {
					console.error(e)
					return e
				}
			})(req, res, next)
		)
	)
	passport.use(new JwtStrategy(db.collection('users')))

	console.log('Connected on mongodb')
})

app.listen(3030, () => console.log('Listening on port 3030'))

process.on('unhandledRejection', error =>
	console.error('unhandledRejection', error)
)
