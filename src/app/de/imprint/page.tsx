import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Impressum | Dal Rotti Frankfurt',
  description: 'Impressum für Dal Rotti Frankfurt. Kontakt, Inhaber und rechtliche Hinweise gemäß deutschem Recht.'
};

export default function ImprintPage() {
  setRequestLocale('de');
  return (
    <Container>
      <section className="section primary-section">
        <div className="prose prose-lg max-w-3xl mx-auto">
          <h1 className="section-title">Impressum</h1>
          <p><strong>Angaben gemäß § 5 TMG</strong></p>
          <p>
            Dal Rotti Frankfurt<br />
            Taunusstraße 25<br />
            60329 Frankfurt am Main<br />
            Deutschland
          </p>
          <p>
            <strong>Vertreten durch:</strong><br />
            Ankit Patel, Priya Shah, Rohan Mehta
          </p>
          <p>
            <strong>Kontakt:</strong><br />
            Telefon: +49 69 30036126<br />
            E-Mail: info@dalrotti.com
          </p>
          <p>
            <strong>Umsatzsteuer-ID:</strong><br />
            DE123456789 (Beispiel)
          </p>
          <p>
            <strong>Aufsichtsbehörde:</strong><br />
            Ordnungsamt Frankfurt am Main
          </p>
          <p>
            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
            Dal Rotti Frankfurt, Taunusstraße 25, 60329 Frankfurt am Main
          </p>
          <p>
            <strong>Haftungsausschluss:</strong><br />
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </div>
      </section>
    </Container>
  );
}
