const ADDRESS = 'R. Apolônia Bruneti Gugelmim, 107 - Vila Juliana, Piraquara - PR, 83306-130'
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`
const WHATSAPP_URL = 'https://wa.me/5541998344768'

const HOURS = [
  { days: 'Terça a Sexta', time: '19h – 23h', closed: false },
  { days: 'Sábado e Domingo', time: '18h – 23h', closed: false },
  { days: 'Segunda-feira', time: 'Fechado', closed: true },
]

export default function Contact() {
  return (
    <div className="bg-cream min-h-screen pb-20 p-6">
      <div className="text-center mb-8 pt-4">
        <h1 className="font-brand text-5xl italic text-dark-brown mb-1">Sourasso</h1>
        <p className="text-xs text-terracotta tracking-widest uppercase">Pizzaria Artesanal</p>
      </div>

      <div className="bg-white rounded-2xl border border-cream divide-y divide-cream mb-4">
        <div className="p-4">
          <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
            Endereço
          </p>
          <p className="text-dark-brown text-sm leading-relaxed">{ADDRESS}</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-terracotta text-xs font-semibold mt-2 inline-block"
          >
            Ver no Google Maps →
          </a>
        </div>

        <div className="p-4">
          <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-3">
            Horário de Funcionamento
          </p>
          <div className="space-y-2">
            {HOURS.map(({ days, time, closed }) => (
              <div key={days} className="flex justify-between text-sm">
                <span className={closed ? 'text-gray-300' : 'text-dark-brown'}>{days}</span>
                <span className={`font-medium ${closed ? 'text-gray-300' : 'text-dark-brown'}`}>
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-4 rounded-xl text-sm w-full"
      >
        <span>💬</span> Falar no WhatsApp
      </a>
    </div>
  )
}
