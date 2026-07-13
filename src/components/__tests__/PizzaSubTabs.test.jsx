import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PizzaSubTabs from '../PizzaSubTabs'

describe('PizzaSubTabs', () => {
  it('renders all five pizza subcategories', () => {
    render(<PizzaSubTabs active="Tradicionais" onChange={() => {}} />)
    expect(screen.getByText('Tradicionais')).toBeInTheDocument()
    expect(screen.getByText('Especiais')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Doces')).toBeInTheDocument()
    expect(screen.getByText('Doces Especiais')).toBeInTheDocument()
  })

  it('calls onChange with subcategory name when clicked', () => {
    const onChange = vi.fn()
    render(<PizzaSubTabs active="Tradicionais" onChange={onChange} />)
    fireEvent.click(screen.getByText('Premium'))
    expect(onChange).toHaveBeenCalledWith('Premium')
  })
})
