import { linkMedia } from "../mutations/medias";

export function linkTo(root, { anime, season, episode }, context) {
	return linkMedia(root, { media: root.id, anime, season, episode }, context);
}
