import Link from 'next/link';

const reportCards = [
  { title: 'Sales', description: 'View sales performance and trends', href: '/admin/reports/sales' },
  { title: 'Top Dishes', description: 'See your best-selling dishes', href: '/admin/reports/top-dishes' },
  { title: 'Payment Types', description: 'Analyze payment method breakdown', href: '/admin/reports/payment-types' },
  { title: 'Coupon Usage', description: 'Track coupon usage and effectiveness', href: '/admin/reports/coupon-usage' },
  { title: 'Customer Retention', description: 'Understand customer loyalty and repeat visits', href: '/admin/reports/customer-retention' },
];

export default function ReportsPage() {
  return (
    <div className="p-4 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Reports Hub</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reportCards.map(card => (
          <Link key={card.title} href={card.href} className="block bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100 hover:border-primary group">
            <div className="text-lg font-semibold mb-2 text-primary group-hover:underline">{card.title}</div>
            <div className="text-gray-600 text-sm mb-2">{card.description}</div>
            <div className="text-xs text-gray-400 group-hover:text-primary">View Report →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
