import groups from "./groups";
import { needAuth } from ".";

export default function needGroup(req, group) {
	needAuth(req);
	const index = groups.indexOf(group);
	if (index == -1) throw new Error(`Group ${group} not in ${groups.join(",")}`);
	return req.user.then(user => {
		if (groups.indexOf(user.group) >= index) return user;
		else return Promise.reject(`Need group ${group}`);
	});
}
