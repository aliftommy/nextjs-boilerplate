'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { JOB, JOB_PART } from '@/lib/data';
import { IconCheck } from '../icons';
import { useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';
import JobPlaces from './JobPlaces';

function Checklist({ id, title, items, className = '' }) {
  const { t } = useLang();
  return (
    <section className={'job-block ' + className} aria-labelledby={id} data-reveal>
      <h2 className="job-block__title" id={id}>{t(title)}</h2>
      <ul className="checks">
        {items.map((x) => <li key={x.id}><span className="checks__icon"><IconCheck /></span><span>{t(x)}</span></li>)}
      </ul>
    </section>
  );
}

// Everything on one screen: a single panel sized to the space under the header.
export default function LowonganPage() {
  const ref = useRef(null);
  const { t } = useLang();
  const job = JOB;
  useReveal(ref);
  useDocTitle(job.judul_tab.id, job.judul_tab.en);

  const apply = job.link_lamaran;

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero job-page" aria-labelledby="jobTitle">
        <div className="container job-page__grid">
          <div className="job-page__head">
            <Link className="back-link" href="/karir/"><span aria-hidden="true">←</span>{t(JOB_PART.tombol_kembali)}</Link>
            <p className="kicker">{t(JOB_PART.label_kecil_detail)}</p>
            <h1 className="page-title job-page__title" id="jobTitle">{t(job.posisi)}</h1>
            <JobPlaces list={job.lokasi} />
          </div>

          {job.gambar_detail && (
            <div className="job-page__art"><img src={`/img/karir/${job.gambar_detail}.webp`} alt="" fetchPriority="high" decoding="async" /></div>
          )}

          {apply && (
            <div className="job-page__cta">
              <p>{t(job.ajakan)}</p>
              <a className="btn btn--primary btn--lg" href={apply} target="_blank" rel="noopener">
                <span>{apply.replace(/^https?:\/\//, '')}</span><span className="arr" aria-hidden="true">→</span>
              </a>
            </div>
          )}

          {job.kualifikasi?.length > 0 && (
            <Checklist id="jobReq" className="job-page__req" title={JOB_PART.judul_kualifikasi} items={job.kualifikasi} />
          )}

          <div className="job-page__side">
            {job.berkas?.length > 0 && <Checklist id="jobDocs" title={JOB_PART.judul_berkas} items={job.berkas} />}
            {job.benefit?.length > 0 && (
              <section className="job-block" aria-labelledby="jobPerks" data-reveal>
                <h2 className="job-block__title" id="jobPerks">{t(JOB_PART.judul_benefit)}</h2>
                <ul className="perks">{job.benefit.map((b) => <li key={b.id}>{t(b)}</li>)}</ul>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
