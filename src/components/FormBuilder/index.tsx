import { FormBuilderLayout } from './form-builder-layout';
import { FormPreview } from './preview/form-preview';
import { EditorPanel } from './editor/editor-panel';
import { FormBuilderProvider } from './form-builder.context';

export function FormBuilder() {
  return (
    <FormBuilderProvider>
      <FormBuilderLayout
        builderPanel={<EditorPanel />}
        previewPanel={<FormPreview />}
      />
    </FormBuilderProvider>
  );
}
