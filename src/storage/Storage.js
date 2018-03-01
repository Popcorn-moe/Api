export default class Storage {
	register(app) {}

	save(filename, { mimetype, stream }, ...transforms) {
		return this.write(
			filename + "",
			mimetype,
			transforms.reduce((c, fn) => c.pipe(fn), stream)
		);
	}
}
