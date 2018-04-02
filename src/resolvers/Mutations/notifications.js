import { ObjectID } from "mongodb";

export function delNotification(root, { notif }, context) {
	return context.db
		.collection("notifications")
		.findOneAndDelete({ _id: new ObjectID(notif) })
		.then(
			({ value }) =>
				!value ? { error: "This notification does not exist" } : { error: null }
		);
}
