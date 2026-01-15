import { useRef } from "react";
import type { Field } from "../form-builder.types";
import { FieldEditor } from "./field-editor";

import { AddFieldButton } from "./add-field-button";
import { Icons } from "../../ui/icons";

interface FieldListProps {
	fields: Field[];
	depth?: number;
	parentRequired?: boolean;
}

export function FieldList({
	fields,
	depth = 0,
	parentRequired = false,
}: FieldListProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const isRootList = depth === 0;

	if (fields.length === 0) {
		return <EmptyState depth={depth} />;
	}

	return (
		<ul
			ref={listRef}
			aria-label={isRootList ? "Form fields" : "Nested fields"}
			className="space-y-4"
		>
			{fields.map((field, index) => (
				<li
					key={field.id}
					className="relative animate-slideDown max-w-2xl mx-auto"
					style={{
						animationDelay: `${index * 50}ms`,
						zIndex: fields.length - index,
					}}
				>
					<FieldEditor
						field={field}
						depth={depth}
						index={index}
						totalSiblings={fields.length}
						parentRequired={parentRequired}
					/>
				</li>
			))}
		</ul>
	);
}

interface EmptyStateProps {
	depth: number;
}

function EmptyState({ depth }: EmptyStateProps) {
	const isNested = depth > 0;

	if (isNested) {
		return (
			<output className="flex flex-col items-center justify-center p-4 text-center border border-dashed border-zinc-700 gap-2 rounded-lg bg-zinc-900/50">
				<p className="text-sm font-medium text-zinc-300">No fields in group</p>
				<p className="text-xs text-zinc-500">
					Use "Add Field" above to add fields
				</p>
			</output>
		);
	}

	return (
		<output className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
			<div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
				<Icons.Empty className="w-8 h-8 text-zinc-600" />
			</div>
			<h3 className="text-lg font-medium text-zinc-50 mb-2">No fields yet</h3>
			<p className="text-sm text-zinc-400 max-w-xs mb-6">
				Click "Add Field" to get started
			</p>
			<AddFieldButton />
		</output>
	);
}
