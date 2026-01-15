import { useState, useRef, useEffect } from 'react';
import { useFormBuilder } from '../form-builder.store';
import { actions } from '../form-builder.actions';
import { Icons } from '../../ui/icons';
import { Button } from '../../ui/button';
import type { FieldType } from '../form-builder.types';

interface AddFieldButtonProps {
  parentId?: string;
  label?: string;
}

interface FieldOption {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const FIELD_OPTIONS: FieldOption[] = [
  {
    type: 'text',
    label: 'Text Field',
    icon: <Icons.Text className="w-4 h-4 text-sky-400" />,
  },
  {
    type: 'number',
    label: 'Number Field',
    icon: <Icons.Number className="w-4 h-4 text-violet-400" />,
  },
  {
    type: 'group',
    label: 'Group',
    icon: <Icons.Group className="w-4 h-4 text-pink-400" />,
  },
];


export function AddFieldButton({ parentId, label = 'Add Field' }: AddFieldButtonProps) {
  const { dispatch } = useFormBuilder();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleAddField = (fieldType: FieldType) => {
    dispatch(actions.addField(fieldType, parentId));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icons.Plus className="w-4 h-4" />
        {label}
        <Icons.ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 min-w-42 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50"
          role="menu"
        >
          {FIELD_OPTIONS.map((option) => (
            <Button
              key={option.type}
              type="button"
              variant="ghost"
              onClick={() => handleAddField(option.type)}
              className="w-full justify-start h-auto gap-3 px-4 py-2.5 text-zinc-50 hover:bg-zinc-800/50 hover:text-zinc-50"
              role="menuitem"
            >
              <span>{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

