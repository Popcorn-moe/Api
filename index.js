import schema from './src/schema'
import { instrument, report, createContext } from './src/monitor'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import logger from 'morgan'
import { MongoClient } from 'mongodb';

instrument(schema)

const url = 'mongodb://localhost:27017/popcornmoe_backend';
const app = express()

app.use(logger('dev'))
MongoClient.connect(url).then(db =>{
    const graphql = graphqlHTTP({
        schema,
        rootValue: { db },
        graphiql: true
    });

    app.use('/graphql', (req, res, next) => {
        Object.assign(req, createContext())
        graphql(req, res, next)
        res.on('finish', () => report(req.instrument, res._startAt, req._startAt))
    });

    console.log('Connected on mongodb')
});

app.listen(3030, () => console.log('Listening on port 3030'))
