import { PhotoGallery } from "./PhotoGallery";
import { useId, useState } from "react";
import { content as c } from "./content";
import { PhotoSlot, SectionTitle } from "./components";
import "./school-presentation.css";
function ExpandableStory({
  paragraphs,
  openLabel,
  closeLabel,
}: {
  paragraphs: string[];
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="expandable-story">
      <button
        type="button"
        className="story-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {open ? closeLabel : openLabel}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div id={id} hidden={!open} className="story-expanded">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
export function SchoolPresentation() {
  return (
    <div className="school-presentation">
      <section
        className="section school-editorial"
        id="escola"
        aria-labelledby="school-heading"
      >
        <div className="editorial-photo school-classroom">
          <PhotoSlot photo={c.school.photo} />
        </div>
        <div className="editorial-copy">
          <div id="school-heading">
            <SectionTitle label={c.school.label} title={c.school.title} />
          </div>
          <div className="institutional-copy">
            {c.school.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <nav
            className="people-links"
            aria-label="Conheça as pessoas da escola"
          >
            <a href="#fundadora">
              Nossa fundadora <span aria-hidden="true">↘</span>
            </a>
            <a href="#equipe">
              Nossa equipe <span aria-hidden="true">↘</span>
            </a>
          </nav>
        </div>
      </section>
      {
        <div className="section">
          <PhotoGallery collection="escola" />
        </div>
      }
      <section
        className="founder-section"
        id="fundadora"
        aria-labelledby="founder-heading"
      >
        <div className="section founder-layout">
          <div className="editorial-copy">
            <div id="founder-heading">
              <SectionTitle label={c.founder.label} title={c.founder.title} />
            </div>
            <p className="founder-summary">{c.founder.summary}</p>
            <ExpandableStory
              paragraphs={c.founder.story}
              openLabel={c.founder.expandLabel}
              closeLabel={c.founder.collapseLabel}
            />
          </div>
          <div className="editorial-photo founder-photo">
            <PhotoSlot photo={c.founder.photo} />
          </div>
        </div>
      </section>
      <section
        className="section team-section"
        id="equipe"
        aria-labelledby="team-heading"
      >
        <div className="editorial-photo team-photo">
          <PhotoSlot photo={c.team.photo} />
        </div>
        <div className="editorial-copy">
          <div id="team-heading">
            <SectionTitle label={c.team.label} title={c.team.title} />
          </div>
          <div className="institutional-copy">
            {c.team.paragraphs.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ExpandableStory
            paragraphs={c.team.paragraphs.slice(2, -1)}
            openLabel={c.team.expandLabel}
            closeLabel={c.team.collapseLabel}
          />
          <p className="team-closing">{c.team.paragraphs.at(-1)}</p>
        </div>
      </section>
    </div>
  );
}
