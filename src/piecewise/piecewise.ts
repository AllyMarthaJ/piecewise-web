export type Piecewise<T> = SingleValuedPiecewise<T> | MultivaluedPiecewise<T>;

/** Single-valued piecewise objects are just that: single-valued.
 * That means in their return, they *should* be guaranteed to
 * return a single value where specified (this should be the default).
 */
type SingleValuedPiecewise<T> = {
    kind: "Piecewise",
    value: Piece<T>[]
};

/**
 * Where possible denote all piecewise objects that are set/multi-valued
 * as multivalued piecewise objects.
 * This means that their output loses some guarantees which is unfortunate.
 */
type MultivaluedPiecewise<T> = {
    kind: "MultivaluedPiecewise",
    value: Piece<T>[]
};

/**
 * A piece should always contain two things: a value, and a condition.
 * If a function is multivalued, it may return several values.
 * Any piecewise object can have multiple conditions; they're interpreted
 * as intersections.
 */
export type Piece<T> = {
    kind: "Piece",
    value: PieceValue<T>[],
    condition: PieceCondition<T>[]
};

export type PieceValue<T> = Expression<T> | Constant<T> | Piecewise<T>;
export type PieceCondition<T> = Interval<T>;

type Expression<T> = {
    kind: "Expression",
    // provide the string representation of the executed expression
    value: string,
    eval: ((value: T) => T)
};

type Constant<T> = {
    kind: "Constant",
    value: T
};

type Interval<T> = {
    kind: "Interval",
    value: PieceValue<T>,
    left: PieceValue<T>,
    right: PieceValue<T>,
    leftInclusive: boolean,
    rightInclusive: boolean,
};