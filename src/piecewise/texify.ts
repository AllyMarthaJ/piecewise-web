import { Piece, PieceCondition, PieceValue, Piecewise } from "./piecewise";

// Why not write a basic AST for the stuff we need for piecewise objects?
// Because I'm lazy. That's why. To be fair, it *would* make testing much
// easier.

function texify(value: any) {
	return value.toString().replace("Infinity", "\\infty");
}

function texifyPieceValue<T>(value: PieceValue<T>): string {
	switch (value.kind) {
		case "Expression":
			return texify(value.value);
		case "Constant":
			return texify(value.value as string);
		case "Piecewise":
			return texifyPiecewise(value);
		case "MultivaluedPiecewise":
			return texifyPiecewise(value);
	}
}

function texifyPieceCondition<T>(cond: PieceCondition<T>) {
	let tex = "";

	switch (cond.kind) {
		case "Interval":
			// input expression
			tex += texifyPieceValue(cond.value);

			// bounds of interval
			tex += " \\in ";
			tex += cond.hasMin ? "\\left[" : "\\left(";
			tex += texifyPieceValue(cond.inf);
			tex += ", ";
			tex += texifyPieceValue(cond.sup);
			tex += cond.hasMax ? "\\right]" : "\\right)";
	}
	return tex;
}

function texifyPiece<T>(piece: Piece<T>) {
	let pieceTex = "";
	if (piece.value.length > 1) {
		const values = piece.value.map(texifyPieceValue);

		pieceTex = `\\left\\{${values.join(", ")}\\right\\}`;
	} else {
		pieceTex = texifyPieceValue(piece.value[0]);
	}

	pieceTex += " & ";
	pieceTex += piece.condition.map(texifyPieceCondition).join(" & ");

	return pieceTex;
}

export function texifyPiecewise<T>(piecewise: Piecewise<T>) {
	let tex = "\\left\\{\\begin{matrix}\n";

	tex += piecewise.value.map(texifyPiece).join(" \\\\\n");

	tex += "\n\\end{matrix}\\right.";

	return tex;
}
