import { NavLink } from 'react-router-dom'
import useCartStore from '../store/cartStore'

export default function BottomNav() {
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  )

  const link = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 text-xs px-4 py-2 ${
      isActive ? 'text-terracotta' : 'text-gray-400'
    }`

  return (
    <nav aria-label="Navegação principal" className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream flex justify-around items-center h-16 z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <NavLink to="/" end className={link}>
        <span className="text-xl">🏠</span>
        Início
      </NavLink>

      <NavLink to="/cart" className={link}>
        <span className="text-xl relative">
          🛒
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-terracotta text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {itemCount}
            </span>
          )}
        </span>
        Carrinho
      </NavLink>

      <NavLink to="/contact" className={link}>
        <span className="text-xl">📞</span>
        Contato
      </NavLink>
    </nav>
  )
}
