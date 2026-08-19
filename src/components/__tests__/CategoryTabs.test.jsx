import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CategoryTabs from '../CategoryTabs'

describe('CategoryTabs', () => {
  it('renders all three category labels', () => {
    render(<CategoryTabs active="Pizzas" onChange={() => {}} />)
    expect(screen.getByText('Pizzas')).toBeInTheDocument()
    expect(screen.getByText('Porções')).toBeInTheDocument()
    expect(screen.getByText('Bebidas')).toBeInTheDocument()
    expect(screen.queryByText('Lanches')).not.toBeInTheDocument()
  })

  it('calls onChange with the category name when clicked', () => {
    const onChange = vi.fn()
    render(<CategoryTabs active="Pizzas" onChange={onChange} />)
    fireEvent.click(screen.getByText('Porções'))
    expect(onChange).toHaveBeenCalledWith('Porções')
  })
})
