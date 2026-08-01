import { getPcViewImage, getMobileViewImage } from '../utils/pizzaImages'

export default function ProductCard({
  product,
  displayPrice,
  emoji = '🍽️',
  onSelect,
}) {
  const pcImage = getPcViewImage(product.pcImage)
  const mobileImage = getMobileViewImage(product.mobileImage)

  return (
    <div
      className="bg-white rounded-xl border border-cream p-3 cursor-pointer active:scale-95 transition-transform"
      onClick={() => onSelect(product)}
    >
      <div className="w-full h-24 rounded-lg mb-2 overflow-hidden">
        {mobileImage ? (
          <img src={mobileImage} alt={product.name} className="md:hidden w-full h-full object-cover" />
        ) : (
          <div className="md:hidden w-full h-full bg-cream flex items-center justify-center">
            <span className="text-4xl">{emoji}</span>
          </div>
        )}
        {pcImage ? (
          <img src={pcImage} alt={product.name} className="hidden md:block w-full h-full object-cover" />
        ) : (
          <div className="hidden md:flex w-full h-full bg-cream items-center justify-center">
            <span className="text-4xl">{emoji}</span>
          </div>
        )}
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
