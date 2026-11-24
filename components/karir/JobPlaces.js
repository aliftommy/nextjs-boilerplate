'use client';
import { Fragment } from 'react';
import { JOB_PART } from '@/lib/data';
import { IconPin } from '../icons';
import { useLang } from '../lang';

export default function JobPlaces({ list }) {
  const { t } = useLang();
  return (
    <p className="job__places">
      <IconPin />
      <span className="sr-only">{t(JOB_PART.label_lokasi)}: </span>
      {list.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <><span className="job__sep" aria-hidden="true">|</span><span className="sr-only">, </span></>}
          <span>{l}</span>
        </Fragment>
      ))}
    </p>
  );
}
