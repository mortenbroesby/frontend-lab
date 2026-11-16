/** Decorative mark; the adjacent wordmark supplies the accessible name. */
export function LabMark() {
  return (
    <svg
      className="lab-mark"
      width="28"
      height="28"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="6" fill="#0a0a0a" />
      <g transform="rotate(30 16 16)">
        <path d="M12 16Q16 14 20 16V23A4 4 0 0 1 12 23Z" fill="#4ade80" />
        <path
          d="M12 7V23A4 4 0 0 0 20 23V7M11 7H21"
          fill="none"
          stroke="#fafafa"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="19" r="1" fill="#bbf7d0" />
        <circle cx="17.5" cy="22" r="0.75" fill="#bbf7d0" />
      </g>
    </svg>
  );
}
