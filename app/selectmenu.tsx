import { Fragment } from "react";
import { classNames } from "@/utils";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type SelectMenuProps = {
  label: string;
  options: string[];
  selected: string;
  onChange(value: string): void;
};

export function SelectMenu({
  label,
  options,
  selected,
  onChange,
}: SelectMenuProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="w-80">
          <ListboxLabel className="block text-sm leading-6 font-medium text-gray-300">
            {label}
          </ListboxLabel>
          <div className="relative mt-2">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-slate-800 py-1.5 pr-10 pl-3 text-left text-gray-300 shadow-sm ring-1 ring-gray-500 ring-inset focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6">
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-gray-300 shadow-lg ring-1 ring-gray-700 sm:text-sm">
                {options.map((option, index) => (
                  <ListboxOption
                    key={`${option}_${index}`}
                    value={option}
                    className={({ focus }) =>
                      classNames(
                        focus ? "bg-indigo-600 text-white" : "text-gray-300",
                        "relative cursor-default py-2 pr-4 pl-8 select-none"
                      )
                    }
                  >
                    {({ selected, focus }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              focus ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}
