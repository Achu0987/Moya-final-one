import Holding from '@/components/common/Holding';

// PLACEHOLDER: holding page until the Compare hub is built (build order: 4 of 8).
export const metadata = { title: 'Compare: Moya One', robots: { index: false } };

export default function Page() {
  return <Holding title="Compare" text="Moya One, bottled water and RO filters, side by side." related={[{ href: '/compare/bottled-water', label: 'Moya One and bottled water' }, { href: '/compare/ro-filters', label: 'Moya One and RO filters' }]} />;
}
