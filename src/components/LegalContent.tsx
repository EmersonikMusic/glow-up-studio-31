export default function LegalContent() {
  return (
    <>
      {/* Header */}
      <div className="px-6 md:px-8 pt-10 pb-6 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <p className="text-sm font-subheading font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "hsl(185 70% 55%)" }}>
          Legal
        </p>
        <h1
          className="text-3xl sm:text-4xl font-heading font-extrabold uppercase leading-none tracking-tight"
          style={{
            background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.05,
          }}
        >
          TERMS OF SERVICE & PRIVACY POLICY
        </h1>
        <p className="mt-3 text-sm font-body font-semibold text-white/80">
          Effective Date: August 24, 2026
        </p>
      </div>

      {/* Scrollable body */}
      <div className="about-scroll-area flex-1 overflow-y-auto overscroll-contain">
        <div className="px-6 md:px-8 py-7 flex flex-col gap-6 game-text-white">
          <div>
            <p className="text-sm leading-relaxed font-body font-semibold">
              Welcome to Triviolivia (the "Service"), operated by Triviolivia Inc. ("we," "us," or "our"). By accessing or using our website and application, you agree to be bound by these Terms of Service and our Privacy Policy below. If you do not agree, please do not use the Service.
            </p>
          </div>

          <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

          <div>
            <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "hsl(185 70% 55%)" }}>
              Part 1: Terms of Service
            </h2>

            <div className="flex flex-col gap-4 text-sm leading-relaxed font-body font-semibold">
              <div>
                <p className="font-black">1. Eligibility & Accounts</p>
                <p>When you create an account using Google Login, you agree to provide accurate information. You are responsible for maintaining the security of your account.</p>
              </div>
              <div>
                <p className="font-black">2. Intellectual Property</p>
                <p>All content, graphics, game design, and trivia questions on Triviolivia are the property of Triviolivia Inc., or its licensors and are protected by copyright laws. You may not reproduce or distribute our content without permission.</p>
              </div>
              <div>
                <p className="font-black">3. User Conduct</p>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                  <li>Cheat, exploit, or use automated bots/scrapers to play the game.</li>
                  <li>Harass, abuse, or harm other users.</li>
                  <li>Attempt to disrupt or compromise the security of our servers.</li>
                </ul>
              </div>
              <div>
                <p className="font-black">4. Termination</p>
                <p>We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.</p>
              </div>
              <div>
                <p className="font-black">5. Limitation of Liability</p>
                <p>The Service is provided on an "as-is" and "as-available" basis. To the maximum extent permitted by law, Triviolivia Inc. shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Service.</p>
              </div>
              <div>
                <p className="font-black">6. Governing Law</p>
                <p>These Terms are governed by the laws of Ontario, Canada, without regard to its conflict of law principles.</p>
              </div>
            </div>
          </div>

          <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

          <div>
            <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "hsl(185 70% 55%)" }}>
              Part 2: Privacy Policy
            </h2>

            <div className="flex flex-col gap-4 text-sm leading-relaxed font-body font-semibold">
              <div>
                <p className="font-black">1. Information We Collect</p>
                <p>When you log in using your Google Account, we collect certain information provided by Google OAuth:</p>
                <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                  <li><span className="font-black">Account Information:</span> Your name, email address, and profile picture URL.</li>
                  <li><span className="font-black">Usage Data:</span> We may collect basic technical data, such as your IP address, browser type, and device information, to improve application performance.</li>
                  <li><span className="font-black">Gameplay Data:</span> We track your game history, and in-app achievements to provide the core trivia experience.</li>
                </ul>
              </div>
              <div>
                <p className="font-black">2. How We Use Your Information</p>
                <p>We use the collected data strictly to:</p>
                <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                  <li>Authenticate your identity and manage your user account.</li>
                  <li>Provide, maintain, and improve the gameplay experience.</li>
                  <li>Communicate with you regarding account updates or support.</li>
                </ul>
              </div>
              <div>
                <p className="font-black">3. Sharing Your Information</p>
                <p>We do not sell your personal data to third parties.</p>
                <p className="mt-1">We only share information with third-party service providers (like hosting platforms or databases) necessary to run the app, or if required by law to comply with legal obligations.</p>
              </div>
              <div>
                <p className="font-black">4. Data Security & Retention</p>
                <p>We implement industry-standard security measures to protect your data. We retain your information for as long as your account is active or as needed to provide you with the Service.</p>
              </div>
              <div>
                <p className="font-black">5. Your Rights & Data Deletion</p>
                <p>
                  Depending on your location, you may have the right to access, correct, or delete your personal data. To request the deletion of your account and all associated Google OAuth data, please contact us at{" "}
                  <a href="mailto:mark.mazurek@triviolivia.com" className="font-black underline underline-offset-[3px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors">
                    mark.mazurek@triviolivia.com
                  </a>. We will process valid deletion requests within 30 days.
                </p>
              </div>
              <div>
                <p className="font-black">6. Changes to This Policy</p>
                <p>We may update this Privacy Policy from time to time. We will notify you of any major changes by posting the new policy on this page and updating the effective date.</p>
              </div>
              <div>
                <p className="font-black">7. Contact Us</p>
                <p>If you have any questions about these Terms or our Privacy Policy, please contact us at:</p>
                <p className="mt-1">
                  Email:{" "}
                  <a href="mailto:mark.mazurek@triviolivia.com" className="font-black underline underline-offset-[3px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors">
                    mark.mazurek@triviolivia.com
                  </a>
                </p>
                <p className="mt-1">
                  Website:{" "}
                  <a href="https://www.Triviolivia.com" target="_blank" rel="noopener noreferrer" className="font-black underline underline-offset-[3px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors">
                    www.Triviolivia.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
