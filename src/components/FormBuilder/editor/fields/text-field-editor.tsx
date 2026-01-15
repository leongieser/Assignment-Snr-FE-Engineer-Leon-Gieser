import { useEffect, useRef } from "react";
import type { TextField } from "../../form-builder.types";
import { useFormBuilder } from "../../form-builder.store";
import { actions } from "../../form-builder.actions";
import { MAX_LABEL_LENGTH } from "../../form-builder.constants";

interface TextFieldEditorProps {
	field: TextField;
	parentRequired?: boolean;
}

export function TextFieldEditor({
	field,
	parentRequired = false,
}: TextFieldEditorProps) {
	const { dispatch } = useFormBuilder();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (field.isPlaceholder && inputRef.current) {
			inputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [field.isPlaceholder]);

	const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(
			actions.updateField(field.id, {
				label: e.target.value.slice(0, MAX_LABEL_LENGTH),
				isPlaceholder: false,
			}),
		);
	};

	const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(actions.updateField(field.id, { required: e.target.checked }));
	};

	return (
		<div className="space-y-3">
			<div>
				<label
					htmlFor={`${field.id}-label`}
					className="block text-xs font-medium text-zinc-400 mb-1"
				>
					Label
				</label>
				<input
					ref={inputRef}
					id={`${field.id}-label`}
					type="text"
					value={field.label}
					onChange={handleLabelChange}
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					maxLength={MAX_LABEL_LENGTH}
					className={`w-full px-3 py-2 text-sm bg-zinc-950/50 border border-zinc-700 rounded-md ${field.isPlaceholder ? "text-amber-500" : "text-zinc-50"} placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-colors`}
					placeholder="Enter field label"
				/>
			</div>

			<div>
				<label
					htmlFor={`${field.id}-placeholder`}
					className="block text-xs font-medium text-zinc-400 mb-1"
				>
					Placeholder
				</label>
				<input
					id={`${field.id}-placeholder`}
					type="text"
					value={field.placeholder ?? ""}
					onChange={(e) =>
						dispatch(
							actions.updateField(field.id, { placeholder: e.target.value }),
						)
					}
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					className="w-full px-3 py-2 text-sm bg-zinc-950/50 border border-zinc-700 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-colors"
					placeholder="No placeholder"
				/>
			</div>

			{!parentRequired && (
				<label
					className="flex items-center gap-2 cursor-pointer"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<input
						type="checkbox"
						checked={field.required}
						onChange={handleRequiredChange}
						className="w-4 h-4 text-zinc-400 bg-zinc-900 border-zinc-700 rounded focus:ring-zinc-500 focus:ring-offset-zinc-900"
					/>
					<span className="text-sm text-zinc-50">Required field</span>
				</label>
			)}
		</div>
	);
}
