import { useEffect, useRef } from "react";
import type { GroupField } from "../../form-builder.types";
import { useFormBuilder } from "../../form-builder.store";
import { actions } from "../../form-builder.actions";
import { FieldList } from "../field-list";
import { AddFieldButton } from "../add-field-button";
import { setRequiredRecursively } from "../../form-builder.utils";
import { MAX_LABEL_LENGTH } from "../../form-builder.constants";

interface GroupFieldEditorProps {
	field: GroupField;
	depth: number;
	parentRequired?: boolean;
}

export function GroupFieldEditor({
	field,
	depth,
	parentRequired = false,
}: GroupFieldEditorProps) {
	const childrenRequired = field.required || parentRequired;
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
		const isRequired = e.target.checked;

		if (isRequired && field.children.length > 0) {
			const updatedChildren = setRequiredRecursively(field.children, false);

			dispatch(
				actions.updateField(field.id, {
					required: true,
					children: updatedChildren,
				}),
			);
		} else {
			dispatch(actions.updateField(field.id, { required: isRequired }));
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<label
					htmlFor={`${field.id}-label`}
					className="block text-xs font-medium text-zinc-400 mb-1"
				>
					Group Label
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
					placeholder="Enter group label"
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
						className="w-4 h-4 text-zinc-400  border-zinc-700 rounded focus:ring-zinc-500 focus:ring-offset-zinc-900"
					/>
					<span className="text-sm text-zinc-50">Required group</span>
				</label>
			)}
			<fieldset
				aria-labelledby={`${field.id}-group-label`}
				className={`pt-3 mt-3 border-t border-zinc-700 min-w-0`}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<h4
							id={`${field.id}-group-label`}
							className={`text-xs font-medium uppercase tracking-wide ${
								field.children.length < 2 ? "text-amber-500" : "text-zinc-400"
							}`}
						>
							Group Fields ({field.children.length})
						</h4>
						{field.children.length < 2 && (
							<span className="text-[10px] text-amber-400 bg-amber-900/20 px-1.5 py-0.5 rounded">
								Minimum 2 fields required
							</span>
						)}
					</div>
					<AddFieldButton parentId={field.id} label="Add to Group" />
				</div>
				<div className="pl-4 border-l-2 border-zinc-600">
					<FieldList
						fields={field.children}
						depth={depth + 1}
						parentRequired={childrenRequired}
					/>
				</div>
			</fieldset>
		</div>
	);
}
