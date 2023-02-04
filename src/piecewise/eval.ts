import { PieceCondition, PieceValue, Piecewise } from "./piecewise";

function evalPieceCondition<T>(x: T, cond: PieceCondition<T>): boolean {
	switch (cond.kind) {
		case "Interval":
			const targetValues = evalPieceValue(x, cond.value);
			const infValues = evalPieceValue(x, cond.inf);
			const supValues = evalPieceValue(x, cond.sup);

			if (
				targetValues.length !== 1 ||
				infValues.length !== 1 ||
				supValues.length !== 1
			) {
				throw new Error(
					"Multivalued piecewise object: could not reconcile bounds or input."
				);
			}

			const target = targetValues[0];
			const inf = infValues[0];
			const sup = supValues[0];

			const matchLeft = cond.hasMin ? target >= inf : target > inf;
			const matchRight = cond.hasMax ? target <= sup : target < sup;

			return matchLeft && matchRight;
	}
}

function evalPieceValue<T>(x: T, value: PieceValue<T>): T[] {
	switch (value.kind) {
		case "Expression":
			return [value.eval(x)];
		case "Constant":
			return [value.value];
		case "Piecewise":
			return evalPiecewise(x, value);
		case "MultivaluedPiecewise":
			return evalPiecewise(x, value);
	}
}

export function evalPiecewise<T>(x: T, piecewise: Piecewise<T>): T[] {
	const relevantPieces = piecewise.value.filter((piece) =>
		piece.condition.every((cond) => evalPieceCondition(x, cond))
	);

	let values: T[] = [];
	relevantPieces.forEach((piece) => {
		piece.value.forEach((value) => {
			values.push(...evalPieceValue(x, value));
		});
	});

	switch (piecewise.kind) {
		case "Piecewise":
			return [...new Set(values)];
		case "MultivaluedPiecewise":
			return values;
	}
}
