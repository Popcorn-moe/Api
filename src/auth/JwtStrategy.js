import { Strategy } from 'passport-jwt'
import { ObjectID } from 'mongodb'

const ORIGINAL = Symbol()

function diff(o1, o2) {
	const result = {}
	for (const key in o1) {
		const value = o1[key]
		if (Array.isArray(value) && Array.isArray(o2[key])) {
			if (!value.every((e, i) => e === o2[key][i])) result[key] = value
			continue
		} else if (typeof value === 'object' && typeof o2[key] === 'object') {
			const tmp = diff(value, o2[key])
			if (tmp) result[key] = tmp
			continue
		}
		if (value !== o2[key]) {
			result[key] = value
		}
	}
	return Object.keys(result).length ? result : undefined
}

export default class JwtStrategy extends Strategy {
	constructor(db) {
		super(
			{
				jwtFromRequest(req) {
					if (!req) return
					if (req.headers['authorization']) return req.headers['authorization']
					else if (req.cookies) return req.cookies['session']
				},
				audience: 'session',
				secretOrKey: 'secret'
			},
			(jwt, done) => {
				done(null, {
					then(onFulfilled, onRejected) {
						if (!this.result) {
							this.result = db
								.find({ _id: new ObjectID(jwt._id) })
								.limit(1)
								.toArray()
								.then(([user]) => user)
								.then(user => {
									user.id = user._id
									user.save = () => {
										return db.updateOne(
											{ _id: new ObjectID(user._id) },
											{ $set: user }
										)
									}
									user[ORIGINAL] = Object.assign({}, user)
									return user
								})
						}
						return this.result.then(onFulfilled, onRejected)
					},
					catch(onRejected) {
						return this.then(p => p, onRejected)
					},
					unsafe_id: jwt._id
				})
			}
		)
	}
}
