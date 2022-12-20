import { Switch } from '@headlessui/react';
import { useState } from 'react';

export type InputSwitchData = {
  label: string;
  onChange: any;
};

const InputSwitch = ({ label, onChange }: InputSwitchData) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Switch
        checked={enabled}
        onChange={() => {
          setEnabled(!enabled);
          onChange(!enabled);
        }}
        className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
            relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
      <span>{label}</span>
    </div>
  );
};

export default InputSwitch;
