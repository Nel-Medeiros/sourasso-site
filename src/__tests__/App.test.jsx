import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders Home page at root route', () => {
  window.location.hash = '#/'
  render(<App />)
  expect(screen.getByTestId('page-home')).toBeInTheDocument()
})
