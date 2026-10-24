import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import DropJourney from '@/components/how/DropJourney';
import TryIt from '@/components/how/TryIt';
import Story from '@/components/how/Story';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import './how-it-works.css';

export const metadata = {
  title: 'How it works: Moya One',
  description:
    'Follow one drop of water from the plant room in the basement, up your tower and into your glass. Then try a sample recharge and pour.',
};

export default function HowItWorks() {
  return (
    <>
      {/* start to end, in order: who does what, before and after you move in */}
      <section className="how-intro" aria-labelledby="how-title">
        <div className="container">
          <div className="how-intro-head">
            <h1 id="how-title" className="how-title">
              How it works,
              <br /> start to end.
            </h1>
            <p className="how-lede">
              Six steps, in order. Your builder does the first three while the tower goes up. The last three are yours, from the day you move in.
            </p>
          </div>
          <Story />
        </div>
      </section>

      <DropJourney />

      <TryIt />

      {/* what the resident does, and what they no longer do */}
      <section className="dodont" aria-labelledby="dodont-title">
        <div className="container">
          <h2 id="dodont-title" className="dodont-title" data-reveal="words">
            <Words>What you do. What you never do.</Words>
          </h2>
          <div className="dodont-grid">
            <div className="dodont-do" data-reveal="fade">
              <p className="dodont-label">You do</p>
              <ol>
                <li>Recharge litres from your phone.</li>
                <li>Pour a glass from its own tap.</li>
              </ol>
            </div>
            <div className="dodont-never" data-reveal="fade">
              <p className="dodont-label">You never</p>
              <ul>
                <li>Carry or store 20-litre jugs.</li>
                <li>Wait in for a delivery.</li>
                {/* PLACEHOLDER: "no filters for residents" follows CLIENT_CONTEXT.md; Claims tab "To confirm". */}
                <li>Change a filter under the sink.</li>
              </ul>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dodont-jug" src="/illustrations/jug.svg" alt="" width="160" height="216" />
            </div>
          </div>
        </div>
      </section>

      <section className="how-next" aria-labelledby="how-next-title">
        <div className="container">
          <div className="how-next-panel">
            <h2 id="how-next-title" data-reveal="words">
              <Words>See your water, in litres.</Words>
            </h2>
            <p data-reveal="fade">
              The Moya One app shows your balance, and you recharge when you need more. Builders can plan it into a
              tower from the start.
            </p>
            <div className="how-next-actions" data-reveal="fade">
              {/* PLACEHOLDER: the brief's main action is "check water quality"; point this to /b2c/water-quality once it is built. */}
              <a href="/b2b/builders" className="btn btn-primary">
                For builders
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="/contact" className="text-link">
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
