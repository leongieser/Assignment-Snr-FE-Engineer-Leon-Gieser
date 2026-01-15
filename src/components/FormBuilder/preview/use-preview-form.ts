import { useState, useCallback, useMemo } from "react";
import type { Field } from "../form-builder.types";
import { isGroupField } from "../form-builder.utils";
import { validateField } from "./preview.validators";

type FormValues = Record<string, string | number>;
type FormTouched = Record<string, boolean>;
type FormErrors = Record<string, string>;

export function usePreviewForm(fields: Field[]) {
	const [values, setValues] = useState<FormValues>({});
	const [touched, setTouched] = useState<FormTouched>({});
	const [errors, setErrors] = useState<FormErrors>({});

	const { fieldMap, effectiveRequiredMap } = useMemo(() => {
		const fieldMap = new Map<string, Field>();
		const effectiveRequiredMap = new Map<string, boolean>();

		function traverse(fields: Field[], parentRequired: boolean) {
			for (const field of fields) {
				fieldMap.set(field.id, field);
				const isEffectivelyRequired = field.required || parentRequired;
				effectiveRequiredMap.set(field.id, isEffectivelyRequired);

				if (isGroupField(field)) {
					traverse(field.children, isEffectivelyRequired);
				}
			}
		}

		traverse(fields, false);
		return { fieldMap, effectiveRequiredMap };
	}, [fields]);

	const handleChange = useCallback(
		(id: string, value: string | number) => {
			setValues((prev) => ({ ...prev, [id]: value }));

			setErrors((prev) => {
				const field = fieldMap.get(id);
				if (!field || !prev[id]) return prev;

				const effectiveRequired =
					effectiveRequiredMap.get(id) ?? field.required;
				const error = validateField(field, value, effectiveRequired);

				const next = { ...prev };
				if (error) {
					next[id] = error;
				} else {
					delete next[id];
				}
				return next;
			});
		},
		[fieldMap, effectiveRequiredMap],
	);

	const handleBlur = useCallback(
		(id: string) => {
			setTouched((prev) => ({ ...prev, [id]: true }));

			const field = fieldMap.get(id);
			if (field) {
				const value = values[id] ?? "";
				const effectiveRequired =
					effectiveRequiredMap.get(id) ?? field.required;
				const error = validateField(field, value, effectiveRequired);

				setErrors((prev) => {
					const next = { ...prev };
					if (error) {
						next[id] = error;
					} else {
						delete next[id];
					}
					return next;
				});
			}
		},
		[fieldMap, effectiveRequiredMap, values],
	);

	return {
		values,
		touched,
		errors,
		handleChange,
		handleBlur,
		getValue: useCallback((id: string) => values[id] ?? "", [values]),
		getTouched: useCallback((id: string) => touched[id] ?? false, [touched]),
		getError: useCallback((id: string) => errors[id], [errors]),
	};
}
