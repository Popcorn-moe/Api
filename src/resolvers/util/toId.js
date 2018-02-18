export default function toId(name) {
	return name
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/ /g, "-")
		.toLowerCase();
}
