import { forEachField } from 'graphql-tools'
import mem from 'memoizee'
import memoizee from 'memoizee/plain'
import { StatsD } from 'node-dogstatsd'
const stats = new StatsD()

export default function memoize(schema) {
	forEachField(schema, (field, typeName, fieldName) => {
    if (field.resolve) {
      field.resolve.typeName = typeName
      field.resolve.fieldName = fieldName
      field.resolve = mem(field.resolve, {
        maxAge: 1000,
        normalizer([root, args, context]) {
          return JSON.stringify([root, args, context.user && context.user.unsafe_id])
        }
      })
    }
	})
}

Object.defineProperty(memoizee, '__profiler__', {
  value(conf) {
    const id = `${conf.original.typeName}#${conf.original.fieldName}`
		conf.on("set", () => stats.increment(
      `backend.graphql.memoize.initial`,
      1,
      [`resolver:${id}`]
    ))
    conf.on("get", () => stats.increment(
      `backend.graphql.memoize.cached`,
      1,
      [`resolver:${id}`]
    ))
  }
});