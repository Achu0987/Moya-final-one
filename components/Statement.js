import Words from './common/Words';

// A quiet, editorial pause between the steps and the app: one line at display size, generous space.
export default function Statement() {
  return (
    <section className="statement" aria-labelledby="statement-title">
      <div className="container statement-inner">
        <h2 id="statement-title" className="statement-title" data-reveal="words">
          <Words>Water, the way the rest of your home works.</Words>
        </h2>
        <p className="statement-text" data-reveal="fade">
          Nothing delivered to the door. Nothing boxed under the sink. A tap, built in with the rest of your home.
        </p>
      </div>
    </section>
  );
}
