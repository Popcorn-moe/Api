import { Strategy } from 'passport-jwt'
import { ObjectID } from 'mongodb'

export default class JwtStrategy extends Strategy {
    constructor(db) {
        super({
            jwtFromRequest(req) {
                return req && req.cookies ? req.cookies['session'] : null
            },
            audience: 'session',
            secretOrKey: 'secret'
        }, (jwt, done) => {
            done(null, {
                then(onFulfilled, onRejected) {
                    if (!this.result)  {
                        this.result = db.find({ _id: new ObjectID(jwt._id) })
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
        })
    }
}