import { Piece, PieceCondition, Piecewise } from "./piecewise";
import deepEqual from "deep-equal";
import { evalIntervalIntersection } from "./eval";
import { texifyPieceCondition } from "./texify";

// Simplification: Compress conditions as much as possible, where possible.
// Values ???

function simplifyConditionPair<T>(
	a: PieceCondition<T>,
	b: PieceCondition<T>
): PieceCondition<T>[] | undefined | null {
	// return empty if can't simplify

	switch (a.kind) {
		case "Interval":
			switch (b.kind) {
				case "Interval":
					if (
						a.inf.kind !== "Constant" ||
						a.sup.kind !== "Constant"
					) {
						return [];
					}
					if (
						a.sup.kind !== "Constant" ||
						a.sup.kind !== "Constant"
					) {
						return [];
					}
					if (JSON.stringify(a.value) !== JSON.stringify(b.value)) {
						return [];
					}

					const intersection = evalIntervalIntersection(a, b);

					if (!intersection?.length) {
						return null;
					}

					return intersection;
			}
	}
}

function simplifyPieceCondition<T>(
	conditions: PieceCondition<T>[]
): PieceCondition<T>[] | null {
	// This uses commutativity of intersections.
	if (conditions.length > 1) {
		let condPair: [number, number] | undefined;
		let finalIntersection;

		for (let i = 0; i < conditions.length; i++) {
			for (let j = i + 1; j < conditions.length; j++) {
				let intersection = simplifyConditionPair(
					conditions[i],
					conditions[j]
				);

				if (intersection) {
					if (intersection.length) {
						condPair = [i, j];
						finalIntersection = intersection;
					}
				} else {
					// mark for removal
					return null;
				}
			}
		}

		if (condPair && condPair.length > 0) {
			const newConditions = conditions.filter(
				(_, i) => !condPair!.includes(i)
			);
			if (finalIntersection) {
				newConditions.push(...finalIntersection);
			}

			return simplifyPieceCondition(newConditions);
		}

		return conditions;
	} else {
		return conditions;
	}
}

function simplifyPiece<T>(piece: Piece<T>): Piece<T> | null {
	// TODO: Simplify piece values.
	const conditions = simplifyPieceCondition(piece.condition);

	if (conditions !== null) {
		return {
			...piece,
			condition: conditions,
		};
	} else {
		return null;
	}
}

export function simplifyPiecewise<T>(piecewise: Piecewise<T>): Piecewise<T> {
	return {
		...piecewise,
		value: piecewise.value
			.map((piece) => simplifyPiece(piece))
			.filter((piece) => !!piece) as Piece<T>[],
	};
}
