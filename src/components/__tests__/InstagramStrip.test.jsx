import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import InstagramStrip from '../InstagramStrip'

describe('InstagramStrip', () => {
  it('renders a link to the Instagram profile', () => {
    render(<InstagramStrip />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/sourassopizzaria')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays the handle text', () => {
    render(<InstagramStrip />)
    expect(screen.getByText('@sourassopizzaria')).toBeInTheDocument()
  })
})
