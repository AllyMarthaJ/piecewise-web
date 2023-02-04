import { Piece, PieceCondition, PieceValue, Piecewise } from "./piecewise";

const intervalProp = { value: null, inf: null, sup: null };
const _intervalPropValues = Object.keys(intervalProp);
const intervalPropValues = _intervalPropValues as IntervalPropType[];

type IntervalPropType = keyof typeof intervalProp;

function flattenSingleIntervalOverProp<T>(
	piece: Piece<T>,
	index: number,
	prop: IntervalPropType
): Piece<T>[] {
	const pieceCondition = piece.condition[index];

	// We begin by destructuring under an interval: We can have 3 possible
	// nested values; see intervalProp.
	const piecePropValue = pieceCondition[prop];

	// For the *current* property (prop), let's recurse if need be.
	switch (piecePropValue.kind) {
		case "Constant":
		case "Expression":
			return [piece];
		case "Piecewise":
		case "MultivaluedPiecewise":
			// We can have piecewise under the current prop; for this, we'll need to
			// construct new pieces based on how many pieces the prop has.
			const subPiecewise = flattenPiecewise(piecePropValue);

			return subPiecewise.value.map((subPiece) => {
				// Set valued functions make no sense when dealing with inequalities.
				// No, enumerating over each piece set element makes no mathematical sense.
				if (subPiece.value.length !== 1) {
					throw new Error(
						"Multivalued piecewise object: could not reconcile condition."
					);
				}

				// For our current piece, construct new conditions based on existing conditions
				// adding in the additional sub piece conditions, AND the condition of the piece,
				// modifying the property per the value of the condition sub piece value.
				const conditions = [...piece.condition];
				const propValue = subPiece.value[0];

				conditions.splice(index, 1, ...subPiece.condition, {
					...pieceCondition,
					[prop]: propValue,
				});

				return {
					...piece,
					condition: conditions,
				};
			});
	}
}

function flattenSinglePieceCondition<T>(
	piece: Piece<T>,
	index: number,
	assertOn?: string
): Piece<T>[] {
	// There can be many piece conditions on a Piece.
	// Handle only one.
	const pieceCondition = piece.condition[index];

	switch (pieceCondition.kind) {
		case "Interval":
			let curPieces = [piece];
			intervalPropValues.forEach((prop) => {
				curPieces = curPieces.flatMap((sub) =>
					flattenSingleIntervalOverProp(sub, index, prop)
				);
			});
			return curPieces;
	}
}

// Index is the index of the piece condition inside the piece, i.e. logical AND.
function flattenPieceCondition<T>(
	piece: Piece<T>,
	index: number = 0
): Piece<T>[] {
	let pieces: Piece<T>[] = flattenSinglePieceCondition(piece, index);

	if (index == piece.condition.length - 1) {
		return pieces;
	} else {
		return pieces.flatMap((newPiece) =>
			flattenPieceCondition(newPiece, index + 1)
		);
	}
}

function flattenSinglePieceValue<T>(
	piece: Piece<T>,
	index: number
): Piece<T>[] {
	const pieceValue = piece.value[index];

	switch (pieceValue.kind) {
		case "Constant":
		case "Expression":
			return [piece];
		case "Piecewise":
		case "MultivaluedPiecewise":
			const subPiecewise = flattenPiecewise(pieceValue);
			return subPiecewise.value.map((subPiece) => {
				const pieces = [...piece.value];
				pieces.splice(index, 1, ...subPiece.value);

				return {
					...subPiece,
					value: pieces,
					condition: subPiece.condition.concat(piece.condition),
				};
			});
	}
}

// Index is the index of the piece value inside the piece, i.e. set-valued functions
function flattenPieceValue<T>(piece: Piece<T>, index: number = 0): Piece<T>[] {
	let pieces: Piece<T>[] = flattenSinglePieceValue(piece, index);

	if (index == piece.value.length - 1) {
		return pieces;
	} else {
		return pieces.flatMap((newPiece) =>
			flattenPieceValue(newPiece, index + 1)
		);
	}
}

export function flattenPiecewise<T>(piecewise: Piecewise<T>): Piecewise<T> {
	console.log(piecewise);
	let valuePieces: Piece<T>[] = [];
	piecewise.value.forEach((piece) => {
		valuePieces.push(...flattenPieceValue(piece));
	});

	let conditionPieces: Piece<T>[] = [];
	valuePieces.forEach((piece) => {
		conditionPieces.push(...flattenPieceCondition(piece));
	});

	return {
		...piecewise,
		value: conditionPieces,
	};
}
