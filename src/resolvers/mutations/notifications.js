import { needAuth } from "../util/index";
import { ObjectID } from "mongodb";

export function delNotification(root, { notif }, context) {
	needAuth(context);

	return context.db
		.collection("notifications")
		.findOneAndDelete({ _id: new ObjectID(notif) })
		.then(({ value }) => {
			error: value ? null : "This notification does not exist";
		});
}
