import { useRef, useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Route } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function LocationAutocomplete({
  id,
  label,
  placeholder = 'Search a location…',
  value = '',
  onChange,
  onSelect,
  suggestions = [],
  onInputFocus,
  icon: Icon = MapPin,
  excludeId,
  error,
  required,
  autoFocus,
  name,
}) {
  const genId = useId();
  const inputId = id || `${genId}-input`;
  const listboxId = `${inputId}-listbox`;
  const comboboxId = `${inputId}-combobox`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  const handleSelect = (item) => {
    setOpen(false);
    onSelect?.(item);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (suggestions.length ? (i + 1) % suggestions.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (suggestions.length ? (i <= 0 ? suggestions.length - 1 : i - 1) : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && suggestions.length > 0;

  return (
    <div ref={boxRef} className="relative">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon size={18} />
        </div>
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-item-${activeIndex}` : undefined}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => {
            setOpen(true);
            onInputFocus?.();
          }}
          onChange={(e) => {
            onChange?.(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={twMerge(
            clsx(
              'w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2',
              'disabled:opacity-50',
              error
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-neutral-300 focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-600',
              'dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:ring-green-500/20'
            )
          )}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              onChange?.('');
              onSelect?.(null);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label="Suggestions"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 mt-1.5 max-h-72 w-full overflow-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
          >
            {suggestions.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={item.id}
                  id={`${listboxId}-item-${index}`}
                  role="option"
                  aria-selected={isActive}
                  onPointerDown={(e) => e.preventDefault()}
                  onMouseDown={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={clsx(
                    'flex cursor-pointer items-start gap-3 px-3 py-2.5 text-left',
                    isActive ? 'bg-green-50 dark:bg-green-900/20' : ''
                  )}
                >
                  <span className={clsx('mt-0.5 shrink-0', item.kind === 'route' ? 'text-blue-500' : 'text-neutral-400')}>
                    {item.kind === 'route' ? <Route size={16} /> : <Icon size={16} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="block truncate text-xs text-neutral-400 dark:text-neutral-500">
                        {item.sublabel}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}