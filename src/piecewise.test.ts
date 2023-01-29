import { abs } from "./piecewise/examples/abs";
import { doubleRamp } from "./piecewise/examples/doubleRamp";
import { evalPiecewise } from "./piecewise/eval";
import { texifyPiecewise } from "./piecewise/texify";

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
    it("with the absolute value function", () => {
        const noWhitespaceTex = texifyPiecewise(abs).replace(/\s/g, "");

        expect(noWhitespaceTex).toContain("x&x\\in\\left[0,\\infty\\right)");
        expect(noWhitespaceTex).toContain("-x&x\\in\\left(-\\infty,0\\right]");
    });

    it("with the double ramp function", () => {
        const noWhitespaceTex = texifyPiecewise(doubleRamp).replace(/\s/g, "");

        expect(noWhitespaceTex).toContain("-x-1&x\\in\\left(-\\infty,-1\\right]");
        expect(noWhitespaceTex).toContain("0&x\\in\\left(-\\infty,1\\right]");
        expect(noWhitespaceTex).toContain("x-1&x\\in\\left[1,\\infty\\right)");
        expect(noWhitespaceTex).toContain("x\\in\\left[-1,\\infty\\right)");
    });
});