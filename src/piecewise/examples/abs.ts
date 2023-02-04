import { Piecewise } from "../piecewise";

// absolute value
export const abs: Piecewise<number> = {
	kind: "Piecewise",
	value: [
		{
			kind: "Piece",
			value: [
				{
					kind: "Expression",
					value: "x",
					eval: (x) => x,
				},
			],
			condition: [
				{
					kind: "Interval",
					value: {
						kind: "Expression",
						value: "x",
						eval: (x) => x,
					},
					inf: {
						kind: "Constant",
						value: 0,
					},
					sup: {
						kind: "Constant",
						value: Infinity,
					},
					hasMin: true,
					hasMax: false,
				},
			],
		},
		{
			kind: "Piece",
			value: [
				{
					kind: "Expression",
					value: "-x",
					eval: (x) => -x,
				},
			],
			condition: [
				{
					kind: "Interval",
					value: {
						kind: "Expression",
						value: "x",
						eval: (x) => x,
					},
					inf: {
						kind: "Constant",
						value: -Infinity,
					},
					sup: {
						kind: "Constant",
						value: 0,
					},
					hasMin: false,
					hasMax: true,
				},
			],
		},
	],
};
