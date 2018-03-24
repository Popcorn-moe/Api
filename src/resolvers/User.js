import { getNotifications } from "./Query";
import md5 from "md5";

export function notifications(root, args, context) {
	return getNotifications(null, { user: root.id }, context);
}

export function avatar({ avatar, email }, args, context) {
	return (
		avatar ||
		`https://www.gravatar.com/avatar/${md5(
			email.toLowerCase().trim()
		)}?d=identicon`
	);
}
