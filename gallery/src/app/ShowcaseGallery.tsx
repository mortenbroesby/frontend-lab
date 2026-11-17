import { showcases } from '../showcase-registry';
import { requirementLabels } from '@lab/demo-kit/types';

export function ShowcaseGallery() {
  return (
    <div className="showcase-gallery">
      {showcases.map((showcase) => (
        <a className="showcase-card" href={showcase.href} key={showcase.id}>
          <div className="showcase-art" aria-hidden="true">
            {showcase.preview ? (
              <img src={showcase.preview} alt="" width="1200" height="600" />
            ) : (
              <span className="showcase-placeholder">{showcase.title}</span>
            )}
          </div>
          <div className="showcase-copy">
            <span className="eyebrow">Interactive showcase</span>
            <h2>{showcase.title}</h2>
            <p>{showcase.description}</p>
            {showcase.requirements && (
              <p>{showcase.requirements.map((id) => requirementLabels[id]).join(' · ')}</p>
            )}
            <span className="demo-open">
              Enter showcase <span aria-hidden="true">↗</span>
            </span>
          </div>
        </a>
      ))}
      {!showcases.length && (
        <p>
          No showcases yet. <a href="#/demos">Explore the demos</a>.
        </p>
      )}
    </div>
  );
}
