/**
 * Role Switcher Component
 * 
 * Dropdown to switch between roles in DEMO_MODE.
 * Demonstrates how different authority levels affect action availability.
 * 
 * RULES:
 * - Only visible in DEMO_MODE
 * - Role switch re-maps authorities from ROLE_PRESETS
 * - Emits ROLE_SWITCHED event for audit trail
 * - No advice or recommendations
 */

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Shield, Eye, FileCheck } from 'lucide-react';
import { Role, ROLE_PRESETS } from '@/api/execution-context';
import { isDemoMode } from '@/api';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  CLIENT: <Users className="w-4 h-4" />,
  OPERATOR: <Shield className="w-4 h-4" />,
  SUPERVISOR: <Eye className="w-4 h-4" />,
  COMPLIANCE: <FileCheck className="w-4 h-4" />,
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  CLIENT: 'View portfolio and reports. Limited control actions.',
  OPERATOR: 'Execute trades and manage goal accounts.',
  SUPERVISOR: 'Approve dual-control actions. Full portfolio control.',
  COMPLIANCE: 'Full read access. Audit and proof export.',
};

const ROLE_AUTHORITY_COUNTS: Record<Role, number> = {
  CLIENT: ROLE_PRESETS.CLIENT.length,
  OPERATOR: ROLE_PRESETS.OPERATOR.length,
  SUPERVISOR: ROLE_PRESETS.SUPERVISOR.length,
  COMPLIANCE: ROLE_PRESETS.COMPLIANCE.length,
};

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in DEMO_MODE
  if (!isDemoMode()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50 text-xs">
        DEMO
      </Badge>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select
              value={currentRole}
              onValueChange={(value) => onRoleChange(value as Role)}
              onOpenChange={setIsOpen}
            >
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <div className="flex items-center gap-2">
                  {ROLE_ICONS[currentRole]}
                  <SelectValue placeholder="Select role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_PRESETS) as Role[]).map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      {ROLE_ICONS[role]}
                      <span>{role}</span>
                      <span className="text-xs text-slate-400">
                        ({ROLE_AUTHORITY_COUNTS[role]} authorities)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-medium">{currentRole}</div>
            <div className="text-xs text-slate-400">
              {ROLE_DESCRIPTIONS[currentRole]}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Switch roles to see how authorities affect available actions.
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default RoleSwitcher;
