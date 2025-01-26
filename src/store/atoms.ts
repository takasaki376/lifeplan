import { atom } from 'jotai';
import { colorScheme, Family } from '../types';

export const colorSchemeAtom = atom<colorScheme>('light');
export const familyAtom = atom<Family[]>([]);
