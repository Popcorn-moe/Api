import { needAuth, notifyFriendRequests } from "../util/index";
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
	return file.then(file => {
		if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
			return {
				error: `MimeType ${file.mimetype} is not and image Mime Type`
			};
		}
		return context.user
			.then(user =>
				context.storage.save(user.id, file).then(url => {
					user.avatar = url;
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
