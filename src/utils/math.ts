export enum RoundingType {
	NONE = "NONE",
	DECIMALS = "DECIMALS",
	DOWN_NEAREST_INTEGER = "DOWN_NEAREST_INTEGER",
	UP_NEAREST_INTEGER = "UP_NEAREST_INTEGER"
}

export class RoundingBehavior {
	type: RoundingType;
	decimals?: number;
}

export function RoundingMethod(type: RoundingType, decimals?: number): (value: number) => number {
	switch (type) {
	case RoundingType.NONE: return (value: number): number => value;
	case RoundingType.DECIMALS: return (value: number): number => Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
	case RoundingType.DOWN_NEAREST_INTEGER: return (value: number): number => Math.floor(value);
	case RoundingType.UP_NEAREST_INTEGER: return (value: number): number => Math.ceil(value);
	default:
		throw new Error("Unsupported RoundingType!");
	}
}

/**
 * (numerator / denominator) * 100;
 */
export function Percent(numerator: number, denominator: number): number {
	return (numerator / denominator) * 100;
}