'use client';

import { useAtom } from 'jotai';
import { Button, Group, useMantineColorScheme } from '@mantine/core';
import { colorSchemeAtom } from '@/src/store/atoms';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  const [, setColorSchemeAtom] = useAtom(colorSchemeAtom);

  const handleColorScheme = (scheme: 'light' | 'dark' | 'auto') => {
    setColorSchemeAtom(scheme);
    setColorScheme(scheme);
  };
  return (
    <Group justify="center" mt="xl">
      <Button onClick={() => handleColorScheme('light')}>Light</Button>
      <Button onClick={() => handleColorScheme('dark')}>Dark</Button>
      <Button onClick={() => handleColorScheme('auto')}>Auto</Button>
    </Group>
  );
}
