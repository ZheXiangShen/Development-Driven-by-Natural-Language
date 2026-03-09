import { motion } from 'motion/react';

interface TabSwitchProps<T extends string> {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
  labelMap?: Partial<Record<T, string>>;
  layoutId: string;
}

export function TabSwitch<T extends string>({ options, active, onChange, labelMap, layoutId }: TabSwitchProps<T>) {
  return (
    <div className="flex gap-4 border-b border-[#E8E4DD]/60">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`pb-2.5 text-sm relative ${active === option ? 'text-[#2C2C2C]' : 'text-[#8A8478]'}`}
        >
          {labelMap?.[option] ?? option}
          {active === option ? (
            <motion.div layoutId={layoutId} className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A6741] rounded-full" />
          ) : null}
        </button>
      ))}
    </div>
  );
}
