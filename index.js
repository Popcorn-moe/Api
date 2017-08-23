import schema from './src/schema';
import { join } from 'path';
import { inspect } from 'util';
import { graphql } from 'graphql';
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/popcornmoe_backend';

MongoClient.connect(url)
           .then(db =>
                 {
                     graphql(schema, '{ me { email login id }}', { db })
                         .then(res => console.log(JSON.stringify(res, null, 2)));
                 });
