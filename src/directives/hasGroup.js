import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";

const GROUPS = ["VIEWER", "MODERATOR", "ADMIN"];

export default class HasGroupDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { group } = this.args;
		const { resolve = defaultFieldResolver } = field;
		field.resolve = function(root, args, context, info) {
			if (!context.user) throw new Error("User not authenticated");

			const index = GROUPS.indexOf(group);
			if (index === -1)
				throw new Error(`Group ${group} not in ${GROUPS.join(",")}`);
			return context.user.then(user => {
				if (GROUPS.indexOf(user.group) >= index)
					return resolve.call(this, root, args, context, info);
				else return Promise.reject(`Need group ${group}`);
			});
		};
	}
}
