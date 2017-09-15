export default function graphqlUpload(upload) {
	return [
		(req, res, next) => {
			if (!req.headers['x-graphql-files']) return next()

			upload.fields(
				req.headers['x-graphql-files'].split(',').map(name => ({
					name: name.trim()
				}))
			)(req, res, next)
		},
		(req, res, next) => {
			if (req.files) {
				req.body.variables = JSON.parse(req.body.variables)
				Object.entries(req.files).forEach(([name, [file]]) => {
					name
						.split('.')
						.reduce(
							(prev, curr, i, { length }) =>
								(prev[curr] = i == length - 1 ? file : prev[curr] || {}),
							req.body.variables
						)
				})
			}
			next()
		}
	]
}
