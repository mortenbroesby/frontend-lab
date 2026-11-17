/** Decorative mark; the adjacent wordmark supplies the accessible name. */
export function LabMark() {
  return (
    <svg
      className="lab-mark"
      width="32"
      height="32"
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="#0a0a0a" stroke="#303030" />
      <g transform="rotate(30 20 20)">
        <path d="M14 8H26V27A6 6 0 0 1 14 27Z" fill="#17231c" />
        <path d="M15 19Q20 17 25 19V27A5 5 0 0 1 15 27Z" fill="#4ade80" />
        <path d="M21 19Q23 18 25 19V27A5 5 0 0 1 20 32V27Q23 23 21 19Z" fill="#22c55e" />
        <path
          d="M14 8V27A6 6 0 0 0 26 27V8M13 8H27"
          fill="none"
          stroke="#f0fdf4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17 12V16" stroke="#9cad9f" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="23" r="1.5" fill="#dcfce7" />
        <circle cx="21" cy="28" r="1" fill="#bbf7d0" />
      </g>
    </svg>
  );
}
