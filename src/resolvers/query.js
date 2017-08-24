/* @flow */

type ID = string
type Context = any

export function me(context: Context): User
{
    let id = 1; //todo
    return context.db.collection('users')
        .find({ _id: id })
        .limit(1)
        .map(({
                  _id: id, login, email, group, newsletter,
                  account_registered, ratings
              }: User) => ({
            id, login, email, group, newsletter,
            account_registered, ratings
        }))
        .next();
}


export function animes(context: Context, { limit, sort }: { limit: number, sort: Sort }): ?Array<Anime>
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
}