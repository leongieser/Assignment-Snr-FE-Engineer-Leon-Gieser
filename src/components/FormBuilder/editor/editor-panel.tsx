import { useState } from 'react';
import { useFormBuilder } from '../form-builder.store';
import { actions } from '../form-builder.actions';
import { AddFieldButton } from './add-field-button';
import { FieldList } from './field-list';
import { hasUnchangedFields, hasIncompleteGroups, hasEmptyLabels, countAllFields } from '../form-builder.utils';
import { ExportPanel } from '../io/export-panel';
import { ImportModal } from '../io/import-modal';
import { Modal } from '../../ui/modal';
import { Icons } from '../../ui/icons';
import { Button } from '../../ui/button';

export function EditorPanel() {
  const { state, dispatch } = useFormBuilder();

  const fieldCount = countAllFields(state.fields);

  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const hasUnchanged = hasUnchangedFields(state.fields);
  const hasIncomplete = hasIncompleteGroups(state.fields);
  const hasEmptyLbls = hasEmptyLabels(state.fields);
  const isExportDisabled = state.fields.length === 0 || hasUnchanged || hasIncomplete || hasEmptyLbls;
  
  const handleClear = () => {
    if (state.fields.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    dispatch(actions.setConfig([]));
    setShowClearConfirm(false);
    setShowExport(false);
  };

  const exportTitle = state.fields.length === 0
    ? "Add fields to export"
    : hasUnchanged
      ? "Rename 'Untitled' fields to export"
      : hasIncomplete
        ? "Add at least 2 fields to groups to export"
        : hasEmptyLbls
          ? "Add labels to fields to export"
          : "Export configuration";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-600 bg-zinc-800">
        <div className="flex flex-wrap items-center gap-y-3 gap-x-2">
          <div className="mr-auto">
            <h2 className="text-sm font-semibold text-zinc-50 uppercase tracking-wide">
              Configuration
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {fieldCount} field{fieldCount !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleClear}
            disabled={state.fields.length === 0}
            variant="destructive-hover"
            className="order-2 min-[564px]:order-4 md:max-[1199px]:order-2 p-2 rounded-lg h-auto w-auto"
            title="Clear all fields"
            aria-label="Clear all fields"
          >
            <Icons.Trash className="w-4 h-4" />
          </Button>


          <div className="order-4 min-[564px]:order-2 md:max-[1199px]:order-4 w-full min-[564px]:w-auto md:max-[1199px]:w-full flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setShowImport(true)}
              variant="secondary-dark"
              className="flex-1 min-[564px]:flex-none md:max-[1199px]:flex-1 gap-2 text-xs font-medium rounded-lg h-auto py-2"
            >
              <Icons.Download className="w-4 h-4" />
              <span>Import</span>
            </Button>
            <Button
              type="button"
              disabled={isExportDisabled}
              onClick={() => setShowExport(true)}
              variant="secondary-accent"
              className="flex-1 min-[564px]:flex-none md:max-[1199px]:flex-1 gap-2 text-xs font-medium rounded-lg h-auto py-2"
              title={exportTitle}
            >
              <Icons.Upload className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
          <div className="order-3 min-[564px]:order-6 md:max-[1199px]:order-3">
             <AddFieldButton />
          </div>
        </div>
      </div>
      {showExport && (
        <div className="p-4 border-b border-zinc-800 animate-scaleIn">
          <ExportPanel onClose={() => setShowExport(false)} />
        </div>
      )}
      <div className="flex-1 overflow-auto p-4 scroll-smooth">
        <FieldList fields={state.fields} depth={0} />
      </div>
      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
      />
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear all fields"
        footer={
          <>
            <Button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              variant="secondary-dark"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmClear}
              variant="destructive-dark"
            >
              Clear
            </Button>
          </>
        }
      >
        <p className="text-zinc-400">
          Are you sure you want to clear the form? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
