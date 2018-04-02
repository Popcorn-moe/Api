import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";

const GROUPS = ["VIEWER", "MODERATOR", "ADMIN"];

export default class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { requires, error } = this.args;
		const { resolve = defaultFieldResolver } = field;
		field.resolve = function(root, args, context, info) {
			if (!context.user) {
				if (error) throw new Error("User not authenticated");
				else return null;
			}

			const index = GROUPS.indexOf(requires);
			if (index === -1) {
				if (error)
					throw new Error(`Group ${requires} not in ${GROUPS.join(",")}`);
				else return null;
			}
			return context.user.then(user => {
				if (GROUPS.indexOf(user.group) >= index)
					return resolve.call(this, root, args, context, info);
				else {
					if (error) return Promise.reject(`Need group ${group}`);
					else return Promise.resolve(null);
				}
			});
		};
	}
}
