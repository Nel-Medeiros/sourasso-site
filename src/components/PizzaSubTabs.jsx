const SUBCATEGORIES = ['Tradicionais', 'Especiais', 'Premium', 'Doces', 'Doces Especiais']

export default function PizzaSubTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4 bg-white border-b border-cream scrollbar-hide">
      {SUBCATEGORIES.map((sub) => (
        <button
          key={sub}
          onClick={() => onChange(sub)}
          className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            active === sub
              ? 'bg-rose-gold text-white'
              : 'text-terracotta'
          }`}
        >
          {sub}
        </button>
      ))}
    </div>
  )
}
