import type {
	Field,
	FormConfig,
	GroupField,
	NumberField,
	TextField,
} from "./form-builder.types";

export function isGroupField(field: Field): field is GroupField {
	return field.type === "group";
}

export function isNumberField(field: Field): field is NumberField {
	return field.type === "number";
}

export function isTextField(field: Field): field is TextField {
	return field.type === "text";
}

export function findFieldById(fields: Field[], id: string): Field | null {
	for (const field of fields) {
		if (field.id === id) {
			return field;
		}
		if (isGroupField(field)) {
			const found = findFieldById(field.children, id);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

export function findFieldPath(fields: Field[], id: string): number[] | null {
	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		if (field.id === id) {
			return [i];
		}
		if (isGroupField(field)) {
			const childPath = findFieldPath(field.children, id);
			if (childPath) {
				return [i, ...childPath];
			}
		}
	}
	return null;
}

export function findParentGroup(
	fields: Field[],
	id: string,
): GroupField | null {
	for (const field of fields) {
		if (isGroupField(field)) {
			if (field.children.some((child) => child.id === id)) {
				return field;
			}
			const found = findParentGroup(field.children, id);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

export function updateFieldById(
	fields: Field[],
	id: string,
	updates: Partial<Field>,
): Field[] {
	return fields.map((field) => {
		if (field.id === id) {
			return { ...field, ...updates } as Field;
		}
		if (isGroupField(field)) {
			const updatedChildren = updateFieldById(field.children, id, updates);
			if (updatedChildren !== field.children) {
				return { ...field, children: updatedChildren };
			}
		}
		return field;
	});
}

export function deleteFieldById(fields: Field[], id: string): Field[] {
	return fields
		.filter((field) => field.id !== id)
		.map((field) => {
			if (isGroupField(field)) {
				const updatedChildren = deleteFieldById(field.children, id);
				if (updatedChildren !== field.children) {
					return { ...field, children: updatedChildren };
				}
			}
			return field;
		});
}

export function moveField(
	fields: Field[],
	id: string,
	direction: "up" | "down",
): Field[] {
	const index = fields.findIndex((f) => f.id === id);

	if (index !== -1) {
		const newIndex = direction === "up" ? index - 1 : index + 1;

		if (newIndex < 0 || newIndex >= fields.length) {
			return fields;
		}

		const newFields = [...fields];
		[newFields[index], newFields[newIndex]] = [
			newFields[newIndex],
			newFields[index],
		];
		return newFields;
	}

	return fields.map((field) => {
		if (isGroupField(field)) {
			const movedChildren = moveField(field.children, id, direction);
			if (movedChildren !== field.children) {
				return { ...field, children: movedChildren };
			}
		}
		return field;
	});
}

export function addFieldToParent(
	fields: Field[],
	field: Field,
	parentId?: string,
): Field[] {
	if (!parentId) {
		return [...fields, field];
	}

	return fields.map((f) => {
		if (f.id === parentId && isGroupField(f)) {
			return {
				...f,
				children: [...f.children, field],
			};
		}
		if (isGroupField(f)) {
			const updatedChildren = addFieldToParent(f.children, field, parentId);
			if (updatedChildren !== f.children) {
				return { ...f, children: updatedChildren };
			}
		}
		return f;
	});
}

export function getSiblings(fields: Field[], id: string): Field[] {
	if (fields.some((f) => f.id === id)) {
		return fields.filter((f) => f.id !== id);
	}

	for (const field of fields) {
		if (isGroupField(field)) {
			if (field.children.some((child) => child.id === id)) {
				return field.children.filter((child) => child.id !== id);
			}
			const found = getSiblings(field.children, id);
			if (found.length > 0 || field.children.some((c) => c.id === id)) {
				return found;
			}
		}
	}

	return [];
}

export function countAllFields(fields: Field[]): number {
	return fields.reduce((count, field) => {
		if (isGroupField(field)) {
			return count + countAllFields(field.children);
		}
		return count + 1;
	}, 0);
}

export function canMove(
	fields: Field[],
	id: string,
	direction: "up" | "down",
): boolean {
	const path = findFieldPath(fields, id);
	if (!path) return false;

	const index = path[path.length - 1];

	let currentFields = fields;

	if (path.length > 1) {
		let current = fields;
		for (let i = 0; i < path.length - 1; i++) {
			const field = current[path[i]];
			if (isGroupField(field)) {
				current = field.children;
			} else {
				return false;
			}
		}
		currentFields = current;
	}

	if (direction === "up") {
		return index > 0;
	}

	return index < currentFields.length - 1;
}

export function isUnchangedLabel(field: Field): boolean {
	return field.isPlaceholder === true;
}

export function hasUnchangedFields(fields: Field[]): boolean {
	return fields.some((field) => {
		if (field.isPlaceholder) {
			return true;
		}

		if (isGroupField(field)) {
			return hasUnchangedFields(field.children);
		}
		return false;
	});
}

export function setRequiredRecursively(
	fields: Field[],
	required: boolean,
): Field[] {
	return fields.map((field) => {
		const updatedField = { ...field, required };
		if (isGroupField(updatedField)) {
			updatedField.children = setRequiredRecursively(
				updatedField.children,
				required,
			);
		}
		return updatedField as Field;
	});
}

export function hasEmptyGroups(fields: Field[]): boolean {
	return fields.some((field) => {
		if (isGroupField(field)) {
			if (field.children.length === 0) {
				return true;
			}
			return hasEmptyGroups(field.children);
		}
		return false;
	});
}

export function hasEmptyLabels(fields: Field[]): boolean {
	return fields.some((field) => {
		if (!field.label || field.label.trim().length === 0) {
			return true;
		}

		if (isGroupField(field)) {
			return hasEmptyLabels(field.children);
		}
		return false;
	});
}

export function hasIncompleteGroups(fields: Field[]): boolean {
	return fields.some((field) => {
		if (isGroupField(field)) {
			if (field.children.length < 2) {
				return true;
			}
			return hasIncompleteGroups(field.children);
		}
		return false;
	});
}

export function formatConfigAsJson(config: FormConfig): string {
	return JSON.stringify(config, null, 2);
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
			return true;
		} catch {
			return false;
		}
	}
}
