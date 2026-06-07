import React from 'react';
import type { PendingPermissionRequest } from '../../types/types';
import { buildClaudeToolPermissionEntry, formatToolInputForDisplay } from '../../utils/chatPermissions';
import { getClaudeSettings } from '../../utils/chatStorage';
import { getPermissionPanel, registerPermissionPanel } from '../../tools/configs/permissionPanelRegistry';
import { AskUserQuestionPanel } from '../../tools/components/InteractiveRenderers';

registerPermissionPanel('AskUserQuestion', AskUserQuestionPanel);

interface PermissionRequestsBannerProps {
  pendingPermissionRequests: PendingPermissionRequest[];
  handlePermissionDecision: (
    requestIds: string | string[],
    decision: { allow?: boolean; message?: string; rememberEntry?: string | null; updatedInput?: unknown },
  ) => void;
  handleGrantToolPermission: (suggestion: { entry: string; toolName: string }) => { success: boolean };
}

export default function PermissionRequestsBanner({
  pendingPermissionRequests,
  handlePermissionDecision,
  handleGrantToolPermission,
}: PermissionRequestsBannerProps) {
  if (!pendingPermissionRequests.length) {
    return null;
  }

  return (
    <div className="mb-3 space-y-2">
      {pendingPermissionRequests.map((request) => {
        const CustomPanel = getPermissionPanel(request.toolName);
        if (CustomPanel) {
          return (
            <CustomPanel
              key={request.requestId}
              request={request}
              onDecision={handlePermissionDecision}
            />
          );
        }

        const rawInput = formatToolInputForDisplay(request.input);
        const permissionEntry = buildClaudeToolPermissionEntry(request.toolName, rawInput);
        const settings = getClaudeSettings();
        const alreadyAllowed = permissionEntry ? settings.allowedTools.includes(permissionEntry) : false;
        const rememberLabel = alreadyAllowed ? 'Allow (saved)' : 'Allow & remember';
        const matchingRequestIds = permissionEntry
          ? pendingPermissionRequests
              .filter(
                (item) =>
                  buildClaudeToolPermissionEntry(item.toolName, formatToolInputForDisplay(item.input)) === permissionEntry,
              )
              .map((item) => item.requestId)
          : [request.requestId];

        return (
          <div
            key={request.requestId}
            className="rounded-lg border border-warm/30 dark:border-warm/30 bg-warm/10 dark:bg-warm/10 p-3 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-warm dark:text-warm">Permission required</div>
                <div className="text-xs text-warm dark:text-warm">
                  Tool: <span className="font-mono">{request.toolName}</span>
                </div>
              </div>
              {permissionEntry && (
                <div className="text-xs text-warm dark:text-warm">
                  Allow rule: <span className="font-mono">{permissionEntry}</span>
                </div>
              )}
            </div>

            {rawInput && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-warm dark:text-warm hover:text-warm dark:hover:text-warm">
                  View tool input
                </summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-white/80 dark:bg-gray-900/60 border border-warm/30 dark:border-warm/30 p-2 text-xs text-warm dark:text-warm whitespace-pre-wrap">
                  {rawInput}
                </pre>
              </details>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePermissionDecision(request.requestId, { allow: true })}
                className="inline-flex items-center gap-2 rounded-md bg-warm text-warm-foreground text-xs font-medium px-3 py-1.5 hover:bg-warm/90 transition-colors"
              >
                Allow once
              </button>
              <button
                type="button"
                onClick={() => {
                  if (permissionEntry && !alreadyAllowed) {
                    handleGrantToolPermission({ entry: permissionEntry, toolName: request.toolName });
                  }
                  handlePermissionDecision(matchingRequestIds, { allow: true, rememberEntry: permissionEntry });
                }}
                className={`inline-flex items-center gap-2 rounded-md text-xs font-medium px-3 py-1.5 border transition-colors ${
                  permissionEntry
                    ? 'border-warm/30 text-warm hover:bg-warm/10 dark:border-warm/30 dark:text-warm dark:hover:bg-warm/10'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!permissionEntry}
              >
                {rememberLabel}
              </button>
              <button
                type="button"
                onClick={() => handlePermissionDecision(request.requestId, { allow: false, message: 'User denied tool use' })}
                className="inline-flex items-center gap-2 rounded-md text-xs font-medium px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                Deny
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
