import { abs } from "./piecewise/examples/abs";
import { doubleRamp } from "./piecewise/examples/doubleRamp";
import { evalPiecewise } from "./piecewise/eval";
import { texifyPiecewise } from "./piecewise/texify";
import { flattenPiecewise } from "./piecewise/flatten";
import { _flattenedDoubleRamp } from "./piecewise/examples/_flattenedDoubleRamp";

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
});

describe("piecewise#texifyPiecewise", () => {
    describe("with the absolute value function", () => {
        it("texifies", () => {
            const noWhitespaceTex = texifyPiecewise(abs).replace(/\s/g, "");

            expect(noWhitespaceTex).toContain("x&x\\in\\left[0,\\infty\\right)");
            expect(noWhitespaceTex).toContain("-x&x\\in\\left(-\\infty,0\\right]");
        });
    });

    describe("with the double ramp function", () => {
        it("texifies", () => {
            const noWhitespaceTex = texifyPiecewise(doubleRamp).replace(/\s/g, "");

            expect(noWhitespaceTex).toContain("-x-1&x\\in\\left(-\\infty,-1\\right]");
            expect(noWhitespaceTex).toContain("0&x\\in\\left(-\\infty,1\\right]");
            expect(noWhitespaceTex).toContain("x-1&x\\in\\left[1,\\infty\\right)");
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
            const flattenedDoubleRamp = JSON.stringify(flattenPiecewise(doubleRamp));

            expect(flattenedDoubleRamp).toEqual(JSON.stringify(_flattenedDoubleRamp));
        });

        it("does not flatten twice", () => {
            const flattenedDoubleRamp = flattenPiecewise(doubleRamp);
            const doubleFlattenedDoubleRamp = flattenPiecewise(doubleRamp);

            expect(JSON.stringify(doubleFlattenedDoubleRamp)).toEqual(JSON.stringify(flattenedDoubleRamp));
        });
    })
})