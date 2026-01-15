import type { FormConfig } from "./form-builder.types";

export interface ValidationResult {
	valid: boolean;
	errors: string[];
	config?: FormConfig;
}

const VALID_FIELD_TYPES = ["text", "number", "group"] as const;

export function validateConfig(jsonString: string): ValidationResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(jsonString);
	} catch (e) {
		const error = e instanceof Error ? e.message : "Unknown parse error";
		return {
			valid: false,
			errors: [`Invalid JSON: ${error}`],
		};
	}

	if (!Array.isArray(parsed)) {
		return {
			valid: false,
			errors: ["Configuration must be an array of fields"],
		};
	}

	const errors: string[] = [];
	const seenIds = new Set<string>();

	validateFieldArray(parsed, errors, seenIds, "");

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	return {
		valid: true,
		errors: [],
		config: sanitizeConfig(parsed as FormConfig),
	};
}

function validateFieldArray(
	fields: unknown[],
	errors: string[],
	seenIds: Set<string>,
	path: string,
): void {
	fields.forEach((field, index) => {
		const fieldPath = path ? `${path}[${index}]` : `Field at index ${index}`;
		validateField(field, errors, seenIds, fieldPath);
	});
}

function validateField(
	field: unknown,
	errors: string[],
	seenIds: Set<string>,
	path: string,
): void {
	if (!field || typeof field !== "object" || Array.isArray(field)) {
		errors.push(`${path} must be an object`);
		return;
	}

	const obj = field as Record<string, unknown>;

	if (!("id" in obj) || typeof obj.id !== "string") {
		errors.push(`${path} is missing 'id' (must be a string)`);
	} else {
		if (seenIds.has(obj.id)) {
			errors.push(`Duplicate field id: '${obj.id}'`);
		} else {
			seenIds.add(obj.id);
		}
	}

	if (!("type" in obj) || typeof obj.type !== "string") {
		errors.push(`${path} is missing 'type' (must be a string)`);
	} else if (
		!VALID_FIELD_TYPES.includes(obj.type as (typeof VALID_FIELD_TYPES)[number])
	) {
		errors.push(
			`${path} has invalid type '${obj.type}'. Must be one of: ${VALID_FIELD_TYPES.join(", ")}`,
		);
	}

	if (!("label" in obj) || typeof obj.label !== "string") {
		errors.push(`${path} is missing 'label' (must be a string)`);
	}

	if (!("required" in obj) || typeof obj.required !== "boolean") {
		errors.push(`${path} is missing 'required' (must be a boolean)`);
	}

	if (obj.type === "number") {
		validateNumberField(obj, errors, path);
	}

	if (obj.type === "group") {
		validateGroupField(obj, errors, seenIds, path);
	}
}

function validateNumberField(
	obj: Record<string, unknown>,
	errors: string[],
	path: string,
): void {
	if ("min" in obj && obj.min !== undefined && typeof obj.min !== "number") {
		errors.push(`${path} has invalid 'min' (must be a number or undefined)`);
	}

	if ("max" in obj && obj.max !== undefined && typeof obj.max !== "number") {
		errors.push(`${path} has invalid 'max' (must be a number or undefined)`);
	}
}

function validateGroupField(
	obj: Record<string, unknown>,
	errors: string[],
	seenIds: Set<string>,
	path: string,
): void {
	if (!("children" in obj) || !Array.isArray(obj.children)) {
		errors.push(`${path} (group) is missing 'children' array`);
		return;
	}

	const label = typeof obj.label === "string" ? obj.label : "unnamed group";
	validateFieldArray(obj.children, errors, seenIds, `${path} > '${label}'`);
}

function sanitizeConfig(config: FormConfig): FormConfig {
	return config.map((field) => {
		const updated = { ...field };
		if (updated.type === "group") {
			updated.children = sanitizeConfig(updated.children);
		}

		return updated;
	});
}

