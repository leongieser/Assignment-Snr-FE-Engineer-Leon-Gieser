import { PreviewField } from "./preview-field";
import { Icons } from "../../ui/icons";
import { useFormBuilder } from "../form-builder.store";
import { usePreviewForm } from "./use-preview-form";

export function FormPreview() {
	const { state } = useFormBuilder();
	const form = usePreviewForm(state.fields);
	const hasFields = state.fields.length > 0;

	return (
		<div className="h-full flex flex-col">
			<div className="px-4 py-3 border-b border-zinc-600 bg-zinc-800 ">
				<div className="flex flex-col justify-center min-h-10">
					<h2 className="text-sm font-semibold text-zinc-50 uppercase tracking-wide">
						Preview
					</h2>
					<p className="text-xs text-zinc-400 mt-0.5">Live form preview</p>
				</div>
			</div>
			<div className="flex-1 overflow-auto p-4 border-l-zinc-600 border-l-1 border-l-0 md:border-l-1">
				{hasFields ? (
					<div className="max-w-2xl mx-auto">
						<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 shadow-sm">
							<form
								onSubmit={(e) => e.preventDefault()}
								className="space-y-5"
								noValidate
							>
								{state.fields.map((field, index) => (
									<div
										key={field.id}
										className="animate-slideDown"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										<PreviewField
											field={field}
											getValue={form.getValue}
											getError={form.getError}
											getTouched={form.getTouched}
											onChange={form.handleChange}
											onBlur={form.handleBlur}
											depth={0}
										/>
									</div>
								))}
							</form>
						</div>
					</div>
				) : (
					<EmptyState />
				)}
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="h-full flex flex-col items-center justify-center text-center px-4">
			<div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
				<Icons.Form className="w-8 h-8 text-zinc-500" />
			</div>
			<h3 className="text-lg font-medium text-zinc-50 mb-2">Form preview</h3>
			<p className="text-sm text-zinc-400 max-w-xs">
				Your form preview will appear here as you add fields.
			</p>
			<p className="text-xs text-zinc-500 mt-4">
				Add fields in the Builder panel to see them rendered
			</p>
		</div>
	);
}
