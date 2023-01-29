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

/**
 * An expression should offer a TeX representation (i.e. a serialised
 * state), and an evaluation function.
 */
type Expression<T> = {
    kind: "Expression",
    value: string,
    eval: ((value: T) => T)
};

type Constant<T> = {
    kind: "Constant",
    value: T
};

/**
 * Provide a way to do interval comparisons with a given input
 * value, an infimum and supremum. hasMin and hasMax determine
 * whether the the min/max exists in the set, respectively.
 */
type Interval<T> = {
    kind: "Interval",
    value: PieceValue<T>,
    inf: PieceValue<T>,
    sup: PieceValue<T>,
    hasMin: boolean,
    hasMax: boolean,
};