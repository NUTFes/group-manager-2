import { atom } from 'jotai';

const isOpenAccordionMenuAtom = atom(false);

export const getIsOpenAccordionMenuAtom = atom((get) =>
  get(isOpenAccordionMenuAtom)
);

export const setIsOpenAccordionMenuAtom = atom(null, (get, set) => {
  const toggledIsOpen: boolean = !get(isOpenAccordionMenuAtom);
  set(isOpenAccordionMenuAtom, toggledIsOpen);
});