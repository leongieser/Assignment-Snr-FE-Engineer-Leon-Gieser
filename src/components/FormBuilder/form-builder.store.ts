import { createContext, useContext, type Dispatch } from "react";
import type { FormBuilderAction, FormBuilderState } from "./form-builder.types";
import {
	addFieldToParent,
	updateFieldById,
	deleteFieldById,
	moveField,
} from "./form-builder.utils";

export const initialState: FormBuilderState = {
	fields: [],
	selectedFieldId: null,
};

export function formBuilderReducer(
	state: FormBuilderState,
	action: FormBuilderAction,
): FormBuilderState {
	switch (action.type) {
		case "ADD_FIELD": {
			const { field, parentId } = action.payload;
			return {
				...state,
				fields: addFieldToParent(state.fields, field, parentId),
				selectedFieldId: field.id,
			};
		}

		case "UPDATE_FIELD": {
			const { id, updates } = action.payload;
			return {
				...state,
				fields: updateFieldById(state.fields, id, updates),
			};
		}

		case "DELETE_FIELD": {
			const { id } = action.payload;
			return {
				...state,
				fields: deleteFieldById(state.fields, id),
				selectedFieldId:
					state.selectedFieldId === id ? null : state.selectedFieldId,
			};
		}

		case "MOVE_FIELD": {
			const { id, direction } = action.payload;
			return {
				...state,
				fields: moveField(state.fields, id, direction),
			};
		}

		case "SET_CONFIG": {
			const { fields } = action.payload;
			return {
				...state,
				fields,
				selectedFieldId: null,
			};
		}

		case "SELECT_FIELD": {
			const { id } = action.payload;
			return {
				...state,
				selectedFieldId: id,
			};
		}

		default:
			return state;
	}
}

export interface FormBuilderContextValue {
	state: FormBuilderState;
	dispatch: Dispatch<FormBuilderAction>;
}

export const FormBuilderContext = createContext<
	FormBuilderContextValue | undefined
>(undefined);

export function useFormBuilder(): FormBuilderContextValue {
	const context = useContext(FormBuilderContext);

	if (context === undefined) {
		throw new Error(
			"useFormBuilder must be used within a FormBuilderProvider. " +
				"Wrap your component tree with <FormBuilderProvider>.",
		);
	}

	return context;
}
