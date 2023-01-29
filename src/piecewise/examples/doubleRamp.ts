import { Piecewise } from "../piecewise";

export const doubleRamp: Piecewise<number> = {
    kind: "Piecewise",
    value: [
        {
            kind: "Piece",
            value: [{
                kind: "Expression",
                value: "-x - 1",
                eval: (x) => -x-1
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
                    value: -Infinity,
                },
                right: {
                    kind: "Constant",
                    value: -1,
                },
                leftInclusive: false,
                rightInclusive: true
            }]
        },
        {
            kind: "Piece",
            value: [{
                kind: "Piecewise",
                value: [
                    {
                        kind: "Piece",
                        value: [{
                            kind: "Constant",
                            value: 0
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
                                value: 1
                            },
                            leftInclusive: false,
                            rightInclusive: true
                        }]
                    },
                    {
                        kind: "Piece",
                        value: [{
                            kind: "Expression",
                            value: "x - 1",
                            eval: (x) => x - 1
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
                                value: 1
                            },
                            right: {
                                kind: "Constant",
                                value: Infinity
                            },
                            leftInclusive: true,
                            rightInclusive: false
                        }]
                    }
                ]
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
                    value: -1
                },
                right: {
                    kind: "Constant",
                    value: Infinity
                },
                leftInclusive: true,
                rightInclusive: false
            }]
        }
    ]
}