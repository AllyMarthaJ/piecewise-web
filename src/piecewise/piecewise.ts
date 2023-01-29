// to consider; split out piecewise into multi and single, to handle eval return
export type Piecewise<T> = SingleValuedPiecewise<T> | MultivaluedPiecewise<T>;

type SingleValuedPiecewise<T> = {
    kind: "Piecewise",
    value: Piece<T>[]
};

type MultivaluedPiecewise<T> = {
    kind: "MultivaluedPiecewise",
    value: Piece<T>[]
};

export type Piece<T> = {
    kind: "Piece",
    value: PieceValue<T>,
    condition: PieceCondition<T>[]
};

type PieceValue<T> = Expression<T> | Piecewise<T>;
type PieceCondition<T> = Interval<T>; // TOOD: support piecewise conditions

type Expression<T> = {
    kind: "Expression",
    // provide the string representation of the executed expression
    value: string,
    eval: (value: T) => T
};

type Interval<T> = {
    kind: "Interval",
    value: PieceValue<T>,
    left: PieceValue<T>,
    right: PieceValue<T>,
    leftInclusive: boolean,
    rightInclusive: boolean,
};

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
            return [value.eval(x)]
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
        values = values.concat(evalPieceValue(x, piece.value));
    });

    switch (piecewise.kind) {
        case "Piecewise":
            return [...new Set(values)];
        case "MultivaluedPiecewise":
            return values;
    }
}

function texifyPieceValue<T>(value: PieceValue<T>): string {
    switch (value.kind) {
        case "Expression":
            return value.value;
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
            tex += cond.leftInclusive ? "\\left[" : "\\left(";
            tex += texifyPieceValue(cond.left);
            tex += ", ";
            tex += texifyPieceValue(cond.right);
            tex += cond.rightInclusive ? "\\right]" : "\\right)";
    }
    return tex;
}

export function texifyPiecewise<T>(piecewise: Piecewise<T>) {
    let tex = "\\left\\{\\begin{matrix}\n";

    piecewise.value.forEach((piece, i) => {
        tex += "\t" + texifyPieceValue(piece.value);
        tex += " & ";
        tex += piece.condition.map((cond, j) => {
            let texCond = texifyPieceCondition(cond);
            if (j !== piece.condition.length - 1) {
                texCond += " & ";
            }
            return texCond;
        }).join("");

        if (i !== piecewise.value.length - 1) {
            tex += " \\\\\n";
        }
    });

    tex += "\n\\end{matrix}\\right.";

    return tex;
}