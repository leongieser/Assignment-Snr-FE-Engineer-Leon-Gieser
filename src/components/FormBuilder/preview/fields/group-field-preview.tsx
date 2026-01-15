import type { FieldProps } from "../preview-field";
import type { GroupField } from "../../form-builder.types";
import { PreviewField } from "../preview-field";
import { isUnchangedLabel } from "../../form-builder.utils";

interface GroupPreviewProps extends Omit<FieldProps, "field"> {
	field: GroupField;
}

export function GroupPreview({
	field,
	getValue,
	getError,
	getTouched,
	onChange,
	onBlur,
	depth = 0,
	parentRequired = false,
}: GroupPreviewProps) {
	const hasChildren = field.children.length > 0;
	const isRequired = field.required || parentRequired;

	const isEmpty = !field.label || field.label.trim().length === 0;
	const showPlaceholder = isEmpty || isUnchangedLabel(field);
	const displayLabel = isEmpty ? "Label placeholder" : field.label;

	return (
		<fieldset
			className={`
        border border-zinc-700 rounded-lg
        ${depth === 0 ? "p-4" : "p-3"}
      `}
		>
			<legend
				className={`
          px-2 text-sm font-medium
          -ml-1 break-words
          ${showPlaceholder ? "text-amber-500" : "text-zinc-50"}
        `}
			>
				{displayLabel}
				{field.required && (
					<span className="text-red-500 ml-0.5" aria-hidden="true">
						*
					</span>
				)}
			</legend>

			{hasChildren ? (
				<div className="space-y-4 mt-2">
					{field.children.map((child, index) => (
						<div
							key={child.id}
							className="animate-slideDown"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<PreviewField
								field={child}
								getValue={getValue}
								getError={getError}
								getTouched={getTouched}
								onChange={onChange}
								onBlur={onBlur}
								depth={depth + 1}
								parentRequired={isRequired}
							/>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-zinc-400 italic mt-2">
					This group has no fields.
				</p>
			)}
		</fieldset>
	);
}
