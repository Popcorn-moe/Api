import {
	needAuth,
	needGroup,
	ADMIN,
	notifyFriendRequests
} from "../util/index";
import { newFriendEvent } from "./events";
import { ObjectID } from "mongodb";

const IMAGE_MIME_TYPES = [
	"image/gif", // GIF images (lossless compression, superseded by PNG)
	"image/jpeg", // JPEG images
	"image/png", // PNG images
	"image/svg+xml" // SVG images (vector images)
];

export async function setAvatar(root, { file }, context) {
	needAuth(context);

	file = await file;

	if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
		return { error: `MimeType ${file.mimetype} is not and image Mime Type` };
	}

	const user = await context.user;
	const url = await context.storage.save(user.id, file);
	user.avatar = url;
	await user.save();

	return { error: null };
}

export async function updateUsers(root, { users }, context) {
	await needGroup(context, ADMIN);

	await Promise.all(
		users.map(user =>
			context.db
				.collection("users")
				.updateOne({ _id: new ObjectID(user.id) }, { $set: user })
		)
	);

	return users.map(({ id }) => id);
}

export async function sendFriendsRequests(root, { to }, context) {
	needAuth(context);

	const user = await context.user;

	const founds = await context.db
		.collection("users")
		.find({ _id: { $in: to.map(u => new ObjectID(u)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();

	return founds.length > 0
		? notifyFriendRequests(founds.map(u => ({ _from: user, user: u })), context)
		: [];
}

export async function acceptFriendRequest(root, { notif }, context) {
	needAuth(context);

	const { value } = await context.db
		.collection("notifications")
		.findOneAndDelete({ _id: new ObjectID(notif) });

	return {
		error: value
			? addFriend(null, { user: value._from }, context).error
			: "This notification does not exist"
	};
}

export async function delFriend(root, { friend }, context) {
	needAuth(context);

	const user = await context.user;
	const index = user.friends.findIndex(f => f == friend);

	if (index === -1) return false;

	await context.db
		.collection("users")
		.updateOne({ _id: new ObjectID(friend) }, { $pull: { friends: u._id } });

	user.friends.splice(index, 1);
	return user.save();
}

export async function addFriend(root, { user: other }, context) {
	needAuth(context);

	const user = await context.user;

	if (user.id == other) return { error: "You can't be friend with yourself!" };
	if (!user.friends) user.friends = [];

	if (user.friends.includes(other)) return { error: "You are already friends" };

	await context.db
		.collection("users")
		.updateOne(
			{ _id: new ObjectID(other) },
			{ $addToSet: { friends: user.id } },
			{ upsert: true }
		);

	user.friends.push(new ObjectID(other));

	newFriendEvent({ user: user.id, friend: new ObjectID(other) }, context);
	newFriendEvent({ user: new ObjectID(other), friend: user.id }, context);

	return { error: (await u.save()) ? "nothing to save" : null };
}
