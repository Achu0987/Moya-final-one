// The water line running round a box's edge: a faint outline with an orange segment travelling along it.
export default function Trace() {
  return (
    <svg className="trace" aria-hidden="true">
      <rect className="trace-base" pathLength="100" />
      <rect className="trace-run" pathLength="100" />
    </svg>
  );
}
