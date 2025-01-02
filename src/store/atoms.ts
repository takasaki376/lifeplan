import { atom } from 'jotai';
import { colorScheme } from '../types';

export const colorSchemeAtom = atom<colorScheme>('light');
