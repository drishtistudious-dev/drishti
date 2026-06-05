import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Drishti Studios",
};

export default function PrivacyPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
      <Link href="/" className="font-label-md text-primary tracking-widest hover:text-white transition-colors mb-8 inline-block uppercase flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Home
      </Link>
      
      <h1 className="font-display text-4xl md:text-5xl mb-12">Privacy Policy</h1>
      
      <div className="space-y-8 font-sans text-body-md text-on-surface-variant leading-relaxed max-w-3xl">
        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">1. Introduction</h2>
          <p>Welcome to Drishti Studios. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
        </section>
        
        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">2. The Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="font-display text-2xl text-on-surface mb-4">4. Contact Details</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
          <p className="mt-2 text-primary">contact@drishtistudios.com</p>
        </section>
      </div>
    </div>
  );
}
