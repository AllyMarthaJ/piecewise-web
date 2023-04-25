import { abs } from "../examples/abs";
import { doubleRamp } from "../examples/doubleRamp";
import { evalIntervalIntersection, evalPiecewise } from "../eval";
import { texifyPiecewise } from "../texify";
import { flattenPiecewise } from "../flatten";
import { _flattenedDoubleRamp } from "./_flattenedDoubleRamp";
import { PieceCondition } from "../piecewise";

describe("piecewise#evalPiecewise", () => {
	describe("with the absolute value function", () => {
		it("evaluates positive values", () => {
			const result = evalPiecewise(1, abs);

			expect(result).toEqual([1]);
		});

		it("evaluates negative values", () => {
			const result = evalPiecewise(-1, abs);

			expect(result).toEqual([1]);
		});

		it("evaluates zero", () => {
			const result = evalPiecewise(0, abs);

			expect(result).toEqual([0]);
		});
	});

	describe("with the double ramp function", () => {
		it("evaluates values greater than 1", () => {
			const result = evalPiecewise(2, doubleRamp);

			expect(result).toEqual([1]);
		});

		it("evaluates at 1", () => {
			const result = evalPiecewise(1, doubleRamp);

			expect(result).toEqual([0]);
		});

		it("evaluates in between -1 and 1 exclusive", () => {
			const result = evalPiecewise(0, doubleRamp);

			expect(result).toEqual([0]);
		});

		it("evaluates at -1", () => {
			const result = evalPiecewise(-1, doubleRamp);

			expect(result).toEqual([0]);
		});

		it("evaluates at values less than -1", () => {
			const result = evalPiecewise(-2, doubleRamp);

			expect(result).toEqual([1]);
		});
	});

	describe("with an interval", () => {
		it("returns the intersection of an expression with itself", () => {
			const expr = {
				kind: "Interval",
				value: {
					kind: "Expression",
					value: "x",
					eval: (x: number) => x,
				},
				inf: {
					kind: "Constant",
					value: 2,
				},
				sup: {
					kind: "Constant",
					value: Infinity,
				},
				hasMin: true,
				hasMax: false,
			} as PieceCondition<number>;

			expect(
				JSON.stringify(evalIntervalIntersection(expr, expr))
			).toEqual(JSON.stringify([expr]));
		});
	});
});

describe("piecewise#texifyPiecewise", () => {
	describe("with the absolute value function", () => {
		it("texifies", () => {
			const noWhitespaceTex = texifyPiecewise(abs).replace(/\s/g, "");

			expect(noWhitespaceTex).toContain(
				"x&x\\in\\left[0,\\infty\\right)"
			);
			expect(noWhitespaceTex).toContain(
				"-x&x\\in\\left(-\\infty,0\\right]"
			);
		});
	});

	describe("with the double ramp function", () => {
		it("texifies", () => {
			const noWhitespaceTex = texifyPiecewise(doubleRamp).replace(
				/\s/g,
				""
			);

			expect(noWhitespaceTex).toContain(
				"-x-1&x\\in\\left(-\\infty,-1\\right]"
			);
			expect(noWhitespaceTex).toContain(
				"0&x\\in\\left(-\\infty,1\\right]"
			);
			expect(noWhitespaceTex).toContain(
				"x-1&x\\in\\left[1,\\infty\\right)"
			);
			expect(noWhitespaceTex).toContain("x\\in\\left[-1,\\infty\\right)");
		});
	});
});

describe("piecewise#flattenPiecewise", () => {
	describe("with the absolute value function", () => {
		it("does not flatten", () => {
			const flattenedAbs = flattenPiecewise(abs);

			expect(flattenedAbs).toEqual(abs);
		});
	});

	describe("with the double ramp function", () => {
		it("flattens", () => {
			// Hacks because we have functions in the objects, which toMatchObject
			// does not catch.
			const flattenedDoubleRamp = JSON.stringify(
				flattenPiecewise(doubleRamp)
			);

			expect(flattenedDoubleRamp).toEqual(
				JSON.stringify(_flattenedDoubleRamp)
			);
		});

		it("does not flatten twice", () => {
			const flattenedDoubleRamp = flattenPiecewise(doubleRamp);
			const doubleFlattenedDoubleRamp = flattenPiecewise(doubleRamp);

			expect(JSON.stringify(doubleFlattenedDoubleRamp)).toEqual(
				JSON.stringify(flattenedDoubleRamp)
			);
		});
	});
});
