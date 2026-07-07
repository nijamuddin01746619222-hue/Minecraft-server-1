import { useSettingsStore } from '../../store/useSettingsStore';

export default function Support() {
  const { settings } = useSettingsStore();

  return (
    <div className="max-w-3xl mx-auto w-full bg-white retro-border border border-black rounded-xl p-8">
      <h1 className="text-3xl font-bold text-black mb-6">Support</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-800 leading-relaxed mb-6">
          Need help with your purchase or have questions about the server? 
          Our support team is always ready to assist you.
        </p>

        <h3 className="text-xl font-bold text-black mb-4">Discord Support (Recommended)</h3>
        <p className="text-gray-800 leading-relaxed mb-6">
          The fastest way to get support is through our Discord server. Join our community and open a ticket in the support channel.
        </p>
        
        {settings.discordLink && (
          <a 
            href={settings.discordLink} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-black font-bold px-6 py-3 rounded-lg transition-colors mb-8"
          >
            Join our Discord
          </a>
        )}

        <h3 className="text-xl font-bold text-black mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="bg-background p-4 rounded-lg border border-black">
            <h4 className="font-bold text-black mb-2">How long does it take to receive my rank?</h4>
            <p className="text-gray-600 text-sm">Payments usually process within 1-5 minutes. If you are paying manually, it might take a bit longer for admins to verify the transaction.</p>
          </div>
          <div className="bg-background p-4 rounded-lg border border-black">
            <h4 className="font-bold text-black mb-2">Can I transfer my rank to another account?</h4>
            <p className="text-gray-600 text-sm">Ranks are strictly bound to the username you entered during checkout and cannot be transferred.</p>
          </div>
          <div className="bg-background p-4 rounded-lg border border-black">
            <h4 className="font-bold text-black mb-2">Do you offer refunds?</h4>
            <p className="text-gray-600 text-sm">All purchases are final and non-refundable, as they are digital intangible items.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
