import md5 from "md5";

export function picture({ picture, id }, args, context) {
	return picture || `https://www.gravatar.com/avatar/${md5(id)}?d=robohash`;
}
