import type { Field, FieldType, NumberField } from "../form-builder.types";

type FormValue = string | number | undefined | null;
type ValidatorFn = (
	field: Field,
	value: FormValue,
	required: boolean,
) => string | null;

const VALIDATORS: Record<FieldType, ValidatorFn> = {
	text: (_field, value, required) => {
		if (required && (!value || value.toString().trim() === "")) {
			return "This field is required";
		}
		return null;
	},
	number: (field, value, required) => {
		if (required && (value === "" || value === undefined || value === null)) {
			return "This field is required";
		}

		if (value !== "" && value !== undefined && value !== null) {
			const numValue = Number(value);

			if (Number.isNaN(numValue)) {
				return "Please enter a valid number";
			}

			const numField = field as NumberField;
			if (numField.min !== undefined && numValue < numField.min) {
				if (numField.max !== undefined) {
					return `Value must be between ${numField.min} and ${numField.max}`;
				}
				return `Value must be at least ${numField.min}`;
			}

			if (numField.max !== undefined && numValue > numField.max) {
				if (numField.min !== undefined) {
					return `Value must be between ${numField.min} and ${numField.max}`;
				}
				return `Value must be at most ${numField.max}`;
			}
		}

		return null;
	},
	group: () => null,
};

export function validateField(
	field: Field,
	value: FormValue,
	effectiveRequired: boolean,
): string | null {
	const validator = VALIDATORS[field.type];
	return validator ? validator(field, value, effectiveRequired) : null;
}
