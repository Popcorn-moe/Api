/* @flow */

type ID = string
type Context = any

export function me(context: Context): User
{
    let id = 1; //todo
    return context.db.collection('users')
                  .findOne({ id })
                  .then((obj: User) =>
                        {
                            if (!obj) return null;
                            let {
                                    id, login, email, group, newsletter,
                                    account_registered, ratings, rating_for
                                } = obj;

                            return {
                                id, login, email, group, newsletter,
                                account_registered, ratings, rating_for
                            };
                        });
}


export function animes(context: Context, { limit, sort }: { limit: number, sort: Sort }): ?Array<Anime>
{
    return context.db.collection('animes')
                  .find({ id })
                  .limit(limit)
                  .toArray()
                  .map(
                      ({
                           id, names, authors, tags, status, medias,
                           season, release_date, edit_date, posted_date
                       }: Anime) =>
                      {
                          return {
                              id, names, authors, tags, status, medias,
                              season, release_date, edit_date, posted_date
                          };
                      }
                  ); //todo: sort by which field?
}

export function author(context: Context, { id }: { id: ID }): ?Author
{
    return context.db.collection('authors')
                  .findOne({ id })
                  .then((obj: Author) =>
                        {
                            if (!obj) return null;
                            let { id, name, picture, bio, organisation, animes } = obj;

                            return { id, name, picture, bio, organisation, animes };
                        });
}

export function anime(context: Context, { id }: { id: ID }): ?Anime
{
    return context.db.collection('animes')
                  .findOne({ id })
                  .then((obj: Anime) =>
                        {
                            if (!obj) return null;
                            let {
                                    id, names, authors, tags, status, medias,
                                    season, release_date, edit_date, posted_date
                                } = obj;

                            return {
                                id, names, authors, tags, status, medias,
                                season, release_date, edit_date, posted_date
                            };
                        });
}

export function tag(context: Context, { id }: { id: ID }): ?Tag
{
    return context.db.collection('tags')
                  .findOne({ id })
                  .then((obj: Tag) =>
                        {
                            if (!obj) return null;
                            let { id, name, desc } = obj;

                            return { id, name, desc };
                        });
}

export function media(context: Context, { id }: { id: ID }): ?Media
{
    return context.db.collection('medias')
                  .findOne({ id })
                  .then((obj: Media) =>
                        {
                            if (!obj) return null;
                            let {
                                    id, comments, type, rate, release_date,
                                    edit_date, posted_date
                                } = obj;

                            return {
                                id, comments, type, rate, release_date,
                                edit_date, posted_date
                            };
                        });
}