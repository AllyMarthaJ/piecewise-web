import { Piecewise } from "./piecewise";

export const doubleRamp: Piecewise<number> = {
    kind: "Piecewise",
    value: [
        {
            kind: "Piece",
            value: {
                kind: "Expression",
                value: "-x - 1",
                eval: (x) => -x-1
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
                    eval: (x) => -Infinity,
                },
                right: {
                    kind: "Expression",
                    value: "-1",
                    eval: (x) => -1,
                },
                leftInclusive: false,
                rightInclusive: true
            }
        },
        {
            kind: "Piece",
            value: {
                kind: "Piecewise",
                value: [
                    {
                        kind: "Piece",
                        value: {
                            kind: "Expression",
                            value: "0",
                            eval: (x) => 0,
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
                                eval: (x) => -Infinity,
                            },
                            right: {
                                kind: "Expression",
                                value: "1",
                                eval: (x) => 1,
                            },
                            leftInclusive: false,
                            rightInclusive: true
                        }
                    },
                    {
                        kind: "Piece",
                        value: {
                            kind: "Expression",
                            value: "x - 1",
                            eval: (x) => x - 1
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
                                value: "1",
                                eval: (x) => 1,
                            },
                            right: {
                                kind: "Expression",
                                value: "\\infty",
                                eval: (x) => Infinity,
                            },
                            leftInclusive: true,
                            rightInclusive: false
                        }
                    }
                ]
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
                    value: "-1",
                    eval: (x) => -1,
                },
                right: {
                    kind: "Expression",
                    value: "\\infty",
                    eval: (x) => Infinity,
                },
                leftInclusive: true,
                rightInclusive: false
            }
        }
    ]
}