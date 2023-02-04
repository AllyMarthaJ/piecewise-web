import { Piecewise } from "../piecewise";

export const doubleRamp: Piecewise<number> = {
	kind: "Piecewise",
	value: [
		{
			kind: "Piece",
			value: [
				{
					kind: "Expression",
					value: "-x - 1",
					eval: (x) => -x - 1,
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
						value: -1,
					},
					hasMin: false,
					hasMax: true,
				},
			],
		},
		{
			kind: "Piece",
			value: [
				{
					kind: "Piecewise",
					value: [
						{
							kind: "Piece",
							value: [
								{
									kind: "Constant",
									value: 0,
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
										value: 1,
									},
									hasMin: false,
									hasMax: true,
								},
							],
						},
						{
							kind: "Piece",
							value: [
								{
									kind: "Expression",
									value: "x - 1",
									eval: (x) => x - 1,
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
										value: 1,
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
					],
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
						value: -1,
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
	],
};
