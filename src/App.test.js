import { render, screen } from '@testing-library/react';
import App from './v2/App';

jest.mock('lenis', () => jest.fn());
jest.mock('./v2/particles/motor', () => ({ motorKur: () => null }));

test('yeni tasarımın ana bölümleri görünür', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Melih Başdemir' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Neler yapıyorum' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Soru Bankası/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /basdemirmelih58@gmail.com/ })).toBeInTheDocument();
});
