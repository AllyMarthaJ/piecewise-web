import { Piecewise } from "../piecewise";
import { abs } from "./abs";

export const doubleRampContrived: Piecewise<number> = {
	kind: "Piecewise",
	value: [
		{
			kind: "Piece",
			value: [abs],
			condition: [
				{
					kind: "Interval",
					inf: {
						kind: "Constant",
						value: 2,
					},
					sup: {
						kind: "Constant",
						value: Infinity,
					},
					value: abs,
					hasMin: true,
					hasMax: false,
				},
			],
		},
		{
			kind: "Piece",
			value: [
				{
					kind: "Constant",
					value: 2,
				},
			],
			condition: [
				{
					kind: "Interval",
					inf: {
						kind: "Constant",
						value: -Infinity,
					},
					sup: {
						kind: "Constant",
						value: 2,
					},
					value: abs,
					hasMin: false,
					hasMax: true,
				},
			],
		},
	],
};
