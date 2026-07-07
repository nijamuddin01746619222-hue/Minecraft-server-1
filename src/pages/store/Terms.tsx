export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto w-full bg-white retro-border border border-black rounded-xl p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Terms & Conditions</h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-gray-800">
        <section>
          <h2 className="text-xl font-bold text-black mb-3">1. General</h2>
          <p>By purchasing from our store, you agree to these Terms and Conditions. We reserve the right to change these terms at any time without prior notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-3">2. Refunds</h2>
          <p>All sales are final. You may not buyback, stop, or credit the server by any means necessary in order to receive your funds back that of which have been paid. Doing so will result in an immediate ban from the server.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-3">3. Server Rules</h2>
          <p>Purchasing a rank or item does not exempt you from the server rules. If you are banned for breaking the rules, you will not receive a refund for your purchases.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-black mb-3">4. Disclaimer</h2>
          <p>We are not affiliated with Mojang AB or Microsoft. Minecraft is a registered trademark of Mojang AB.</p>
        </section>
      </div>
    </div>
  );
}
