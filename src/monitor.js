import { forEachField } from 'graphql-tools'
import { StatsD } from 'node-dogstatsd'
const stats = new StatsD()


// Copied from https://github.com/graphql/graphql-js/blob/v0.7.1/src/execution/execute.js#L1004
function defaultResolveFn(source, args, context, { fieldName }) {
  // ensure source is a value for which property access is acceptable.
  if (typeof source === 'object' || typeof source === 'function') {
    const property = source[fieldName];
    if (typeof property === 'function') {
      return source[fieldName](args, context);
    }
    return property;
  }
}

const isPromise = (e) => typeof e.then === 'function'

function decorate(fn, typeName, fieldName) {
    return (p, a, ctx, resolverInfo) => {
        const report = {
            startOffset: process.hrtime(ctx.instrument.startHrTime),
            typeName,
            fieldName
        }
        ctx.instrument.calls.push(report)

        const finishRun = () => report.endOffset = process.hrtime(ctx.instrument.startHrTime);

        const result = fn(p, a, ctx, resolverInfo)
        if (result === null)
            report.result = 'null';
        else if (typeof result === 'undefined')
            report.resultUndef = 'undefined';
        else if (isPromise(result) || Array.isArray(result))
        {
            const promise = Array.isArray(result) ? Promise.all(result.filter(isPromise)) : result;
            promise.catch(e => report.error = e).then(finishRun)
            return result;
        }
        finishRun();
        return result;
    }
}


export function instrument(schema) {
    forEachField(schema, (field, typeName, fieldName) => {
        if (!field.resolve)
            field.resolve = defaultResolveFn;
        field.resolve = decorate(field.resolve, typeName, fieldName)
    })
}

const NS_PER_SEC = 1e9;
const NS_PER_MS = 1e6;
const hrConvert = (time) => time[0] * NS_PER_SEC + time[1]
const hrOp = (a, b, op) => [op(a[0], b[0]), op(a[1], b[1])]

export function report(instrument, resStart, reqStart) {
    instrument.endHrTime = hrOp(instrument.startHrTime, hrOp(resStart, reqStart, (a,b) => a - b), (a,b) => a + b)
    let totalCalls = 0;
    instrument.calls.forEach(({ typeName, fieldName, startOffset, endOffset, result }) => {
        const time = (hrConvert(endOffset) - hrConvert(startOffset)) / NS_PER_MS
        totalCalls += time
        console.log(`\t${typeName}.${fieldName} => ${time}ms`)
        stats.timing(`backend.graphql.${typeName}.${fieldName}`, time, result ? [`result:${result}`] : [])
    })
    const total = (hrConvert(instrument.endHrTime) - hrConvert(instrument.startHrTime)) / NS_PER_MS
    stats.timing(`backend.graphql.http`, total - totalCalls)
    console.log(`\tHTTP => ${total - totalCalls}ms`)
    stats.timing(`backend.graphql.total`, total)
    console.log(`\tTotal => ${total}ms`)
}

export function createContext() {
    return {
        instrument: {
            startHrTime: process.hrtime(),
            calls: []
        }
    }
}