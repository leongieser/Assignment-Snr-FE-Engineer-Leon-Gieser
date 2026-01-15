export interface FormBuilderState {
	fields: Field[];
	selectedFieldId: string | null;
}

export type FormBuilderAction =
	| {
			type: "ADD_FIELD";
			payload: {
				field: Field;
				parentId?: string;
			};
	  }
	| {
			type: "UPDATE_FIELD";
			payload: {
				id: string;
				updates: Partial<Field>;
			};
	  }
	| {
			type: "DELETE_FIELD";
			payload: {
				id: string;
			};
	  }
	| {
			type: "MOVE_FIELD";
			payload: {
				id: string;
				direction: "up" | "down";
			};
	  }
	| {
			type: "SET_CONFIG";
			payload: {
				fields: Field[];
			};
	  }
	| {
			type: "SELECT_FIELD";
			payload: {
				id: string | null;
			};
	  };

export type FieldType = "text" | "number" | "group";

export interface BaseField {
	id: string;
	type: FieldType;
	label: string;
	required: boolean;
	isPlaceholder?: boolean;
}

export interface TextField extends BaseField {
	type: "text";
	placeholder?: string;
}

export interface NumberField extends BaseField {
	type: "number";
	min?: number;
	max?: number;
	placeholder?: string;
}

export interface GroupField extends BaseField {
	type: "group";
	children: Field[];
}

export type Field = TextField | NumberField | GroupField;

export type FormConfig = Field[];
