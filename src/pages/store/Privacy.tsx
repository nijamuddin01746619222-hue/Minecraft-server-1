export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto w-full bg-white retro-border border border-black rounded-xl p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-gray-800">
        <p>This privacy policy explains how we collect, use, and protect your personal information.</p>
        
        <section>
          <h2 className="text-xl font-bold text-black mb-3">1. Information Collection</h2>
          <p>We only collect information necessary for processing transactions, such as your email address, Minecraft username, and payment transaction IDs. We do not store credit card numbers or sensitive financial data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-3">2. Use of Information</h2>
          <p>The information we collect is used solely to process your orders, provide support, and improve our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-3">3. Data Security</h2>
          <p>We implement security measures to maintain the safety of your personal information when you place an order.</p>
        </section>
      </div>
    </div>
  );
}
