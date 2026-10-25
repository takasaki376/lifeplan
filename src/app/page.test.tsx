import { fireEvent, render, screen, within } from '@testing-library/react';
import LifePlanApp from './page';

test('renders the life plan form and calculates the default household projection', () => {
  render(<LifePlanApp />);

  expect(screen.getByText('ライフプラン検討アプリ')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'ライフプランを計算' }));

  const results = screen.getByRole('tabpanel', { name: /表/ });
  expect(within(results).getByText('年齢別のライフプラン推移（単位：万円）')).toBeInTheDocument();
  expect(within(results).getAllByRole('row').length).toBeGreaterThan(1);
  expect(within(results).getAllByText('504').length).toBeGreaterThan(0);
});
