export default function CartItem({ item, onUpdateQty, onRemove }) {
  const sizeDetail = item.size
    ? `${item.size.slices} fatias${item.borda ? ` · Borda: ${item.borda.name}` : ''}`
    : null
  const total = (item.unitPrice * item.quantity).toFixed(2).replace('.', ',')

  return (
    <div className="bg-white rounded-xl p-3 border border-cream flex gap-3 items-start">
      <div className="flex-1 min-w-0">
        <h4 className="text-dark-brown font-semibold text-sm">{item.name}</h4>
        {sizeDetail && (
          <p className="text-gray-400 text-xs mt-0.5">{sizeDetail}</p>
        )}
        {item.observations && (
          <p className="text-gray-300 text-xs italic mt-0.5">"{item.observations}"</p>
        )}
        <p className="text-terracotta font-semibold text-sm mt-1">R${total}</p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          onClick={() => onRemove(item.cartId)}
          className="text-gray-300 text-sm leading-none"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQty(item.cartId, item.quantity - 1)}
            className="w-6 h-6 rounded-full bg-cream text-terracotta font-bold text-sm flex items-center justify-center"
          >
            −
          </button>
          <span className="text-dark-brown text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQty(item.cartId, item.quantity + 1)}
            className="w-6 h-6 rounded-full bg-terracotta text-white font-bold text-sm flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
