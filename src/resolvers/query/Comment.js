import { ObjectID } from "mongodb";
import { userById } from "./query";
import needAuth from "../util";

export function user(root, args, context) {
	return userById(null, { id: root.user }, context);
}
