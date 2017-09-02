import schema from './src/schema'
import { instrument, report, createContext, instrumentMiddleware } from './src/monitor'
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

instrument(schema)

const url = 'mongodb://localhost:27017/popcornmoe_backend';
const app = express()

app.use(logger('dev'))
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8000'],
  credentials: true
}))
app.use(passport.initialize())
passport.serializeUser((user, cb) => cb(null, user))

MongoClient.connect(url).then(db =>{
    app.use('/graphql',
        passport.authenticate('jwt'),
        graphqlUpload(multer({

        })),
        instrumentMiddleware(graphqlHTTP({
            schema,
            rootValue: { db },
            graphiql: true
        }))
    );

    passport.use(new JwtStrategy(db.collection('users')))

    console.log('Connected on mongodb')
});

app.listen(3030, () => console.log('Listening on port 3030'))
