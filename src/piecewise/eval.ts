import { PieceCondition, PieceValue, Piecewise } from "./piecewise";

function evalPieceCondition<T>(x: T, cond: PieceCondition<T>): boolean {
    switch (cond.kind) {
        case "Interval":
            const targetValues = evalPieceValue(x, cond.value);
            const leftValues = evalPieceValue(x, cond.left);
            const rightValues = evalPieceValue(x, cond.right);

            if (targetValues.length !== 1 || leftValues.length !== 1 || rightValues.length !== 1) {
                throw new Error("Could not reconcile multivalued piecewise object");
            }

            const target = targetValues[0];
            const left = leftValues[0];
            const right = rightValues[0];

            const matchLeft = cond.leftInclusive ? (target >= left) : (target > left);
            const matchRight = cond.rightInclusive ? (target <= right) : (target < right);

            return matchLeft && matchRight;
    }
}

function evalPieceValue<T>(x: T, value: PieceValue<T>): T[] {
    switch (value.kind) {
        case "Expression":
            return [value.eval(x)];
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
            values = values.concat(evalPieceValue(x, value));
        });
    });

    switch (piecewise.kind) {
        case "Piecewise":
            return [...new Set(values)];
        case "MultivaluedPiecewise":
            return values;
    }
}