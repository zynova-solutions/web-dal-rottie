import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Imprint | Dal Rotti Frankfurt',
  description: 'Legal disclosure (Impressum) for Dal Rotti Frankfurt. Contact, ownership, and regulatory information as required by German law.'
};

export default function ImprintPage() {
  setRequestLocale('en');
  return (
    <Container>
      <section className="section primary-section">
        <div className="prose prose-lg max-w-3xl mx-auto">
          <h1 className="section-title">Imprint</h1>
          <p><strong>Information according to § 5 TMG</strong></p>
          <p>
            Dal Rotti Frankfurt<br />
            Taunusstraße 25<br />
            60329 Frankfurt am Main<br />
            Germany
          </p>
          <p>
            <strong>Represented by:</strong><br />
            Ankit Patel, Priya Shah, Rohan Mehta
          </p>
          <p>
            <strong>Contact:</strong><br />
            Phone: +49 69 30036126<br />
            E-Mail: info@dalrotti.com
          </p>
          <p>
            <strong>VAT ID:</strong><br />
            DE123456789 (example)
          </p>
          <p>
            <strong>Supervisory Authority:</strong><br />
            Ordnungsamt Frankfurt am Main
          </p>
          <p>
            <strong>Responsible for content according to § 55 Abs. 2 RStV:</strong><br />
            Dal Rotti Frankfurt, Taunusstraße 25, 60329 Frankfurt am Main
          </p>
          <p>
            <strong>Disclaimer:</strong><br />
            Despite careful content control, we assume no liability for the content of external links. The operators of linked pages are solely responsible for their content.
          </p>
        </div>
      </section>
    </Container>
  );
}
