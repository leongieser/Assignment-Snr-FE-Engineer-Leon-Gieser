import { useState, useEffect, useId, type ReactNode } from "react";
import { PanelTabs } from "./form-builder-tabs";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";

type ActivePanel = "builder" | "preview";

interface FormBuilderLayoutProps {
	builderPanel: ReactNode;
	previewPanel: ReactNode;
}

export function FormBuilderLayout({
	builderPanel,
	previewPanel,
}: FormBuilderLayoutProps) {
	const [activePanel, setActivePanel] = useState<ActivePanel>("builder");
	const layoutId = useId();
	const mainContentId = `${layoutId}-main`;
	const builderPanelId = `${layoutId}-builder`;
	const previewPanelId = `${layoutId}-preview`;

	return (
		<div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
			<header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-zinc-800 bg-zinc-900">
				<div className="flex items-center gap-3 relative">
					<Icons.Logo className="w-8 h-8" />
					<h1 className="text-xl md:text-2xl font-bold text-zinc-50">
						Form Builder
					</h1>
					<LegendPopover />
				</div>
			</header>
			<nav className="md:hidden" aria-label="Panel navigation">
				<PanelTabs activePanel={activePanel} onPanelChange={setActivePanel} />
			</nav>
			<main
				id={mainContentId}
				className="flex-1 flex flex-col md:flex-row overflow-hidden"
			>
				<section
					id={builderPanelId}
					className={`flex-1 md:flex-none md:w-1/2 bg-zinc-950 relative z-10 ${activePanel === "builder" ? "block" : "hidden md:block"}`}
					aria-label="Form Builder"
					tabIndex={-1}
				>
					<div className="h-full">{builderPanel}</div>
				</section>
				<section
					id={previewPanelId}
					className={`flex-1 md:flex-none md:w-1/2 overflow-hidden bg-zinc-900 ${activePanel === "preview" ? "block" : "hidden md:block"}`}
					aria-label="Form Preview"
					tabIndex={-1}
				>
					<div className="h-full">{previewPanel}</div>
				</section>
			</main>
		</div>
	);
}

function LegendPopover() {
	const [showLegend, setShowLegend] = useState(false);
	const legendId = useId();
	const btnId = `${legendId}-btn`;
	const popoverId = `${legendId}-popover`;

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (
				!target.closest(`[id="${popoverId}"]`) &&
				!target.closest(`[id="${btnId}"]`)
			) {
				setShowLegend(false);
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setShowLegend(false);
			}
		}

		if (showLegend) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleKeyDown);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
				document.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [showLegend, btnId, popoverId]);

	return (
		<>
			<Button
				id={btnId}
				type="button"
				variant="ghost"
				onClick={() => setShowLegend(!showLegend)}
				className={`
          h-auto w-auto p-1 rounded-full transition-colors mt-1
          ${showLegend ? "text-zinc-50 bg-zinc-700 hover:bg-zinc-700" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}
        `}
				title="Show info"
				aria-label="Show info"
				aria-expanded={showLegend}
				aria-controls={popoverId}
			>
				<Icons.Info className="w-4 h-4" />
			</Button>
			{showLegend && (
				<div
					id={popoverId}
					className="absolute top-full left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 p-3"
					role="tooltip"
				>
					<h3 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
						Info
					</h3>
					<ul className="space-y-2 text-xs">
						<li className="flex items-start gap-2">
							<span className="w-2 h-2 mt-1 rounded-full bg-amber-500 shrink-0" />
							<span className="text-zinc-300">
								Orange indicates changes that need to be made before the
								configuration can be exported
							</span>
						</li>
					</ul>
					<div className="mt-4 pt-4 border-t border-zinc-700/50">
						<p className="text-xs text-center text-zinc-400">
							Your draft is saved locally
						</p>
					</div>
				</div>
			)}
		</>
	);
}
