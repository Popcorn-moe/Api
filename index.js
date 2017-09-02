import schema from './src/schema'
import { instrument, report, createContext } from './src/monitor'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { MongoClient, ObjectID } from 'mongodb'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import cors from 'cors'

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
    const graphql = graphqlHTTP({
        schema,
        rootValue: { db },
        graphiql: true
    });

    app.use('/graphql', passport.authenticate('jwt'), (req, res, next) => {
        Object.assign(req, createContext())
        graphql(req, res, next)
        res.on('finish', () => report(req.instrument, res._startAt, req._startAt))
    });

    passport.use(new JwtStrategy({
        jwtFromRequest(req) {
            return req && req.cookies ? req.cookies['session'] : null
        },
        audience: 'session',
        secretOrKey: 'secret'
    }, (jwt, done) => {
        done(null, {
            then(onFulfilled, onRejected) {
                if (!this.result)  {
                    this.result = db.collection('users').find({ _id: new ObjectID(jwt._id) })
                    .limit(1)
                    .toArray()
                    .then(([user]) => user)
                }
                return this.result.then(onFulfilled, onRejected)
            },
            catch(onRejected) {
                return this.then(p => p, onRejected)
            }
        })
    }))

    console.log('Connected on mongodb')
});

app.listen(3030, () => console.log('Listening on port 3030'))
