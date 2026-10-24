import Hero from '@/components/Hero';
import Steps from '@/components/Steps';
import Statement from '@/components/Statement';
import AppDemo from '@/components/AppDemo';
import Builders from '@/components/Builders';
import Close from '@/components/Close';
import Motion from '@/components/Motion';
import Intro from '@/components/common/Intro';

export default function Home() {
  return (
    <>
      {/* the opening moment: plays on every load of the home page */}
      <Intro />
      <Hero />
      <Steps />
      <Statement />
      <AppDemo />
      <Builders />
      <Close />
      <Motion />
    </>
  );
}
