import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Drishti Studios",
};

export default function TermsPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
      <Link href="/" className="font-label-md text-primary tracking-widest hover:text-white transition-colors mb-8 inline-block uppercase flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Home
      </Link>
      
      <h1 className="font-display text-4xl md:text-5xl mb-12">Terms of Service</h1>
      
      <div className="space-y-8 font-sans text-body-md text-on-surface-variant leading-relaxed max-w-3xl">
        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">1. Agreement to Terms</h2>
          <p>By accessing our website and using our photography, videography, and editing services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>
        
        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">2. Intellectual Property</h2>
          <p>All content included on this site, such as photographs, videos, text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of Drishti Studios or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">3. Booking and Cancellations</h2>
          <p>When booking a session with Drishti Studios, an advance payment may be required to secure your slot. Cancellations made less than 48 hours before the scheduled shoot may be subject to a cancellation fee. We reserve the right to reschedule due to unforeseen circumstances, including severe weather for outdoor shoots.</p>
        </section>
        
        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">4. Revisions and Modifications</h2>
          <p>Drishti Studios may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
        </section>
      </div>
    </div>
  );
}
