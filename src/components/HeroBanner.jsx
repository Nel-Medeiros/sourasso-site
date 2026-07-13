export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-br from-terracotta to-rose-gold p-8 text-center relative overflow-hidden">
      <p className="text-cream text-xs tracking-widest uppercase mb-1 opacity-80">
        Bem-vindo à
      </p>
      <h1 className="font-brand text-5xl italic text-white mb-1 drop-shadow" data-testid="brand-heading">
        Sourasso
      </h1>
      <p className="text-cream text-sm opacity-90 mb-2">Pizzaria Artesanal</p>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white opacity-10 rounded-full pointer-events-none" />
    </div>
  )
}
