import type { Field } from "../form-builder.types";
import { isTextField, isNumberField, isGroupField } from "../form-builder.utils";
import { useFormBuilder } from "../form-builder.store";
import { actions } from "../form-builder.actions";
import { canMove } from "../form-builder.utils";
import { TextFieldEditor } from "./fields/text-field-editor";
import { NumberFieldEditor } from "./fields/number-field-editor";
import { GroupFieldEditor } from "./fields/group-field-editor";
import { Icons } from "../../ui/icons";
import { Button } from "../../ui/button";

interface FieldEditorProps {
	field: Field;
	depth: number;
	index: number;
	totalSiblings: number;
	parentRequired?: boolean;
}

export function FieldEditor({
	field,
	depth,
	parentRequired = false,
}: FieldEditorProps) {
	const { state, dispatch } = useFormBuilder();


	const canMoveUp = canMove(state.fields, field.id, "up");
	const canMoveDown = canMove(state.fields, field.id, "down");

	const handleMoveUp = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch(actions.moveField(field.id, "up"));
	};

	const handleMoveDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch(actions.moveField(field.id, "down"));
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch(actions.deleteField(field.id));
	};

	return (
		<div
			className="group border rounded-lg border-zinc-600 transition-all duration-150 focus-visible-ring bg-zinc-800"
		>
			<div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-600">
				<div className="flex gap-0.5">
					<MoveButton
						direction="up"
						label={field.label}
						onClick={handleMoveUp}
						disabled={!canMoveUp}
					/>
					<MoveButton
						direction="down"
						label={field.label}
						onClick={handleMoveDown}
						disabled={!canMoveDown}
					/>
				</div>
				<span aria-hidden="true">
					<FieldTypeIcon type={field.type} />
				</span>
				<span className="flex-1 font-medium text-sm text-zinc-50 truncate">
					{field.label}
				</span>
				{(field.required || parentRequired) && (
					<span
						className={`text-xs font-medium px-1.5 py-0.5 rounded ${
							parentRequired && !field.required
								? "text-zinc-500 bg-zinc-800"
								: "text-amber-400 bg-amber-900/30"
						}`}
						title={
							parentRequired && !field.required
								? "Inherited from parent group"
								: undefined
						}
					>
						{parentRequired && !field.required
							? "Required (inherited)"
							: "Required"}
					</span>
				)}
				<Button
					type="button"
					onClick={handleDelete}
					variant="ghost-destructive"
					className="p-2 h-auto rounded-lg transition-colors duration-100"
					title="Delete field"
					aria-label={`Delete ${field.label}`}
				>
					<Icons.Trash className="w-4 h-4" />
				</Button>
			</div>

			<div className="p-4">
				{isTextField(field) && (
					<TextFieldEditor field={field} parentRequired={parentRequired} />
				)}
				{isNumberField(field) && (
					<NumberFieldEditor field={field} parentRequired={parentRequired} />
				)}
				{isGroupField(field) && (
					<GroupFieldEditor
						field={field}
						depth={depth}
						parentRequired={parentRequired}
					/>
				)}
			</div>
		</div>
	);
}

interface FieldTypeIconProps {
	type: Field["type"];
}

function FieldTypeIcon({ type }: FieldTypeIconProps) {
	switch (type) {
		case "text":
			return <Icons.Text className="w-4 h-4 text-sky-400" />;
		case "number":
			return <Icons.Number className="w-4 h-4 text-violet-400" />;
		case "group":
			return <Icons.Group className="w-4 h-4 text-pink-400" />;
	}
}

interface MoveButtonProps {
	direction: "up" | "down";
	label: string;
	onClick: (e: React.MouseEvent) => void;
	disabled: boolean;
}

function MoveButton({ direction, label, onClick, disabled }: MoveButtonProps) {
	const isUp = direction === "up";

	return (
		<Button
			type="button"
			onClick={onClick}
			disabled={disabled}
			variant="ghost"
			className="cursor-pointer p-0.5 h-auto w-auto text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800"
			title={`Move ${direction}`}
			aria-label={`Move ${label} ${direction}`}
		>
			{isUp ? (
				<Icons.ChevronUp className="w-4 h-4" />
			) : (
				<Icons.ChevronDown className="w-4 h-4" />
			)}
		</Button>
	);
}
