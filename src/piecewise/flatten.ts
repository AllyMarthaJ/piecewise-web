import { Piece, PieceCondition, PieceValue, Piecewise } from "./piecewise";

function flattenSinglePieceValue<T>(piece: Piece<T>, index: number): Piece<T>[] {
    const value = piece.value[index];

    switch (value.kind) {
        case "Constant":
        case "Expression":
            return [piece];
        case "Piecewise":
        case "MultivaluedPiecewise":
            const subPiecewise = flattenPiecewise(value);
            return subPiecewise.value.map((subPiece) => {
                const left = piece.value.slice(0, index);
                const right = piece.value.slice(index + 1);

                return {
                    ...subPiece,
                    value: [...left, ...subPiece.value, ...right],
                    condition: subPiece.condition.concat(piece.condition)
                };
            });
    }
}

function flattenPieceValue<T>(piece: Piece<T>, index: number = 0): Piece<T>[] {
    let pieces: Piece<T>[] = [];

    // Start from the beginning.
    // We're working over **one** piece.
    // Check the first item.
    // Is it piecewise?
    // If so, split this out into however many pieces,
    // appending the parent condition to each piece's condition.
    // Do not use the existing piecewise object.
    // Otherwise, return the *existing* item.
    // Now repeat this process for all pieces, excluding the first item.
    const value = piece.value[index];

    pieces.push(...flattenSinglePieceValue(piece, index));

    if (index == piece.value.length - 1) {
        return pieces;
    } else {
        return pieces.flatMap(newPiece => flattenPieceValue(newPiece, index + 1));
    }
}

export function flattenPiecewise<T>(piecewise: Piecewise<T>): Piecewise<T> {
    let pieces: Piece<T>[] = [];
    piecewise.value.forEach((piece) => {
        pieces.push(...flattenPieceValue(piece));
    });

    return {
        ...piecewise,
        value: pieces
    };
}