import { useEffect, useRef } from "react";
import type { NumberField } from "../../form-builder.types";
import { useFormBuilder } from "../../form-builder.store";
import { actions } from "../../form-builder.actions";
import { MAX_LABEL_LENGTH } from "../../form-builder.constants";

interface NumberFieldEditorProps {
	field: NumberField;
	parentRequired?: boolean;
}

export function NumberFieldEditor({
	field,
	parentRequired = false,
}: NumberFieldEditorProps) {
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

	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === "" ? undefined : Number(e.target.value);
		dispatch(actions.updateField(field.id, { min: value }));
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === "" ? undefined : Number(e.target.value);
		dispatch(actions.updateField(field.id, { max: value }));
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
					className={`w-full px-3 py-2 text-sm  bg-zinc-950/50 border border-zinc-700 rounded-md ${field.isPlaceholder ? "text-amber-500" : "text-zinc-50"} placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-colors`}
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
					className="w-full px-3 py-2 text-sm bg-zinc-950/50   border border-zinc-700 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-colors"
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
						className="w-4 h-4 text-zinc-400 border-zinc-700 rounded focus:ring-zinc-500 focus:ring-offset-zinc-900"
					/>
					<span className="text-sm text-zinc-50">Required field</span>
				</label>
			)}

			<div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor={`${field.id}-min`}
							className="block text-xs font-medium text-zinc-400 mb-1"
						>
							Min Value
						</label>
						<input
							id={`${field.id}-min`}
							type="number"
							value={field.min ?? ""}
							onChange={handleMinChange}
							max={field.max} // Lock browser spinner to max
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
							className={`
                w-full px-3 py-2 text-sm  rounded-md bg-zinc-950/50 
                placeholder-zinc-500 transition-colors
                focus:outline-none focus:ring-2 focus:ring-zinc-500
                ${
									field.min !== undefined &&
									field.max !== undefined &&
									field.min > field.max
										? "border border-red-500 text-red-500 focus:border-red-500"
										: "border border-zinc-700 text-zinc-50 focus:border-zinc-500"
								}
              `}
							placeholder="No min"
						/>
					</div>
					<div>
						<label
							htmlFor={`${field.id}-max`}
							className="block text-xs font-medium text-zinc-400 mb-1"
						>
							Max Value
						</label>
						<input
							id={`${field.id}-max`}
							type="number"
							value={field.max ?? ""}
							onChange={handleMaxChange}
							min={field.min}
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
							className={`
                w-full px-3 py-2 text-sm  rounded-md bg-zinc-950/50 
                placeholder-zinc-500 transition-colors
                focus:outline-none focus:ring-2 focus:ring-zinc-500
                ${
									field.min !== undefined &&
									field.max !== undefined &&
									field.min > field.max
										? "border border-red-500 text-red-500 focus:border-red-500"
										: "border border-zinc-700 text-zinc-50 focus:border-zinc-500"
								}
              `}
							placeholder="No max"
						/>
					</div>
				</div>

				{/* Validation Error Message */}
				{field.min !== undefined &&
					field.max !== undefined &&
					field.min > field.max && (
						<p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
							<svg
								aria-hidden="true"
								className="w-3 h-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							Min value cannot be greater than Max value
						</p>
					)}
			</div>
		</div>
	);
}
