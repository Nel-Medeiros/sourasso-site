const WHATSAPP_NUMBER = '5541998344768'

export function buildWhatsAppUrl(items, { name, address, payment }) {
  const lines = items.map((item) => {
    const sizeDetail = item.size ? `(${item.size.slices} fatias)` : ''
    const bordaDetail = item.borda ? ` + ${item.borda.name}` : ''
    const detail = sizeDetail ? ` ${sizeDetail}${bordaDetail}` : ''
    const price = (item.unitPrice * item.quantity).toFixed(2).replace('.', ',')
    const obs = item.observations ? ` _(${item.observations})_` : ''
    return `- ${item.name}${detail}: R$${price}${obs}`
  })

  const total = items
    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    .toFixed(2)
    .replace('.', ',')

  const message = [
    '🍕 *Pedido Sourasso*',
    '',
    '*Itens:*',
    ...lines,
    '',
    `*Total: R$${total}*`,
    `*Pagamento: ${payment}*`,
    '',
    `*Nome:* ${name}`,
    `*Endereço:* ${address}`,
  ].join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
