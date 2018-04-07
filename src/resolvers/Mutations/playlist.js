import { ObjectID } from "mongodb";
import { now } from "../util";

export async function addPlaylist(root, { name }, { user, db }) {
	const me = await user;
	return db
		.collection("playlists")
		.insertOne({
			name,
			owner: new ObjectID(me.id)
		})
		.then(({ insertedId }) => {
			if (!me.playlists) me.playlists = [];
			me.playlists.push(insertedId);
			me.save();
			return insertedId;
		});
}

export function remPlaylist(root, { id }, { user, db }) {
	return db
		.collection("playlists")
		.deleteOne({ _id: new ObjectID(id) })
		.then(async () => {
			const me = await user;
			if (!me.playlists) me.playlists = [];
			const playlist = me.playlists.findIndex(f => f.toString() == id);
			if (playlist !== -1) {
				me.playlists.splice(playlist, 1);
				me.save();
			}
			return id;
		});
}

export function addAnimeToPlaylist(root, { playlist, anime }, { user, db }) {
	const element = { anime, date: now() };
	return db
		.collection("playlists")
		.updateOne(
			{
				_id: new ObjectID(playlist)
			},
			{
				$push: { elements: element }
			}
		)
		.then(() => element);
}

export function addMediaToPlaylist(root, { playlist, media }, { user, db }) {
	const element = { media: new ObjectID(media), date: now() };
	return db
		.collection("playlists")
		.updateOne(
			{
				_id: new ObjectID(playlist)
			},
			{
				$push: { elements: element }
			}
		)
		.then(() => element);
}

export function remAnimeFromPlaylist(root, { playlist, anime }, { user, db }) {
	return db
		.collection("playlists")
		.updateOne(
			{
				_id: new ObjectID(playlist)
			},
			{
				$pull: { elements: { anime } }
			}
		)
		.then(() => element);
}

export function remMediaFromPlaylist(root, { playlist, anime }, { user, db }) {
	return db
		.collection("playlists")
		.updateOne(
			{
				_id: new ObjectID(playlist)
			},
			{
				$pull: { elements: { media: new ObjectID(media) } }
			}
		)
		.then(() => element);
}
