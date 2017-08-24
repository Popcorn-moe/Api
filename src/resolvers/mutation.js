/* @flow */

type ID = string
type Context = any

export function me(context: Context, { user }: { user: ?User }): User
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

function now() { return new Date().getTime(); }

