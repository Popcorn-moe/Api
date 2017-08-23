/* @flow */

type ID = string
type Context = any

export function me(context: Context): User {
    return {
        id: "abc",
        login: "example",
        email: "example",
        group: 1,
        newsletter: false,
        account_registered: true,
        ratings: [],
        rating_for: null
    }
}
export function animes(context: Context, { limit, sort } : { limit: number, sort: Sort }): ?Array<Anime> {
    return null;
}
export function author(context: Context, { id } : { id : ID }): ?Author {
    return null;
}
export function anime(context: Context, { id } : { id : ID }): ?Anime {
    return null;
}
export function tag(context: Context, { id } : { id : ID }): ?Tag {
    console.log(id)
    return null;

}
export function media(context: Context, { id } : { id : ID }): ?Media {
    return null;
}