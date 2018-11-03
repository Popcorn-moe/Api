import { addAnime, addSeason, updateAnime } from "./animes";
import { addAuthor, deleteAuthor, updateAuthor } from "./authors";
import { addMedia, updateMedia, linkMedia, deleteMedia } from "./medias";
import { addNews, updateNews, deleteNews } from "./news";
import { delNotification } from "./notifications";
import { addTag, deleteTag, updateTag } from "./tags";
import { addSlide, editSlide, delSlide } from "./slider";
import { deleteComment } from "./comments";

import {
	setAvatar,
	setBackground,
	updateUsers,
	follow,
	unfollow,
	followAnime,
	unfollowAnime,
	updateMeta
} from "./users";

export {
	//ANIME
	addAnime,
	addSeason,
	updateAnime,
	//AUTHOR
	addAuthor,
	deleteAuthor,
	updateAuthor,
	//MEDIA
	addMedia,
	updateMedia,
	linkMedia,
	deleteMedia,
	//NEWS
	addNews,
	updateNews,
	deleteNews,
	//NOTIFICATIONS
	delNotification,
	//TAGS
	addTag,
	deleteTag,
	updateTag,
	//USER
	setAvatar,
	setBackground,
	updateUsers,
	follow,
	unfollow,
	followAnime,
	unfollowAnime,
	updateMeta,
	//SLIDER
	addSlide,
	editSlide,
	delSlide,
	//COMMENTS
	deleteComment
};

export function hello(root, { name }, context) {
	context.pubsub.publish("test", { name, licorne: "magique" });
	return `hello ${name}!`;
}
