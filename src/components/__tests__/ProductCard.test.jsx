import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from '../ProductCard'

const PRODUCT = {
  id: 'trad-01',
  name: 'Calabresa',
  description: 'Molho de tomate, muçarela, calabresa e orégano.',
  isActive: true,
}

describe('ProductCard', () => {
  it('renders name and display price', () => {
    render(
      <ProductCard
        product={PRODUCT}
        displayPrice="a partir de R$39,90"
        emoji="🍕"
        onSelect={() => {}}
      />
    )
    expect(screen.getByText('Calabresa')).toBeInTheDocument()
    expect(screen.getByText('a partir de R$39,90')).toBeInTheDocument()
  })

  it('renders truncated description', () => {
    render(
      <ProductCard
        product={PRODUCT}
        displayPrice="a partir de R$39,90"
        emoji="🍕"
        onSelect={() => {}}
      />
    )
    expect(screen.getByText(/molho de tomate/i)).toBeInTheDocument()
  })

  it('calls onSelect with the product when clicked', () => {
    const onSelect = vi.fn()
    render(
      <ProductCard
        product={PRODUCT}
        displayPrice="a partir de R$39,90"
        emoji="🍕"
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByText('Calabresa'))
    expect(onSelect).toHaveBeenCalledWith(PRODUCT)
  })
})
