import type { Field } from "../form-builder.types";
import {
	isTextField,
	isNumberField,
	isGroupField,
} from "../form-builder.utils";
import { TextInput } from "./fields/text-input-preview";
import { NumberInput } from "./fields/number-input-preview";
import { GroupPreview } from "./fields/group-field-preview";

export interface FieldProps {
	field: Field;
	value: string | number;
	onChange: (id: string, value: string | number) => void;
	onBlur: (id: string) => void;
	error?: string;
	touched: boolean;
	depth?: number;
	getValue: (id: string) => string | number;
	getError: (id: string) => string | undefined;
	getTouched: (id: string) => boolean;
	parentRequired?: boolean;
}

interface PreviewFieldProps {
	field: Field;
	getValue: (id: string) => string | number;
	getError: (id: string) => string | undefined;
	getTouched: (id: string) => boolean;
	onChange: (id: string, value: string | number) => void;
	onBlur: (id: string) => void;
	depth?: number;
	parentRequired?: boolean;
}

export function PreviewField({
	field,
	getValue,
	getError,
	getTouched,
	onChange,
	onBlur,
	depth = 0,
	parentRequired = false,
}: PreviewFieldProps) {
	const value = getValue(field.id);
	const error = getError(field.id);
	const touched = getTouched(field.id);

	const commonProps: FieldProps = {
		field,
		value,
		onChange,
		onBlur,
		error,
		touched,
		depth,
		getValue,
		getError,
		getTouched,
		parentRequired,
	};

	if (isTextField(field)) {
		return <TextInput {...commonProps} field={field} />;
	}

	if (isNumberField(field)) {
		return <NumberInput {...commonProps} field={field} />;
	}

	if (isGroupField(field)) {
		return <GroupPreview {...commonProps} field={field} />;
	}

	return null;
}
