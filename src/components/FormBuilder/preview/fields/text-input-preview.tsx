import type { FieldProps } from "../preview-field";
import type { TextField } from "../../form-builder.types";
import { isUnchangedLabel } from "../../form-builder.utils";
import { Icons } from "../../../ui/icons";

interface TextInputProps extends Omit<FieldProps, "field"> {
	field: TextField;
}

export function TextInput({
	field,
	value,
	onChange,
	onBlur,
	error,
	touched,
	parentRequired = false,
}: TextInputProps) {
	const showError = touched && error;
	const inputId = `preview-${field.id}`;
	const isRequired = field.required || parentRequired;

	const isEmpty = !field.label || field.label.trim().length === 0;
	const showPlaceholder = isEmpty || isUnchangedLabel(field);
	const displayLabel = isEmpty ? "Label placeholder" : field.label;

	return (
		<div className="space-y-1.5">
			<label
				htmlFor={inputId}
				className={`block text-sm font-medium break-words ${
					showPlaceholder ? "text-amber-500" : "text-zinc-50"
				}`}
			>
				{displayLabel}
				{field.required && (
					<span className="text-red-500 ml-0.5" aria-hidden="true">
						*
					</span>
				)}
			</label>
			<input
				id={inputId}
				type="text"
				value={value as string}
				onChange={(e) => onChange(field.id, e.target.value)}
				onBlur={() => onBlur(field.id)}
				className={`w-full px-3 py-2 text-sm text-zinc-50 bg-zinc-800 border rounded-md transition-colors duration-150 placeholder:text-zinc-500
          ${
						showError
							? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
							: "border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/20"
					}
          focus:outline-none focus:ring-2
        `}
				placeholder={field.placeholder || ""}
				aria-required={isRequired}
				aria-invalid={showError ? "true" : undefined}
				aria-describedby={showError ? `${inputId}-error` : undefined}
			/>
			{showError && (
				<p
					id={`${inputId}-error`}
					className="flex items-center gap-1 text-xs text-red-500"
					role="alert"
				>
					<Icons.Error className="w-3.5 h-3.5" />
					{error}
				</p>
			)}
		</div>
	);
}
