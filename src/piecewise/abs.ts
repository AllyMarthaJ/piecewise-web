import { Piecewise } from "./piecewise";

// absolute value
export const abs: Piecewise<number> = {
    kind: "Piecewise",
    value: [
        {
            kind: "Piece",
            value: {
                kind: "Expression",
                value: "x",
                eval: (x) => x
            },
            condition: {
                kind: "Interval",
                value: {
                    kind: "Expression",
                    value: "x",
                    eval: (x) => x
                },
                left: {
                    kind: "Expression",
                    value: "0",
                    eval: (x) => 0
                },
                right: {
                    kind: "Expression",
                    value: "\\infty",
                    eval: (x) => Infinity
                },
                leftInclusive: true,
                rightInclusive: false
            }
        },
        {
            kind: "Piece",
            value: {
                kind: "Expression",
                value: "-x",
                eval: (x) => -x
            },
            condition: {
                kind: "Interval",
                value: {
                    kind: "Expression",
                    value: "x",
                    eval: (x) => x
                },
                left: {
                    kind: "Expression",
                    value: "-\\infty",
                    eval: (x) => -Infinity
                },
                right: {
                    kind: "Expression",
                    value: "0",
                    eval: (x) => 0
                },
                leftInclusive: false,
                rightInclusive: true
            }
        },
    ]
};