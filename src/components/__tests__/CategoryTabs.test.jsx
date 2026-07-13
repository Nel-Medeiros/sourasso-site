import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CategoryTabs from '../CategoryTabs'

describe('CategoryTabs', () => {
  it('renders all four category labels', () => {
    render(<CategoryTabs active="Pizzas" onChange={() => {}} />)
    expect(screen.getByText('Pizzas')).toBeInTheDocument()
    expect(screen.getByText('Lanches')).toBeInTheDocument()
    expect(screen.getByText('Porções')).toBeInTheDocument()
    expect(screen.getByText('Bebidas')).toBeInTheDocument()
  })

  it('calls onChange with the category name when clicked', () => {
    const onChange = vi.fn()
    render(<CategoryTabs active="Pizzas" onChange={onChange} />)
    fireEvent.click(screen.getByText('Lanches'))
    expect(onChange).toHaveBeenCalledWith('Lanches')
  })
})
