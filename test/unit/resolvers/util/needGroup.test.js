import needGroup from "../../../../src/resolvers/util/needGroup";
import {
	ADMIN,
	MODERATOR,
	VIEWER
} from "../../../../src/resolvers/util/groups";

describe("needGroup", () => {
	const USER = { group: MODERATOR };
	let req;
	beforeEach(() => {
		req = {
			user: Promise.resolve(USER)
		};
	});
	describe("given an unknown group", () => {
		test("throw Error", () => {
			expect(() => needGroup(req, "unicorn")).toThrow();
		});
	});
	describe("given a group", () => {
		test("return user if group is valid", () => {
			return needGroup(req, VIEWER).then(res => expect(res).toBe(USER));
		});
		test("throw Error if group is invalid", () => {
			return needGroup(req, ADMIN).then(
				res => expect(res).toBeUndefined(),
				err => expect(err).toBeDefined()
			);
		});
	});
});
