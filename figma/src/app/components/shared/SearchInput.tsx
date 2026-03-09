import { Search } from 'lucide-react';
import type { ChangeEventHandler, ReactNode } from 'react';

interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  trailing?: ReactNode;
}

export function SearchInput({ placeholder, value, onChange, trailing }: SearchInputProps) {
  return (
    <div className="px-5 mb-4">
      <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
        <Search size={16} className="text-[#8A8478]" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent text-sm placeholder:text-[#8A8478]/60 outline-none"
        />
        {trailing ?? null}
      </div>
    </div>
  );
}
