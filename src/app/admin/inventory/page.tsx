import { useLocale } from 'next-intl';
import en from '../i18n/en.json';
import de from '../i18n/de.json';

export default function InventoryManagement() {
  const locale = useLocale();
  const t = locale === 'de' ? de : en;
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{t.inventory.title}</h1>
      <p>{t.inventory.desc}</p>
      {/* TODO: Implement inventory management UI */}
    </div>
  );
}
