/* @flow */

type ID = string
type Context = any

export function me(context: any): User {
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
export function animes(limit: number, sort: Sort, context: Context): ?Array<Anime> {
    return null;
}
export function author(id: ID, context: Context): ?Author {
    return null;
}
export function anime(id: ID, context: Context): ?Anime {
    return null;
}
export function tag(id: ID, context: Context): ?Tag {
    return null;

}
export function media(id: ID, context: Context): ?Media {
    return null;
}