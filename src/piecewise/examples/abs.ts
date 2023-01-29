import { Piecewise } from "../piecewise";

// absolute value
export const abs: Piecewise<number> = {
    kind: "Piecewise",
    value: [
        {
            kind: "Piece",
            value: [{
                kind: "Expression",
                value: "x",
                eval: (x) => x
            }],
            condition: [{
                kind: "Interval",
                value: {
                    kind: "Expression",
                    value: "x",
                    eval: (x) => x
                },
                left: {
                    kind: "Constant",
                    value: 0,
                },
                right: {
                    kind: "Constant",
                    value: Infinity,
                },
                leftInclusive: true,
                rightInclusive: false
            }]
        },
        {
            kind: "Piece",
            value: [{
                kind: "Expression",
                value: "-x",
                eval: (x) => -x
            }],
            condition: [{
                kind: "Interval",
                value: {
                    kind: "Expression",
                    value: "x",
                    eval: (x) => x
                },
                left: {
                    kind: "Constant",
                    value: -Infinity
                },
                right: {
                    kind: "Constant",
                    value: 0
                },
                leftInclusive: false,
                rightInclusive: true
            }]
        },
    ]
};