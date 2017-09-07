export default function needAuth(req) {
  if (!req.user) throw new Error('User not authenticated')
}