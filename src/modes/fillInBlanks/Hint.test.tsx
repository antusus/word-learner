import { render, screen } from '@testing-library/react';
import { Hint } from './Hint';

describe('Hint', () => {
  it('renders the translation text', () => {
    render(<Hint translation="kot" />);
    expect(screen.getByText('kot')).toBeInTheDocument();
  });
});
