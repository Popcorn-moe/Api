import { ObjectID } from "mongodb";
import { addSeason as mAddSeason } from "./Mutations/animes";

export function seasons({ seasons, id }, args, context) {
	if (seasons) return seasons.map(season => season && { anime: id, ...season });
	else return [];
}

export function season(root, { season }, context) {
	return root.seasons[season] && { anime: root.id, ...root.seasons[season] };
}

export function addSeason(root, { season }, context) {
	return mAddSeason(root, { season, anime: root.id }, context);
}
