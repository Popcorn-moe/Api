import needAuth from "../../../../src/resolvers/util/needAuth";

describe("needGroup", () => {
	describe("given no user", () => {
		test("throw Error", () => {
			expect(() => needAuth({})).toThrow();
		});
	});
	describe("given an user", () => {
		test("return", () => {
			expect(needAuth({ user: Promise.resolve() }));
		});
	});
});
