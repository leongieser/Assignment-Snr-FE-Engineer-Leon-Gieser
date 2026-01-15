import { useState, useCallback } from "react";
import { Button } from "../../ui/button";
import { useFormBuilder } from "../form-builder.store";

import { Icons } from "../../ui/icons";
import { copyToClipboard, formatConfigAsJson } from "../form-builder.utils";

interface ExportPanelProps {
	onClose: () => void;
}

export function ExportPanel({ onClose }: ExportPanelProps) {
	const { state } = useFormBuilder();
	const [copied, setCopied] = useState(false);

	const jsonOutput = formatConfigAsJson(state.fields);

	const handleCopy = useCallback(async () => {
		const success = await copyToClipboard(jsonOutput);
		if (success) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}, [jsonOutput]);

	return (
		<div className="border border-zinc-700 rounded-lg bg-zinc-800 overflow-hidden shadow-sm">
			<div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 bg-zinc-800/50">
				<h3 className="text-sm font-semibold text-zinc-50">
					Export Configuration
				</h3>
				<Button
					variant="ghost"
					type="button"
					onClick={onClose}
					className="h-auto w-auto p-1 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-50"
					aria-label="Close export panel"
				>
					<Icons.Close className="w-5 h-5" />
				</Button>
			</div>

			<div className="p-4">
				<div className="relative">
					<textarea
						readOnly
						value={jsonOutput}
						className="w-full h-64 p-3 font-mono text-xs bg-zinc-900 border border-zinc-700 rounded-md text-zinc-300 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500"
						aria-label="JSON configuration output"
					/>
				</div>
				<div className="mt-4 flex items-center justify-end">
					<Button
						type="button"
						onClick={handleCopy}
						variant="secondary"
						className={`transition-all duration-200 ${copied ? "bg-green-600 text-white hover:bg-green-700" : ""}`}
					>
						{copied ? (
							<>
								<Icons.Check className="w-4 h-4 mr-2" />
								Copied!
							</>
						) : (
							<>
								<Icons.Copy className="w-4 h-4 mr-2" />
								Copy to Clipboard
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
