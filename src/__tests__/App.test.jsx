import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders Home page at root route', () => {
  window.location.hash = '#/'
  render(<App />)
  // Home page renders HeroBanner with 'Sourasso' brand text
  expect(screen.getByText('Sourasso')).toBeInTheDocument()
})
