import { PieceCondition, PieceValue, Piecewise } from "./piecewise";

// Why not write a basic AST for the stuff we need for piecewise objects?
// Because I'm lazy. That's why. To be fair, it *would* make testing much
// easier.

function texify(value: any) {
    return value
        .toString()
        .replace("Infinity", "\\infty");
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
        let texValue = "";
        if (piece.value.length > 1) {
            const values = piece.value.map((value) => texifyPieceValue);

            texValue = `\\[${values.join(", ")}\\]`;
        } else {
            texValue = texifyPieceValue(piece.value[0]);
        }
        tex += "\t" + texValue;
        tex += " & ";
        tex += piece.condition.map((cond) => texifyPieceCondition(cond)).join(" & ");

        if (i !== piecewise.value.length - 1) {
            tex += " \\\\\n";
        }
    });

    tex += "\n\\end{matrix}\\right.";

    return tex;
}