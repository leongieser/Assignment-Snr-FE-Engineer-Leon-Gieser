import { cn } from '../../lib/utils';
import { Icons } from '../ui/icons';
import { Button } from '../ui/button';

type ActivePanel = 'builder' | 'preview';

interface PanelTabsProps {
  activePanel: ActivePanel;
  onPanelChange: (panel: ActivePanel) => void;
}

export function PanelTabs({ activePanel, onPanelChange }: PanelTabsProps) {
  return (
    <div
      className="flex border-b border-zinc-700 bg-zinc-800"
      role="tablist"
      aria-label="Panel navigation"
    >
      <Tab
        label="Builder"
        icon={Icons.Builder}
        isActive={activePanel === 'builder'}
        panelId="builder-panel"
        onClick={() => onPanelChange('builder')}
      />
      <Tab
        label="Preview"
        icon={Icons.Preview}
        isActive={activePanel === 'preview'}
        panelId="preview-panel"
        onClick={() => onPanelChange('preview')}
      />
    </div>
  );
}

interface TabProps {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  panelId: string;
  onClick: () => void;
}

function Tab({ label, icon: Icon, isActive, panelId, onClick }: TabProps) {
  return (
    <Button
      variant="ghost"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      onClick={onClick}
      className={cn(
        "flex-1 py-3 px-4 h-auto rounded-none",
        "text-sm font-medium",
        "border-b-2 hover:bg-zinc-700",
        isActive
          ? "border-zinc-50 text-zinc-50 bg-zinc-700 hover:text-zinc-50"
          : "border-transparent text-zinc-400 hover:text-zinc-50"
      )}
    >
      <span className="flex items-center justify-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </span>
    </Button>
  );
}
