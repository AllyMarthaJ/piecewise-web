import { abs } from "./piecewise/abs";
import { doubleRamp } from "./piecewise/doubleRamp";
import { evalPiecewise } from "./piecewise/eval";

describe("piecewise#evalPiecewise", () => {
    describe("with the absolute value function", () => {
        it("evaluates positive values", () => {
            expect(evalPiecewise(1, abs)).toEqual([1]);
        });

        it("evaluates negative values", () => {
            expect(evalPiecewise(-1, abs)).toEqual([1]);
        });

        it("evaluates zero", () => {
            expect(evalPiecewise(0, abs)).toEqual([0]);
        });
    });

    describe("with the double ramp function", () => {
        it("evaluates values greater than 1", () => {
            expect(evalPiecewise(2, doubleRamp)).toEqual([1]);
        });

        it("evaluates at 1", () => {
            expect(evalPiecewise(1, doubleRamp)).toEqual([0]);
        });

        it("evaluates in between -1 and 1 exclusive", () => {
            expect(evalPiecewise(0, doubleRamp)).toEqual([0]);
        });

        it("evaluates at -1", () => {
            expect(evalPiecewise(-1, doubleRamp)).toEqual([0]);
        });

        it("evaluates at values less than -1", () => {
            expect(evalPiecewise(-2, doubleRamp)).toEqual([1]);
        });
    })
});