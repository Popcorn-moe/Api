import { userFollowEvent, animeFollowEvent } from "./events";
import { ObjectID } from "mongodb";

const IMAGE_MIME_TYPES = [
	"image/gif", // GIF images (lossless compression, superseded by PNG)
	"image/jpeg", // JPEG images
	"image/png", // PNG images
	"image/svg+xml" // SVG images (vector images)
];

export function setAvatar(root, { file }, context) {
	return file.then(file => {
		if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
			return {
				error: `MimeType ${file.mimetype} is not an image Mime Type`
			};
		}
		return context.user
			.then(user =>
				context.storage.save(`${user.id}_avatar`, file).then(url => {
					user.avatar = url;
					return user.save();
				})
			)
			.then(() => ({
				error: null
			}));
	});
}

export function setBackground(root, { file }, context) {
	return file.then(file => {
		if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
			return {
				error: `MimeType ${file.mimetype} is not an image Mime Type`
			};
		}
		return context.user
			.then(user =>
				context.storage.save(`${user.id}_background`, file).then(url => {
					user.background = url;
					return user.save();
				})
			)
			.then(() => ({
				error: null
			}));
	});
}

export function updateUsers(root, { users }, context) {
	return Promise.all(
		users.map(user =>
			context.db
				.collection("users")
				.updateOne({ _id: new ObjectID(user.id) }, { $set: user })
		)
	).then(() => users.map(({ id }) => id));
}

export async function follow(root, { id }, { user, db }) {
	const me = await user;
	if (!me.follows) me.follows = [];
	if (me.follows.findIndex(f => f.toString() == id) !== -1) return true;
	me.follows.push(new ObjectID(id));
	userFollowEvent(id, { user, db });
	await me.save();
	return true;
}

export async function unfollow(root, { id }, { user, db }) {
	const me = await user;
	if (!me.follows) me.follows = [];
	const follower = me.follows.findIndex(f => f.toString() == id);
	if (follower === -1) return true;
	me.follows.splice(follower, 1);
	await me.save();
	return true;
}

export async function followAnime(root, { anime }, { user, db }) {
	const me = await user;
	if (!me.animeFollows) me.animeFollows = [];
	if (me.animeFollows.findIndex(f => f.toString() == anime) !== -1) return true;
	me.animeFollows.push(new ObjectID(anime));
	animeFollowEvent(anime, { user, db });
	await me.save();
	return true;
}

export async function unfollowAnime(root, { anime: id }, { user, db }) {
	const me = await user;
	if (!me.animeFollows) me.animeFollows = [];
	const anime = me.animeFollows.findIndex(f => f.toString() == id);
	if (anime === -1) return true;
	me.animeFollows.splice(anime, 1);
	await me.save();
	return true;
}
