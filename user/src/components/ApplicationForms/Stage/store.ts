import { atom } from 'jotai';

const isOpenAccordionMenuAtom = atom(false);

export const getIsOpenStageAccordionMenuAtom  = atom((get) =>
  get(isOpenAccordionMenuAtom)
);

export const setIsOpenStageAccordionMenuAtom  = atom(null, (get, set) => {
  const toggledIsOpen: boolean = !get(isOpenAccordionMenuAtom);
  set(isOpenAccordionMenuAtom, toggledIsOpen);
});