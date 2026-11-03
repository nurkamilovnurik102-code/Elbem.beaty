/** Shared presentational pieces, independent from the database and routing. */
import type {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {Menu} from 'lucide-react';

type IconButtonProps = {
  icon: typeof Menu;
  label: string;
  onClick: () => void;
  badge?: number;
};

export function IconButton({icon: Icon, label, onClick, badge}: IconButtonProps) {
  return (
    <button type="button" aria-label={label} title={label} className="icon-button" onClick={onClick}>
      <Icon size={19} strokeWidth={1.8}/>
      {badge ? <span className="count">{badge}</span> : null}
    </button>
  );
}

type SectionProps = {eyebrow: string; title: string; children: ReactNode; action?: ReactNode};
export function Section({eyebrow, title, children, action}: SectionProps) {
  const {t} = useTranslation();
  return (
    <section className="section shell">
      <div className="section-heading">
        <div><div className="eyebrow">{t(eyebrow)}</div><h2>{t(title)}</h2></div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Decorative shapes are inaccessible to pointer events and screen readers. */
export function BackgroundDecor() {
  return (
    <div className="bg-petals" aria-hidden="true">
      <span className="ambient-glow ambient-glow-a"/>
      <span className="ambient-glow ambient-glow-b"/>
      {Array.from({length: 7}, (_, index) => (
        <span className={`petal petal-${index + 1}`} key={index}/>
      ))}
    </div>
  );
}
