/* @flow */

type ID = string
type Context = any

export function me(context: Context, ignored: any, req: any): ?User
{
    if(req.user) {
        return req.user.then(({
                    id, login, email, group, newsletter,
                    account_registered, ratings, avatar
                } : User) => ({
                    id, login, email, group, newsletter,
                    account_registered, ratings, avatar
                }))
    } else
        return null
}


export function tags(context: Context): Promise<Array<Tag>>
{
    return context.db.collection('tags')
        .find()
        .map(data => {
            data.id = data._id
            return data
        })
        .map(({ id, name, desc, color }: Tag) => ({
            id, name, desc, color
        }))
        .toArray()
}

/*export function animes(context: Context, { limit, sort }: { limit: number, sort: Sort }): ?Array<Anime>
{
    return context.db.collection('animes')
        .find()
        .limit(limit)
        .sort(sort === 'NONE' ? {} : {
            name: sort === 'ASC' ? 1 : -1
        })
        .map(({
                  _id: id, names, authors, tags, status, medias,
                  season, release_date, edit_date, posted_date
              }: Anime) => ({
                 id, names, authors, tags, status, medias,
                 season, release_date, edit_date, posted_date
             })
        );
}

export function author(context: Context, { id }: { id: ID }): ?Author
{
    return context.db.collection('authors')
        .find({ _id: id })
        .limit(1)
        .map(({ _id: id, name, picture, bio, organisation, animes }: Author) =>
                 ({ id, name, picture, bio, organisation, animes }))
        .next();
}

export function anime(context: Context, { id }: { id: ID }): ?Anime
{
    return context.db.collection('animes')
        .find({ _id: id })
        .limit(1)
        .map(({
                  id, names, authors, tags, status, medias,
                  season, release_date, edit_date, posted_date
              }: Anime) => ({
            id, names, authors, tags, status, medias,
            season, release_date, edit_date, posted_date
        }))
        .next();
}

export function tag(context: Context, { id }: { id: ID }): ?Tag
{
    return context.db.collection('tags')
        .find({ _id: id })
        .limit(1)
        .map(({ _id: id, name, desc }: Tag) => ({ id, name, desc }))
        .next();
}

export function media(context: Context, { id }: { id: ID }): ?Media
{
    return context.db.collection('medias')
        .find({ id })
        .limit(1)
        .map(({
                  _id: id, comments, type, rate, release_date,
                  edit_date, posted_date
              }: Media) => ({
            _id: id, comments, type, rate, release_date,
            edit_date, posted_date
        }))
        .next();
}*/