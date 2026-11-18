import { slides } from './slides';

export function SlideStage({
  index,
  preview = false,
  onDemoExit,
}: {
  index: number;
  preview?: boolean;
  onDemoExit?: () => void;
}) {
  const slide = slides[index];
  const Content = slide.Content;
  return (
    <section
      className="slide-stage"
      aria-label={slide.title}
      inert={preview || undefined}
      aria-hidden={preview || undefined}
    >
      <div key={slide.id} className="slide-content">
        <Content preview={preview} onDemoExit={onDemoExit} />
      </div>
      {!['remote', 'instrument', 'orbit', 'reactions'].includes(slide.id) && (
        <span className="slide-number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      )}
    </section>
  );
}
