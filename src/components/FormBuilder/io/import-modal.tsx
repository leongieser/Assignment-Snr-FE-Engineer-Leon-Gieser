import { useState, useCallback, useRef, useId } from "react";
import { useFormBuilder } from "../form-builder.store";
import { actions } from "../form-builder.actions";
import { validateConfig } from "../form-builder.validators";
import { Modal } from "../../ui/modal";
import { Icons } from "../../ui/icons";
import { Button } from "../../ui/button";
import { DEFAULT_IMPORT } from "../form-builder.constants";

interface ImportModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
	const { dispatch } = useFormBuilder();
	const [jsonInput, setJsonInput] = useState("");
	const [errors, setErrors] = useState<string[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const textareaId = useId();
	const errorId = useId();

	const handleClose = useCallback(() => {
		setJsonInput("");
		setErrors([]);
		onClose();
	}, [onClose]);

	const handleImport = useCallback(() => {
		const result = validateConfig(jsonInput);

		if (!result.valid) {
			setErrors(result.errors);
			return;
		}

		if (result.config) {
			dispatch(actions.setConfig(result.config));
			handleClose();
		}
	}, [jsonInput, dispatch, handleClose]);

	const footer = (
		<>
			<Button
				variant="secondary-dark"
				type="button"
				onClick={handleClose}
				className="text-zinc-300 hover:text-zinc-50 border-zinc-600"
			>
				Cancel
			</Button>
			<Button
				variant="outline"
				type="button"
				onClick={handleImport}
				disabled={!jsonInput.trim()}
			>
				Import
			</Button>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Import Configuration"
			footer={footer}
			initialFocusRef={textareaRef}
		>
			<label
				htmlFor={textareaId}
				className="block text-sm font-medium text-zinc-300 mb-2"
			>
				Paste your JSON configuration below:
			</label>
			<textarea
				ref={textareaRef}
				id={textareaId}
				value={jsonInput}
				onChange={(e) => {
					setJsonInput(e.target.value);
					setErrors([]);
				}}
				placeholder={DEFAULT_IMPORT}
				className={`w-full h-48 p-3 font-mono text-xs bg-zinc-900 border rounded-md text-zinc-50 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 
          ${errors.length > 0 ? "border-red-500" : "border-zinc-700"}
          `}
				aria-invalid={errors.length > 0}
				aria-describedby={errors.length > 0 ? errorId : undefined}
			/>
			{errors.length > 0 && (
				<div
					id={errorId}
					className="mt-3 p-3 bg-red-950/30 border border-red-800 rounded-md animate-slideDown"
					role="alert"
					aria-live="polite"
				>
					<div className="flex items-start gap-2">
						<Icons.Error
							aria-hidden="true"
							className="w-5 h-5 text-red-400 flex-shrink-0"
						/>
						<div>
							<p className="text-sm font-medium text-red-200">
								Validation Error{errors.length > 1 ? "s" : ""}
							</p>
							<ul className="mt-1 text-xs text-red-300 list-disc list-inside space-y-1">
								{errors.slice(0, 5).map((error, idx) => (
									<li key={`${idx}-${error.substring(0, 10)}`}>{error}</li>
								))}
								{errors.length > 5 && (
									<li>
										...and {errors.length - 5} more error
										{errors.length - 5 > 1 ? "s" : ""}
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}
