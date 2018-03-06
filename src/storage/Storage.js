export default class Storage {
	register(app) {}

	save(filename, file, ...transforms) {
		return Promise.resolve(file).then(({ mimetype, stream }) =>
			this.write(
				filename + "",
				mimetype,
				transforms.reduce((c, fn) => c.pipe(fn), stream)
			)
		);
	}
}
