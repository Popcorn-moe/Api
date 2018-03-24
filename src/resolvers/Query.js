import { needAuth } from "./util";
import { ObjectID } from "mongodb";

export function me(root, args, context) {
	return context.user
		? context.user.then(user => {
				if (!user.friends) user.friends = [];
				if (!user.blocked) user.blocked = [];
				return user;
			})
		: null;
}

export function tags(root, args, context) {
	return context.db
		.collection("tags")
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function users(root, args, context) {
	return context.db
		.collection("users")
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function user(root, { name }, context) {
	return context.db
		.collection("users")
		.find({ login: new RegExp(escapeRegExp(name), "i") })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function userById(root, { id }, context) {
	return context.db
		.collection("users")
		.find({ _id: new ObjectID(id) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function searchUser(root, { name, limit }, context) {
	return name
		? context.db
				.collection("users")
				.find({ login: new RegExp(escapeRegExp(name), "i") })
				.limit(limit)
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray()
		: [];
}

export function searchAnime(root, { name, limit }, context) {
	return name
		? context.db
				.collection("animes")
				.find({ names: new RegExp(escapeRegExp(name), "i") })
				.limit(limit)
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray()
		: [];
}

export function authors(root, args, context) {
	return context.db
		.collection("authors")
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function author(root, { id }, context) {
	return context.db
		.collection("authors")
		.find({ _id: new ObjectID(id) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function animes(root, { limit, sort }, context) {
	return context.db
		.collection("animes")
		.find()
		.limit(limit)
		.sort(
			sort === "NONE"
				? {}
				: {
						name: sort === "ASC" ? 1 : -1
					}
		)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function anime(root, { id }, context) {
	return context.db
		.collection("animes")
		.find({ _id: id })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function media(root, { media, anime, episode, season }, context) {
	return context.db
		.collection("medias")
		.find(media ? { _id: new ObjectID(media) } : { anime, episode, season })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function comment(root, { id }, context) {
	return context.db
		.collection("comments")
		.find({ _id: new ObjectID(id) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function lastEpisodes(root, { limit }, context) {
	return context.db
		.collection("medias")
		.find({ type: "EPISODE" })
		.limit(limit)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function lastTrailers(root, { limit }, context) {
	return context.db
		.collection("medias")
		.find({ type: "TRAILER" })
		.limit(limit)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function slider(root, args, context) {
	return context.db
		.collection("slider")
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
		.then(slides => {
			const maxIndex = slides.reduce((c, v) => Math.max(c, v.index), 0);
			const iSlides = new Array(maxIndex + 1);
			for (const slide of slides) {
				iSlides[slide.index] = slide;
			}
			return iSlides;
		});
}

export function news(root, args, context) {
	return context.db
		.collection("news")
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function _news(root, { id }, context) {
	return context.db
		.collection("news")
		.find({ _id: new ObjectID(id) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function getNotifications(root, { user }, context) {
	return context.db
		.collection("notifications")
		.find({ user: new ObjectID(user) })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function friendRequests(root, args, context) {
	needAuth(context);
	return context.user.then(user =>
		context.db
			.collection("notifications")
			.find({ user: user._id, type: "FRIEND_REQUEST" })
			.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
			.toArray()
	);
}

export function pendingFriendRequests(root, args, context) {
	needAuth(context);
	return context.user.then(user =>
		context.db
			.collection("notifications")
			.find({ _from: user._id, type: "FRIEND_REQUEST" })
			.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
			.toArray()
	);
}

export function searchAnimes(
	root,
	{ limit, skip, name, order_by, status, type, authors, year, tags },
	context
) {
	return context.db
		.collection("animes")
		.find({
			names: new RegExp(escapeRegExp(name), "i"),
			...(status ? { status } : {}),
			...(authors
				? { authors: { $in: authors.map(a => new ObjectID(a)) } }
				: {}),
			...(tags ? { tags: { $in: tags.map(t => new ObjectID(t)) } } : {})
		})
		.skip(skip)
		.limit(limit)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function searchAuthor(root, { name }, context) {
	return name
		? context.db
				.collection("authors")
				.find({ name: new RegExp(escapeRegExp(name), "i") })
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray()
		: [];
}

export function events(root, { user }, context) {
	return context.db
		.collection("events")
		.find({ user: new ObjectID(user) })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

//moe.graphql
export function moe(root, { moe }, context) {
	return context.db
		.collection("moe")
		.find({ moe })
		.toArray()
		.then(moe => {
			if (!moe.length) throw Error("We lack the moe you requested.");
			return moe[Math.floor(Math.random() * moe.length)];
		});
}

function escapeRegExp(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
