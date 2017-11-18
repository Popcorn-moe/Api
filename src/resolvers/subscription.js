import { withFilter } from 'graphql-subscriptions';
import { pubsub } from "../../index";

type Context = any;

export const test = {
	subscribe: withFilter(
		(root, args, context) => {
			console.log(root, args, context, pubsub);
			return pubsub.asyncIterator('test')
		},
		(payload, variables, context) => {
					console.log(payload);
					return variables.param === payload.licorne
		}
	),
	resolve(payload, args, context, info) {
		return payload.name
	}
}

export const notification = {
	subscribe: withFilter(
		(root, args, context) => {
			return pubsub.asyncIterator('notification')
		},
		(payload, variables, context) => {
			return context.user.id === payload.user;
		}
	),
	resolve(payload, args, context, info) {
		return payload
	}
}
