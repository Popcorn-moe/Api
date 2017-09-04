/* @flow */

type ID = string
type Context = any
type Upload = any

// https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Images_types

const IMAGE_MIME_TYPES = [
    'image/gif',	// GIF images (lossless compression, superseded by PNG)
    'image/jpeg',	// JPEG images
    'image/png',	// PNG images
    'image/svg+xml' // SVG images (vector images)
]

export function setAvatar(context: Context, { file } : { file: Upload }, req: any) : Promise<Result> | Result {
    if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
        context.storage.removeFile(file)
        return {
            error: `MimeType ${file.mimetype} is not and image Mime Type`
        }
    }
    return req.user.then(user => {
        user.avatar = context.storage.getUrl(file)
        return user.save()
    }).then(() => ({
        error: null
    }))
}

/*export function me(context: Context, { user }: { user: ?User }): User
{
    //todo: check if user.id is the right id
    return context.db.collection('users')
        .findOneAndUpdate({ _id: user.id }, {
            $set: {
                login     : user.login,
                email     : user.email,
                group     : user.group,
                newsletter: user.newsletter,
                ratings   : user.ratings,
                last_edit : now()
            }
        }, { returnOriginal: false })
        .then(r => r.value);
}

export function comment(context: Context, { media, content }: { media: ?ID, content: ?string }): ID
{
    let user = null; //todo: get user
    return context.db.collection('comments')
        .insertOne(
            {
                user,
                content,
                posted: now()
            })
        .then(r => r.insertedId);
}

export function edit_comment(context: Context, { id, content }: { id: ?ID, content: ?string })
{
    let user = null; //todo: get user
    return context.db.collection('comments')
        .findOneAndUpdate({ _id: id }, {
            $set: {
                user,
                content,
                edited: now()
            }
        });
}

export function rate(context: Context, { media, rating }: { media: ?ID, rating: ?number })
{
    let user = null; //todo: get user
    return context.db.collection('ratings')
        .insertOne(
            {
                media,
                rating,
                time: now()
            });
}

function now() { return new Date().getTime(); }*/

