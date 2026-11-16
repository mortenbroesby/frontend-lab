import { tracks } from './tracks';

export function GuideGallery() {
  return (
    <div className="demo-grid">
      {tracks.map((track) => (
        <section className="demo-card" key={track.id} data-track={track.id}>
          <h2>{track.title}</h2>
          <GuideList track={track} />
        </section>
      ))}
    </div>
  );
}

export function GuideList({ track }: { track: (typeof tracks)[number] }) {
  return (
    <ul>
      {track.guides.map((guide) => (
        <li key={guide.slug}>
          <h3>
            <a href={`#/track/${track.id}/${guide.slug}`}>{guide.title}</a>
          </h3>
          <p>{guide.description}</p>
        </li>
      ))}
    </ul>
  );
}
