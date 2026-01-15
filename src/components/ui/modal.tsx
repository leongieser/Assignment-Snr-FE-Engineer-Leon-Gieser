import type { ReactNode, RefObject } from "react";
import { useEffect, useId, useRef } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
	maxWidth?: string;
	initialFocusRef?: RefObject<HTMLElement | null>;
}

function useFocusTrap(
	isActive: boolean,
	initialFocusRef?: RefObject<HTMLElement | null>,
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isActive) return;

		previousActiveElement.current = document.activeElement as HTMLElement;

		const getFocusableElements = () => {
			if (!containerRef.current) return [];
			return containerRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;

			const focusableElements = getFocusableElements();
			if (focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				}
			} else {
				if (document.activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		if (initialFocusRef?.current) {
			setTimeout(() => initialFocusRef.current?.focus(), 50);
		} else {
			const focusableElements = getFocusableElements();
			if (focusableElements.length > 0) {
				setTimeout(() => focusableElements[0]?.focus(), 50);
			}
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			if (previousActiveElement.current) {
				previousActiveElement.current.focus();
			}
		};
	}, [isActive, initialFocusRef]);

	return containerRef;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	maxWidth = "max-w-lg",
	initialFocusRef,
}: ModalProps) {
	const modalRef = useFocusTrap(isOpen, initialFocusRef);
	const titleId = useId();

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="presentation"
		>
			<button
				type="button"
				className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-sm animate-fadeIn cursor-default"
				onClick={onClose}
				aria-hidden="true"
				tabIndex={-1}
			/>
			<div
				ref={modalRef}
				className={`relative z-10 w-full ${maxWidth} bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl animate-scaleIn`}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
			>
				<div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
					<h2 id={titleId} className="text-lg font-semibold text-zinc-50">
						{title}
					</h2>
				</div>
				<div className="p-4">{children}</div>
				{footer && (
					<div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-zinc-700 bg-zinc-800/50 rounded-b-lg">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
