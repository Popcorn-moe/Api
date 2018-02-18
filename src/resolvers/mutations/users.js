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

export function setAvatar(root, { file }, context) {
	needAuth(context);
	file.then(file => {
		if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
			return {
				error: `MimeType ${file.mimetype} is not and image Mime Type`
			};
		}
		return context.user
			.then(
				user => (
					console.log("Lol"),
					context.storage.save(file).then(url => {
						console.log(url);
						user.avatar = url;
						return user.save();
					})
				)
			)
			.then(() => ({
				error: null
			}));
	});
}

export function updateUsers(root, { users }, context) {
	return needGroup(context, ADMIN)
		.then(() =>
			Promise.all(
				users.map(user =>
					context.db
						.collection("users")
						.updateOne({ _id: new ObjectID(user.id) }, { $set: user })
				)
			)
		)
		.then(() => users.map(({ id }) => id));
}

export function sendFriendsRequests(root, { to }, context) {
	needAuth(context);
	return context.user.then(user =>
		context.db
			.collection("users")
			.find({ _id: { $in: to.map(u => new ObjectID(u)) } })
			.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
			.toArray()
			.then(
				founds =>
					founds.length > 0
						? notifyFriendRequests(
								founds.map(u => ({ _from: user, user: u })),
								context
							)
						: []
			)
	);
}

export function acceptFriendRequest(root, { notif }, context) {
	needAuth(context);
	return {
		error: context.db
			.collection("notifications")
			.findOneAndDelete({ _id: new ObjectID(notif) })
			.then(
				({ value }) =>
					value
						? addFriend(null, { user: value._from }, context).error
						: "This notification does not exist"
			)
	};
}

export function delFriend(root, { friend }, context) {
	needAuth(context);
	return context.user.then(u => {
		const index = u.friends.findIndex(f => f == friend);
		if (index === -1) return false;
		context.db
			.collection("users")
			.updateOne({ _id: new ObjectID(friend) }, { $pull: { friends: u._id } });
		u.friends.splice(index, 1);
		return u.save();
	});
}

function addFriend(root, { user }, context) {
	needAuth(context);
	return context.user.then(u => {
		if (u.id == user) return { error: "You can't be friend with yourself!" };
		if (!u.friends) u.friends = [];
		if (u.friends.filter(u => u == user).length > 0)
			return { error: "You are already friends" };
		context.db
			.collection("users")
			.updateOne(
				{ _id: new ObjectID(user) },
				{ $addToSet: { friends: u.id } },
				{ upsert: true }
			);
		u.friends.push(new ObjectID(user));
		newFriendEvent({ user: u.id, friend: new ObjectID(user) }, context);
		newFriendEvent({ user: new ObjectID(user), friend: u.id }, context);
		return !u.save() ? { error: null } : { error: "nothing to save" };
	});
}
