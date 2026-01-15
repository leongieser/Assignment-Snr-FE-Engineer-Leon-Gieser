import type { FormBuilderAction } from "./form-builder.types";
import type {
	Field,
	FieldType,
	GroupField,
	TextField,
	NumberField,
} from "./form-builder.types";
import { generateId } from "../../lib/utils";

function createField(type: FieldType): Field {
	const id = generateId();
	const base = { id, required: false, isPlaceholder: true };

	switch (type) {
		case "text": {
			const field = {
				...base,
				type: "text",
				label: "Untitled Text",
			} satisfies TextField;

			return field;
		}

		case "number": {
			const field = {
				...base,
				type: "number",
				label: "Untitled Number",
			} satisfies NumberField;

			return field;
		}

		case "group": {
			const field = {
				...base,
				type: "group",
				label: "Untitled Group",
				children: [],
			} satisfies GroupField;

			return field;
		}
	}
}

export const actions = {
	addField: (fieldType: FieldType, parentId?: string): FormBuilderAction => ({
		type: "ADD_FIELD",
		payload: { field: createField(fieldType), parentId },
	}),

	addFieldDirect: (field: Field, parentId?: string): FormBuilderAction => ({
		type: "ADD_FIELD",
		payload: { field, parentId },
	}),

	updateField: (id: string, updates: Partial<Field>): FormBuilderAction => ({
		type: "UPDATE_FIELD",
		payload: { id, updates },
	}),

	deleteField: (id: string): FormBuilderAction => ({
		type: "DELETE_FIELD",
		payload: { id },
	}),

	moveField: (id: string, direction: "up" | "down"): FormBuilderAction => ({
		type: "MOVE_FIELD",
		payload: { id, direction },
	}),

	setConfig: (fields: Field[]): FormBuilderAction => ({
		type: "SET_CONFIG",
		payload: { fields },
	}),

	selectField: (id: string | null): FormBuilderAction => ({
		type: "SELECT_FIELD",
		payload: { id },
	}),
};
