import { PieceCondition, PieceValue, Piecewise } from "./piecewise";

function sup<T>(...items: T[]): T {
	if (items.length === 0) {
		throw new Error("No elements supplied to sup function");
	}
	let curEl = items[0];
	items.forEach((el) => {
		if (el > curEl) {
			curEl = el;
		}
	});
	return curEl;
}
function inf<T>(...items: T[]): T {
	if (items.length === 0) {
		throw new Error("No elements supplied to sup function");
	}
	let curEl = items[0];
	items.forEach((el) => {
		if (el < curEl) {
			curEl = el;
		}
	});
	return curEl;
}

export function evalIntervalIntersection<T>(
	intA: PieceCondition<T>,
	intB: PieceCondition<T>
): PieceCondition<T>[] {
	if (intA.kind !== "Interval" || intB.kind !== "Interval") {
		throw new Error("Can't evaluate the intersection of non-interval");
	}
	if (
		intA.inf.kind !== "Constant" ||
		intA.sup.kind !== "Constant" ||
		intB.inf.kind !== "Constant" ||
		intB.sup.kind !== "Constant"
	) {
		throw new Error("Can't evaluate non-constant bounds");
	}
	if (intA.inf.value > intB.sup.value || intB.inf.value > intA.sup.value) {
		return [];
	}
	if (JSON.stringify(intA.value) != JSON.stringify(intB.value)) {
		// Can't do complex evals yet.
		return [intA, intB];
	}

	const newInf = sup(intA.inf.value, intB.inf.value);
	const newSup = inf(intA.sup.value, intB.sup.value);

	const hasMin =
		evalPieceCondition(newInf, intA) && evalPieceCondition(newInf, intB);
	const hasMax =
		evalPieceCondition(newSup, intA) && evalPieceCondition(newSup, intB);

	return [
		{
			kind: "Interval",
			value: intA.value,
			inf: {
				kind: "Constant",
				value: newInf,
			},
			sup: {
				kind: "Constant",
				value: newSup,
			},
			hasMin,
			hasMax,
		},
	];
}

export function evalPieceCondition<T>(x: T, cond: PieceCondition<T>): boolean {
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
