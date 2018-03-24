import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";
import { ObjectID } from "mongodb";

export default class LinkDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { collection, objectId = true } = this.args;
		const fieldName = this.visitedType.name;
		const { type } = this.visitedType.astNode;
		const isList =
			(type.kind === "NonNullType" ? type.type : type).kind === "ListType";

		field.resolve = (root, args, context) => {
			if (root[fieldName]) {
				if (isList)
					return context.db
						.collection(collection)
						.find({
							_id: {
								$in: root[fieldName].map(
									id => (objectId ? new ObjectID(id) : id)
								)
							}
						})
						.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
						.toArray();
				else
					return context.db
						.collection(collection)
						.findOne({
							_id: objectId ? new ObjectID(root[fieldName]) : root[fieldName]
						})
						.then(({ _id, ...fields }) => ({ id: _id, ...fields }));
			} else return type.kind == "NonNullType" ? [] : null;
		};
	}
}
