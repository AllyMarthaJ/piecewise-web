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
                const pieces = [...piece.value];
                pieces.splice(index, 1, ...subPiece.value);

                return {
                    ...subPiece,
                    value: pieces,
                    condition: subPiece.condition.concat(piece.condition)
                };
            });
    }
}

function flattenPieceValue<T>(piece: Piece<T>, index: number = 0): Piece<T>[] {
    let pieces: Piece<T>[] = flattenSinglePieceValue(piece, index);

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