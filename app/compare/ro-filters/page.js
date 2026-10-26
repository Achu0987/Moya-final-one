import Holding from '@/components/common/Holding';

// PLACEHOLDER: holding page until the RO filters comparison is built (build order: 6 of 8).
export const metadata = { title: 'RO filters: Moya One', robots: { index: false } };

export default function Page() {
  return <Holding title="RO filters" text="What a filter under the sink asks of a household, against Moya One." related={[{ href: '/compare/bottled-water', label: 'Moya One and bottled water' }, { href: '/compare', label: 'All three side by side' }]} />;
}
