import type { ReactNode } from "react";

import { useReducer, useEffect, useState } from "react";

import type {
	Field,
} from "./form-builder.types";

import { actions } from "./form-builder.actions";
import { FormBuilderContext, formBuilderReducer, initialState } from "./form-builder.store";

interface FormBuilderProviderProps {
	children: ReactNode;
	initialFields?: Field[];
}

const STORAGE_KEY = 'form-builder-config';

export function FormBuilderProvider({
	children,
	initialFields,
}: FormBuilderProviderProps) {
	const [state, dispatch] = useReducer(formBuilderReducer, {
		...initialState,
		fields: initialFields ?? [],
	});
	
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const fields = JSON.parse(stored);
				if (Array.isArray(fields)) {
					dispatch(actions.setConfig(fields));
				}
			}
		} catch (error) {
			console.error('Failed to load form config from local storage:', error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (!isLoaded) return;
		
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state.fields));
		} catch (error) {
			console.error('Failed to save form config to local storage:', error);
		}
	}, [state.fields, isLoaded]);

	return (
		<FormBuilderContext.Provider value={{ state, dispatch }}>
			{children}
		</FormBuilderContext.Provider>
	);
}


