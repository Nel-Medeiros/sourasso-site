const CATEGORIES = ['Pizzas', 'Lanches', 'Porções', 'Bebidas']

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto py-3 px-4 bg-cream sticky top-0 z-40 scrollbar-hide border-b border-[#EAD9CA]">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
            active === cat
              ? 'bg-terracotta text-cream'
              : 'bg-white text-terracotta border border-terracotta'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
