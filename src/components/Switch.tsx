"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
      >
        <span
          className={`${
            checked ? "translate-x-6" : "translate-x-0"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </HeadlessSwitch>
      {label && (
        <label className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  );
}
