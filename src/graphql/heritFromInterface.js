import { forEachField } from "graphql-tools";

export default function heritFromInterface(schema) {
	forEachField(schema, (field, typeName, fieldName) => {
		if (!field.resolve) {
			const type = schema._typeMap[typeName];
			if (type._interfaces) {
				const interfaces = type._interfaces
					.map(inter => inter._fields[fieldName])
					.filter(i => i);
				if (interfaces.length > 1)
					console.warn(
						"Type",
						typeName,
						"has more than one interface with field",
						fieldName,
						"heritance won't be applied"
					);
				else if (interfaces.length == 1) {
					const [inter] = interfaces;
					field.resolve = inter.resolve;
					field.description = inter.description;
					field.deprecationReason = inter.deprecationReason;
				}
			}
		}
	});
}
