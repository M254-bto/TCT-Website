import PageBanner from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Trinity Chapel Thika',
  description: 'Privacy policy for the Trinity Chapel Thika website.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        title="Privacy Policy"
        subtitle="Last updated: January 2025"
        crumbs={[{ label: 'Privacy Policy' }]}
      />

      <Section className="bg-[#FAFAF7]">
        <div className="max-w-2xl mx-auto prose prose-slate prose-headings:font-serif prose-headings:text-[#1C3A2E] prose-p:text-[#1A1A1A]/80 prose-p:leading-relaxed prose-a:text-[#2D6A4F]">
          <p>
            Trinity Chapel Thika (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting
            your privacy. This policy outlines how we handle your personal information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We do not collect personal information automatically when you browse our website. If you contact us via the
            contact form, we receive your name, email address, and message content, which are used solely to respond
            to your enquiry.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            Information you voluntarily provide is used exclusively to respond to your enquiry, send you information
            you have requested, or to include you in church communications you have opted into. We do not sell, trade,
            or share your data with third parties.
          </p>

          <h2>Cookies</h2>
          <p>
            This website may use functional cookies to ensure core features operate correctly. We do not use
            advertising or tracking cookies. You may disable cookies in your browser settings without affecting your
            ability to browse the site.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may link to external websites (for example, YouTube for sermon videos). We are not responsible
            for the privacy practices of those sites and encourage you to review their individual policies.
          </p>

          <h2>Data Retention</h2>
          <p>
            Contact form submissions are retained only as long as necessary to respond to your enquiry and are then
            deleted from our correspondence records.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of any personal data we hold about you.
            To exercise these rights, contact us at{' '}
            <a href="mailto:info@tckilifi.org">info@tckilifi.org</a>.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Any changes will be published on this page with the date of
            the latest revision.
          </p>

          <h2>Contact</h2>
          <p>
            For any privacy-related questions, please email us at{' '}
            <a href="mailto:info@tckilifi.org">info@tckilifi.org</a> or visit our{' '}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </Section>
    </>
  )
}
