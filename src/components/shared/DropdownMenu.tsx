import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface MenuOption {
  label?: string;
  labelKey?: string;
  icon?: string;
  className?: string;
  onClick: (data: any) => void;
}

interface DropdownMenuProps {
  menuId?: string;
  menuBtnClass?: string;
  menuBtnIcon?: string;
  menuItemsClass?: string;
  options: MenuOption[];
}

export function DropdownMenu({ menuId, menuBtnClass, menuBtnIcon, menuItemsClass, options }: DropdownMenuProps) {
  return (
    <Menu>
      {({ open }) => (
        <div key={menuId}>
          <MenuButton
            className={twMerge(
              'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-main data-[focus]:text-saffron data-[hover]:text-saffron data-[open]:text-saffron focus:outline-none',
              menuBtnClass
            )}
          >
            {menuBtnIcon && <i className={menuBtnIcon}></i>}
          </MenuButton>

          <AnimatePresence>
            {open && (
              <MenuItems
                static
                as={motion.div}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                anchor="bottom"
                className={twMerge(
                  'z-[51] w-max min-w-32 origin-top-right divide-y divide-dark-gray rounded-xl border border-gray-border bg-violet-950 px-5 py-2 text-sm/6 text-main transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none',
                  menuItemsClass
                )}
              >
                {options &&
                  options.map((option: MenuOption, id: number) => (
                    <MenuItem key={id}>
                      <button
                        onClick={() => option.onClick(menuId)}
                        className={twMerge(
                          'group flex w-full gap-2 py-2 text-base font-semibold data-[focus]:text-saffron data-[hover]:text-saffron',
                          option.className
                        )}
                      >
                        {option.icon && <i className={option.icon}></i>}
                        {option.label}
                      </button>
                    </MenuItem>
                  ))}
              </MenuItems>
            )}
          </AnimatePresence>
        </div>
      )}
    </Menu>
  );
}
