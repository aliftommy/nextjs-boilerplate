'use client';
/* KARIR
   Jalan berkelok "titik awal -> Belajar -> Bersama -> Berdampak -> logo" (GSAP):
   saat gambar masuk layar, jejak karamel terisi sepanjang jalan, titik kecil berjalan di ujungnya,
   dan tiap tonggak menyala saat dilewati. */
import { useRef } from 'react';
import { WA_KARIR } from '@/lib/data';
import { gsap, motionOK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { IconWa } from '../icons';
import { T, useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';

const ROAD = 'M48 470C180 470 226 404 176 352 124 300 172 236 282 254c110 18 190-16 150-88-36-62 0-104 68-108';
const MILESTONES = [
  { at: 0.3, n: 1, x: 32, y: 9, anchor: 'start', id: 'Belajar', en: 'Learn' },
  { at: 0.56, n: 2, x: -8, y: 52, anchor: 'middle', id: 'Bersama', en: 'Together' },
  { at: 0.8, n: 3, x: -32, y: 9, anchor: 'end', id: 'Berdampak', en: 'Impact' },
];

function Road() {
  const ref = useRef(null);
  const { L } = useLang();

  useGSAP(() => {
    const fig = ref.current;
    const path = fig.querySelector('.road__path');
    const trail = fig.querySelector('.road__trail');
    const traveler = fig.querySelector('.road__traveler');
    const ms = [...fig.querySelectorAll('.ms')];
    const len = path.getTotalLength();
    ms.forEach((g) => {
      const pt = path.getPointAtLength(len * +g.dataset.at);
      g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      g.classList.add('is-placed');
    });
    const set = (p) => {
      trail.style.strokeDashoffset = String(1 - p);
      const pt = path.getPointAtLength(len * p);
      traveler.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      ms.forEach((g) => g.classList.toggle('is-on', p >= +g.dataset.at - 0.005));
      fig.classList.toggle('is-done', p >= 1);
    };
    if (!motionOK()) { set(1); return; }
    set(0);
    const state = { p: 0 };
    ScrollTrigger.create({
      trigger: fig,
      start: 'top 65%',
      once: true,
      onEnter: () => gsap.to(state, { p: 1, duration: 3.4, ease: 'power1.inOut', onUpdate: () => set(state.p) }),
    });
  }, { scope: ref });

  return (
    <figure className="road" ref={ref}
      aria-label={L('Gambar jalan berkelok dari titik awal ke logo Kopi Padu Rasa: belajar, bersama, berdampak.', 'A winding road from the starting point to the Kopi Padu Rasa logo: learn, together, impact.')}>
      <svg viewBox="0 0 560 520" aria-hidden="true">
        <path className="road__base road__path" d={ROAD} />
        <path className="road__line" d={ROAD} />
        <path className="road__trail" pathLength="1" d={ROAD} />
        <g className="road__start" transform="translate(48 470)">
          <circle r="13" />
          <text className="road__label" x="-6" y="44"><T id="Titik awal" en="Starting point" /></text>
        </g>
        {MILESTONES.map((m) => (
          <g className="ms" data-at={m.at} key={m.n}>
            <g className="ms__pop"><circle className="ms__dot" r="20" /><text className="ms__num" y="6.5" textAnchor="middle">{m.n}</text></g>
            <text className="road__label" x={m.x} y={m.y} textAnchor={m.anchor}><T id={m.id} en={m.en} /></text>
          </g>
        ))}
        <g className="road__end" transform="translate(500 58)">
          <circle r="46" />
          <image href="/img/logo-mark.svg" x="-28" y="-29" width="56" height="58" />
        </g>
        <g className="road__traveler" transform="translate(48 470)"><circle r="11" /></g>
      </svg>
    </figure>
  );
}

const VALUES = [
  {
    n: 1, label: ['Belajar', 'Learn'],
    h: ['Tidak semua orang memulai perjalanan karier dengan pengalaman.', 'Not everyone starts their career with experience.'],
    p: [
      ['Di Kopi Padu Rasa, kamu akan memiliki kesempatan untuk mempelajari hal baru, memahami proses kerja, mengembangkan kemampuan, serta mendapatkan pengalaman secara langsung melalui pekerjaan sehari-hari.',
        "At Kopi Padu Rasa, you'll have the chance to learn new things, understand how the work gets done, develop your skills, and gain hands-on experience through everyday work."],
      ['Kami ingin setiap anggota tim dapat terus meningkatkan kemampuan dan mengambil tanggung jawab yang lebih besar seiring dengan perkembangan mereka.',
        'We want every team member to keep improving their skills and take on greater responsibility as they grow.'],
      ['Setiap proses, tantangan, dan pengalaman menjadi bagian dari perjalanan untuk menjadi lebih baik.',
        'Every process, challenge, and experience is part of the journey to becoming better.'],
    ],
  },
  {
    n: 2, label: ['Bersama', 'Together'],
    h: ['Kami percaya bahwa hasil terbaik lahir dari kerja sama.', 'We believe the best results come from working together.'],
    p: [
      ['Di sini, setiap orang memiliki peran untuk saling membantu, bertukar gagasan, belajar dari satu sama lain, dan bergerak menuju tujuan yang sama.',
        'Here, everyone has a role in helping one another, exchanging ideas, learning from each other, and moving toward the same goal.'],
    ],
  },
  {
    n: 3, label: ['Berdampak', 'Impact'],
    h: ['Setiap pekerjaan memiliki dampak.', 'Every job makes an impact.'],
    p: [
      ['Baik kamu bekerja di toko, kantor, operasional, kreatif, pemasaran, maupun bagian lainnya, kontribusimu menjadi bagian dari pengalaman yang diterima oleh setiap Kawan Padu.',
        'Whether you work in our stores, the office, operations, creative, marketing, or any other team, your contribution becomes part of the experience every Kawan Padu receives.'],
    ],
  },
];

export default function KarirPage() {
  const ref = useRef(null);
  useReveal(ref);
  useDocTitle('Karir · Kopi Padu Rasa', 'Careers · Kopi Padu Rasa');

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero page-hero--karir" aria-labelledby="karirTitle">
        <div className="container split">
          <div>
            <p className="kicker"><T id="Karir" en="Careers" /></p>
            <h1 className="page-title" id="karirTitle"><T id="Setiap perjalanan memiliki titik awal." en="Every journey has a starting point." /></h1>
            <p className="page-lead">
              <T id="Di Kopi Padu Rasa, kami percaya bahwa kemampuan tidak hanya dibentuk dari pengalaman, tetapi juga dari kemauan untuk belajar, berkembang, dan memberikan yang terbaik."
                en="At Kopi Padu Rasa, we believe ability is shaped not only by experience, but also by the willingness to learn, grow, and give your best." />
            </p>
            <p className="page-lead">
              <T id="Kami membuka kesempatan bagi siapa pun yang ingin bertumbuh bersama kami. Baik kamu sedang memulai perjalanan karier, mencari pengalaman pertama, maupun ingin melanjutkan pengalaman yang telah dimiliki, selalu ada ruang untuk belajar dan berkembang di Kopi Padu Rasa."
                en="We open opportunities for anyone who wants to grow with us. Whether you're just starting your career, looking for your first experience, or ready to build on the experience you already have, there's always room to learn and grow at Kopi Padu Rasa." />
            </p>
          </div>
          <Road />
        </div>
      </section>

      <section className="section" aria-labelledby="growTitle">
        <div className="container grow__inner">
          <div className="grow__text" data-reveal>
            <h2 className="h2" id="growTitle"><T id="Bertumbuh Bersama, Memberikan Dampak Bersama" en="Growing Together, Making an Impact Together" /></h2>
            <p><T id="Kopi Padu Rasa terus berkembang bersama orang-orang yang ada di dalamnya." en="Kopi Padu Rasa keeps growing together with the people in it." /></p>
            <p><T id="Kami percaya bahwa setiap individu memiliki potensi yang dapat berkembang ketika diberikan kesempatan, lingkungan yang mendukung, serta ruang untuk mencoba dan belajar."
              en="We believe every individual has potential that can grow when given the opportunity, a supportive environment, and room to try and learn." /></p>
            <p><T id="Karena itu, kami tidak hanya mencari seseorang yang sudah memiliki pengalaman panjang. Kami juga mencari individu yang memiliki rasa ingin tahu, semangat belajar, tanggung jawab, dan kemauan untuk terus berkembang."
              en="That's why we're not only looking for people with long experience. We're also looking for individuals with curiosity, eagerness to learn, responsibility, and the will to keep growing." /></p>
          </div>
          <blockquote className="quote" data-reveal>
            <p><T id="Bagi kami, perjalanan karier bukan hanya tentang apa yang sudah kamu kuasai hari ini, tetapi juga tentang sejauh mana kamu ingin berkembang ke depannya."
              en="For us, a career journey isn't only about what you've mastered today, but also about how far you want to grow from here." /></p>
          </blockquote>
        </div>
      </section>

      <section className="section values" aria-labelledby="valuesTitle">
        <div className="container">
          <h2 className="sr-only" id="valuesTitle"><T id="Bekerja di Kopi Padu Rasa" en="Working at Kopi Padu Rasa" /></h2>
          <div className="value-grid">
            {VALUES.map((v) => (
              <article className="value" data-reveal key={v.n}>
                <p className="value__label"><span className="value__no">{v.n}</span><span><T id={v.label[0]} en={v.label[1]} /></span></p>
                <h3><T id={v.h[0]} en={v.h[1]} /></h3>
                {v.p.map(([id, en]) => <p key={id}><T id={id} en={en} /></p>)}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="closingTitle">
        <div className="container closing__inner" data-reveal>
          <h2 className="h2" id="closingTitle"><T id="Setiap orang pernah berada di titik awal." en="Everyone has been at the starting point." /></h2>
          <p><T id="Untuk beberapa posisi, pengalaman kerja bukan menjadi syarat utama. Kami lebih menghargai kemauan untuk belajar, kedisiplinan, tanggung jawab, kemampuan bekerja sama, dan komitmen untuk berkembang."
            en="For some positions, work experience isn't the main requirement. We value the willingness to learn, discipline, responsibility, teamwork, and a commitment to growth." /></p>
          <p><T id="Jika kamu belum memiliki pengalaman tetapi memiliki semangat untuk belajar dan siap menjalani proses, kami tetap ingin mengenalmu."
            en="If you don't have experience yet but you're eager to learn and ready for the process, we'd still love to get to know you." /></p>
          <p><T id="Karena pengalaman dapat dibangun, dan kemampuan dapat terus dikembangkan." en="Because experience can be built, and skills can keep growing." /></p>
          <p className="closing__last"><T id="Yang terpenting adalah kemauan untuk memulai." en="What matters most is the willingness to start." /></p>
          <a className="btn btn--wa btn--lg" href={WA_KARIR} target="_blank" rel="noopener">
            <IconWa />WhatsApp 0823 4614 5331
          </a>
        </div>
      </section>
    </main>
  );
}
