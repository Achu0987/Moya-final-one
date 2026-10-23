import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Journey from '@/components/how/Journey';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import './how-it-works.css';

export const metadata = {
  title: 'How it works: Moya One',
  description:
    'Follow your drinking water from the plant room in the basement to the tap in your kitchen: one line, a Moya1 control unit, and litres you recharge from your phone.',
};

export default function HowItWorks() {
  return (
    <>
      <Journey
        intro={
          <>
            <h1 className="how-title">
              From the building
              <br /> to your glass.
            </h1>
            <p className="how-lede">
              Follow your drinking water from the plant room in the basement to the tap in your kitchen. Five steps,
              and only one of them is yours: the recharge.
            </p>
          </>
        }
      />

      <section className="how-next" aria-labelledby="how-next-title">
        <div className="container">
          <div className="how-next-panel">
            <h2 id="how-next-title" data-reveal="words">
              <Words>See your water, in litres.</Words>
            </h2>
            <p data-reveal="fade">
              The Moya One app shows your balance, and you recharge when you need more. Try a sample recharge on the
              home page.
            </p>
            <div className="how-next-actions" data-reveal="fade">
              {/* PLACEHOLDER: the brief's main action is "check water quality"; point this to /b2c/water-quality once it is built. */}
              <a href="/#water" className="btn btn-primary">
                Try a sample recharge
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="/#contact" className="text-link">
                Talk to us
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Motion />
    </>
  );
}
