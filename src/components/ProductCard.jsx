export default function ProductCard({
  product,
  displayPrice,
  emoji = '🍽️',
  onSelect,
}) {
  return (
    <div
      className="bg-white rounded-xl border border-cream p-3 cursor-pointer active:scale-95 transition-transform"
      onClick={() => onSelect(product)}
    >
      <div className="w-full h-24 bg-cream rounded-lg mb-2 flex items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>
      <h3 className="text-dark-brown font-semibold text-sm leading-tight mb-1">
        {product.name}
      </h3>
      <p className="text-gray-400 text-xs line-clamp-2 mb-2">
        {product.description}
      </p>
      <p className="text-terracotta text-xs font-semibold">{displayPrice}</p>
    </div>
  )
}
