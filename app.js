const { useEffect, useLayoutEffect, useRef, useState } = React;

// Splits a heading into masked words so GSAP can slide them up one by one.
function SplitWords({ text }) {
  const words = text.split(' ');
  return words.map((word, index) => (
    <React.Fragment key={`${word}-${index}`}>
      <span className="word-mask"><span className="word">{word}</span></span>
      {index < words.length - 1 ? ' ' : null}
    </React.Fragment>
  ));
}

// All site motion lives here (GSAP + ScrollTrigger). If GSAP fails to load,
// or the visitor prefers reduced motion, the page simply stays static.
function useSiteAnimations() {
  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ease = 'power3.out';
      const clear = 'transform,opacity,visibility';
      const onScroll = (trigger, start = 'top 88%') => ({ trigger, start, once: true });

      // Page load: header drops in, hero headline reveals word by word
      gsap.timeline({ defaults: { ease } })
        .from('.site-header', { yPercent: -100, opacity: 0, duration: 0.8, clearProps: clear })
        .from('.hero h1 .word', { yPercent: 115, duration: 0.95, stagger: 0.07, clearProps: clear }, '-=0.45')
        .from('.hero p', { y: 26, opacity: 0, duration: 0.8, clearProps: clear }, '-=0.55')
        .from('.hero-actions .btn', { y: 22, opacity: 0, duration: 0.65, stagger: 0.12, clearProps: clear }, '-=0.5');

      // Hero photo slider: crossfade with a slow zoom, auto plays, dots are clickable
      const slides = gsap.utils.toArray('.hero-slide');
      const dots = gsap.utils.toArray('.hero-dot');
      let slideTimer;
      const cleanups = [];
      if (slides.length > 1) {
        let current = 0;
        gsap.set(slides, { autoAlpha: 0, zIndex: 0 });
        gsap.set(slides[0], { autoAlpha: 1, zIndex: 1 });
        gsap.fromTo(slides[0], { scale: 1.12 }, { scale: 1, duration: 8, ease: 'none' });
        if (dots[0]) dots[0].classList.add('active');

        const goTo = (next) => {
          if (next === current) return;
          const from = slides[current];
          const to = slides[next];
          gsap.set(to, { zIndex: 2 });
          gsap.set(from, { zIndex: 1 });
          gsap.fromTo(to, { autoAlpha: 0 }, {
            autoAlpha: 1, duration: 1.4, ease: 'power2.inOut',
            onComplete: () => { gsap.set(from, { autoAlpha: 0 }); },
          });
          gsap.fromTo(to, { scale: 1.12 }, { scale: 1, duration: 8, ease: 'none', overwrite: 'auto' });
          dots.forEach((dot, i) => dot.classList.toggle('active', i === next));
          current = next;
        };
        const play = () => {
          window.clearInterval(slideTimer);
          slideTimer = window.setInterval(() => goTo((current + 1) % slides.length), 6000);
        };
        dots.forEach((dot, i) => {
          const handler = () => { goTo(i); play(); };
          dot.addEventListener('click', handler);
          cleanups.push(() => dot.removeEventListener('click', handler));
        });
        play();
      }

      // Thin progress bar along the top of the page
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });

      // Background glows drift slowly and swell as you scroll
      const drift = { ease: 'sine.inOut', repeat: -1, yoyo: true };
      gsap.to('.blob-1', { x: -70, y: 50, duration: 14, ...drift });
      gsap.to('.blob-2', { x: 80, y: -60, duration: 17, ...drift });
      gsap.to('.blob-3', { x: -50, y: 70, duration: 12, ...drift });
      [['.blob-1', 1.3], ['.blob-2', 1.4], ['.blob-3', 0.8]].forEach(([blob, scale]) => {
        gsap.to(blob, {
          scale, ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 1 },
        });
      });

      // Trust strip
      gsap.from('.stat-item', {
        y: 34, opacity: 0, duration: 0.8, stagger: 0.12, ease, clearProps: clear,
        scrollTrigger: onScroll('.stats', 'top 92%'),
      });
      gsap.from('.stat-icon', {
        scale: 0.5, duration: 0.9, stagger: 0.12, ease: 'back.out(1.8)', clearProps: clear,
        scrollTrigger: onScroll('.stats', 'top 92%'),
      });

      // Section intros: eyebrow, heading, copy and buttons rise in sequence
      gsap.utils
        .toArray('.section-copy, .section-header, .network-copy, .capabilities-header, .reach-header, .contact-copy, .cta-content')
        .forEach((block) => {
          gsap.from(block.children, {
            y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease, clearProps: clear,
            scrollTrigger: onScroll(block),
          });
        });
      gsap.from('.lead', {
        y: 30, opacity: 0, duration: 0.9, ease, clearProps: clear,
        scrollTrigger: onScroll('.lead', 'top 90%'),
      });

      // About image: wipes open while the photo settles from a slight zoom
      gsap.fromTo('.image-panel',
        { clipPath: 'inset(0% 0% 100% 0% round 20px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath',
          scrollTrigger: onScroll('.image-panel', 'top 85%'),
        });
      gsap.from('.panel-visual', {
        scale: 1.1, duration: 1.8, ease, clearProps: 'transform',
        scrollTrigger: onScroll('.image-panel', 'top 85%'),
      });

      // Business areas + capabilities cards
      gsap.from('.business-card', {
        y: 70, opacity: 0, scale: 0.95, duration: 1, stagger: 0.16, ease, clearProps: clear,
        scrollTrigger: onScroll('.business-grid', 'top 85%'),
      });
      gsap.from('.card-body > *', {
        y: 24, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.35, ease, clearProps: clear,
        scrollTrigger: onScroll('.business-grid', 'top 85%'),
      });
      gsap.from('.capability-card', {
        y: 70, opacity: 0, scale: 0.95, duration: 1, stagger: 0.16, ease, clearProps: clear,
        scrollTrigger: onScroll('.capability-grid', 'top 85%'),
      });

      // Network map
      gsap.from('.network-map-image', {
        opacity: 0, scale: 0.9, duration: 1.3, ease, clearProps: clear,
        scrollTrigger: onScroll('.network-map', 'top 85%'),
      });

      // Reach metrics: cards rise, numbers count up
      gsap.from('.metric-card', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease, clearProps: clear,
        scrollTrigger: onScroll('.reach-metrics', 'top 88%'),
      });
      gsap.utils.toArray('.metric-value').forEach((el) => {
        const original = el.textContent;
        const target = parseFloat(original.replace(/,/g, ''));
        if (Number.isNaN(target)) return;
        const suffix = original.replace(/[0-9.,]/g, '');
        const counter = { value: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(counter, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: onScroll(el, 'top 92%'),
          onUpdate: () => { el.textContent = `${Math.round(counter.value).toLocaleString('en-US')}${suffix}`; },
          onComplete: () => { el.textContent = original; },
        });
      });

      // Partner logos
      gsap.from('.partner-item', {
        y: 24, opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.07, ease, clearProps: clear,
        scrollTrigger: onScroll('.partner-list', 'top 90%'),
      });

      // Leadership cards: rise in, photo eases out of a slight zoom inside the card
      gsap.from('.founder-card', {
        y: 80, opacity: 0, duration: 1, stagger: 0.18, ease, clearProps: clear,
        scrollTrigger: onScroll('.partnership-grid', 'top 85%'),
      });
      gsap.from('.founder-photo', {
        scale: 1.15, duration: 1.6, stagger: 0.18, ease, clearProps: 'transform',
        scrollTrigger: onScroll('.partnership-grid', 'top 85%'),
      });

      // Gallery photos rise in one after another
      gsap.from('.gallery-item', {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease, clearProps: clear,
        scrollTrigger: onScroll('.gallery-grid', 'top 85%'),
      });

      // Contact form fields
      gsap.from('.contact-form .field, .contact-form .submit-btn', {
        y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease, clearProps: clear,
        scrollTrigger: onScroll('.contact-form', 'top 85%'),
      });

      // Footer columns
      gsap.from('.footer-grid > div', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease, clearProps: clear,
        scrollTrigger: onScroll('.site-footer', 'top 95%'),
      });

      return () => {
        window.clearInterval(slideTimer);
        cleanups.forEach((fn) => fn());
      };
    });

    // Images and fonts change the page height, so re-measure once they settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);
}

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Our Network', href: '#network' },
  { label: 'Projects', href: '#projects' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Partnership', href: '#partnership' },
  { label: 'Contact Us', href: '#contact' },
];

const stats = [
  { label: '4 Years of Experience', icon: 'calendar' },
  { label: 'Efficient Logistics', icon: 'truck' },
  { label: 'Trusted Operations', icon: 'secure' },
  { label: 'Driving Growth in Nigeria', icon: 'growth' },
];

const renderStatIcon = (icon) => {
  const icons = {
    calendar: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
        <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" />
      </svg>
    ),
    truck: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 7.5h9.5v8H3.5z" />
        <path d="M13 9.5h3l2.2 2.8V15.5H13z" />
        <circle cx="8" cy="16.5" r="1.8" />
        <circle cx="17.6" cy="16.5" r="1.8" />
      </svg>
    ),
    secure: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.8l7 2.7v5.6c0 4.1-2.3 7.5-7 10.3-4.7-2.8-7-6.2-7-10.3V6.5l7-2.7z" />
        <path d="M9.5 12.1l1.7 1.7 3.3-4.1" />
      </svg>
    ),
    growth: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 16.8L9.2 11.6L12.5 14.9L20 7.4" />
        <path d="M15.5 7.4H20V11.9" />
        <path d="M4 19.5H20" />
      </svg>
    ),
  };

  return icons[icon] || icons.calendar;
};

const CONTACT_EMAIL = 'rootflowglobal@gmail.com';
const emptyForm = { name: '', email: '', phone: '', organisation: '', country: '', message: '' };

const cities = ['Abuja', 'Jos', 'Benin', 'Calabar', 'Enugu', 'Onitsha', 'Lagos', 'Ibadan'];

const heroImages = {
  large: './workpics/Frame.png',
  smallTop: './workpics/Untitled (1)/Frame-1.png',
  smallBottom: './workpics/Untitled (1)/Frame-2.png',
};

const heroSlides = [
  './Services pic/IMG-20261107-WA0112.jpg',
  './Services pic/IMG-20261107-WA0113.jpg',
];

const businessAreas = [
  {
    title: 'Distribution of Technology Products',
    text: 'Wholesale and retail distribution of computer systems, ICT equipment, telecoms devices, peripherals and accessories to businesses and resellers.',
    image: './Services pic/IMG-20261107-WA0112.jpg',
  },
  {
    title: 'Importation and Exportation',
    text: 'Bringing laptops, desktops, tablets, phones, printers, networking and storage devices from global manufacturers into Nigeria, with clear handling from port to warehouse.',
    image: './Services pic/IMG-20261107-WA0113.jpg',
  },
  {
    title: 'Marketing and Sales of Technology Solutions',
    text: 'Marketing and selling computers, smart devices, office automation equipment, software and security systems to individuals, companies and institutions.',
    image: 'https://images.unsplash.com/photo-1622127739239-1905bbaa21b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'IT Solutions and Support',
    text: 'Supply, installation, configuration, maintenance and repair of computer systems and networking infrastructure, with technical support and systems integration.',
    image: 'https://images.unsplash.com/photo-1691435828932-911a7801adfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

const galleryPhotos = [
  { src: './gallery/01-team-with-partners.jpg', alt: 'The RootFlow team with partners at a manufacturer stand' },
  { src: './gallery/02-warehouse-forklift.jpg', alt: 'Forklift and stacked stock inside the warehouse' },
  { src: './gallery/03-solis-partner-meeting.jpg', alt: 'Meeting a manufacturing partner at an exhibition' },
  { src: './gallery/04-warehouse-stock.jpg', alt: 'Warehouse floor with palletised stock and staff' },
  { src: './gallery/05-partner-visit.jpg', alt: 'The team with visiting international partners' },
  { src: './gallery/06-warehouse-mezzanine.jpg', alt: 'Inspecting stock on the warehouse mezzanine' },
  { src: './gallery/07-trade-fair-meeting.jpg', alt: 'Discussing products with partners at a trade fair' },
  { src: './gallery/08-delivery-truck.jpg', alt: 'Delivery truck loaded with cartons for dispatch' },
];

const capabilityImages = [
  './workpics/Untitled (1)/Frame.png',
  './workpics/Untitled (1)/Frame-1.png',
  './workpics/Untitled (1)/loading-pic.png',
];

const partnerMetrics = [
  { value: '26,750+', label: 'Strategic partners' },
  { value: '7M+', label: 'sq. ft. of warehousing space' },
  { value: '117+', label: 'Brands' },
  { value: '134+', label: 'Sales Office' },
];

const partnerBrands = [
  { name: 'Shopinverse', image: './selected brand logos/shopinverse.svg' },
  { name: 'Konga', image: './selected brand logos/konga-seeklogo 1.png' },
  { name: 'Justrite', image: './selected brand logos/justrite-seeklogo.png' },
  { name: 'Jumia', image: './selected brand logos/jumia-seeklogo 1.png' },
  { name: 'Access Bank', image: './selected brand logos/access-bank-plc-seeklogo.png' },
  { name: 'cemix pro nigeria limited', image: './selected brand logos/cemix pro nigeria limited.png' },
  { name: 'Staleg mall', image: './selected brand logos/Staleg mall.jpg' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (formStatus.state !== 'idle' && formStatus.state !== 'sending') setFormStatus({ state: 'idle', message: '' });
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    if (formStatus.state === 'sending') return;

    // Hidden trap field: real visitors never fill it in, spam bots do
    if (event.target.elements._honey && event.target.elements._honey.value) return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormStatus({ state: 'error', message: 'Please fill in your name, email address and message.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormStatus({ state: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setFormStatus({ state: 'sending', message: '' });
    try {
      const fields = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organisation: form.organisation.trim(),
        country: form.country.trim(),
        message: form.message.trim(),
      };
      const request = fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...fields,
          _subject: `New website enquiry from ${fields.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const response = await request;
      const result = await response.json().catch(() => ({}));
      if (response.ok && (result.success === true || result.success === 'true')) {
        setForm(emptyForm);
        setFormStatus({ state: 'sent', message: 'Thank you. Your message has been sent and we will get back to you shortly.' });
      } else {
        throw new Error(result.message || 'Request failed');
      }
    } catch (error) {
      setFormStatus({
        state: 'error',
        message: `Sorry, your message could not be sent. Please try again, or email us directly at ${CONTACT_EMAIL}.`,
      });
    }
  };
  const menuRef = useRef(null);
  const topRef = useRef(null);

  useSiteAnimations();

  useEffect(() => {
    if (lightbox === null) return undefined;
    const total = galleryPhotos.length;
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') setLightbox((i) => (i + 1) % total);
      if (event.key === 'ArrowLeft') setLightbox((i) => (i - 1 + total) % total);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [lightbox]);

  useEffect(() => {
    const onScroll = () => {
      if (topRef.current) topRef.current.classList.toggle('visible', window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" type="button" aria-label="Close photo viewer" onClick={() => setLightbox(null)}>&times;</button>
          <button className="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + galleryPhotos.length) % galleryPhotos.length); }}>&#8249;</button>
          <img className="lightbox-image" src={galleryPhotos[lightbox].src} alt={galleryPhotos[lightbox].alt} onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % galleryPhotos.length); }}>&#8250;</button>
          <span className="lightbox-count">{lightbox + 1} / {galleryPhotos.length}</span>
        </div>
      )}
      <a className="enquiry-fab" href="#contact" aria-label="Send an enquiry">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></svg>
        <span>Enquiry</span>
      </a>
      <button className="to-top" type="button" aria-label="Back to top" ref={topRef} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
      <header className="site-header">
        <div className="container nav-wrap" ref={menuRef}>
          <div className="brand" aria-label="RootFlow logo">
            <img className="brand-logo" src="./founders/IMG-20261106-WA0039 1.png" alt="RootFlow logo" />
          </div>

          <nav className={`main-nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation" id="primary-nav">
            {navItems.map(({ label, href }) => (
              <a key={label} href={href} onClick={closeMenu}>{label}</a>
            ))}
          </nav>

          <button className="nav-cta" type="button">Contact Us</button>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-slides" aria-hidden="true">
            {heroSlides.map((image) => (
              <div key={image} className="hero-slide" style={{ backgroundImage: `url('${image}')` }} />
            ))}
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1><SplitWords text="Connecting Global Manufacturers to Nigeria's Markets." /></h1>
                <h5>RootFlow Global limited is a distribution marketing company with one of the top 3 largest distribution network in Nigeria. It is fully registered and incorporated under the Corporate Affairs Commission(CAC) with RC 9991792</h5>
              <p>
                We help international brands and local distributors move products efficiently across Nigeria, combining operational expertise with local market knowledge.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#services">Explore Our Services</a>
                <a className="btn btn-secondary" href="#partnership">Become a Partner</a>
              </div>
            </div>
            <div className="hero-dots" role="tablist" aria-label="Hero slides">
              {heroSlides.map((image, index) => (
                <button key={image} className="hero-dot" type="button" aria-label={`Show slide ${index + 1}`} data-slide={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="stats container" aria-label="Company strengths">
          {stats.map(({ label, icon }) => (
            <div className="stat-item" key={label}>
              <div className="stat-icon" data-icon={icon} aria-hidden="true">
                {renderStatIcon(icon)}
              </div>
              <div className="stat-text">{label}</div>
            </div>
          ))}
        </section>

        <section className="section about-section container" id="about">
          <div className="section-copy">
            <span className="eyebrow">About Our Company</span>
            <h2>A Reliable Distribution Partner in Nigeria</h2>
            <p>We import, distribute and sell technology products and provide IT solutions across Nigeria, combining operational expertise with local market knowledge.</p>
            <p>Four years of experience distributing technology products across Nigeria, from computers and electronic devices to ICT and telecommunications equipment.</p>
            <div className="section-actions">
              <a className="btn btn-primary" href="#services">Explore Our Services</a>
            </div>
          </div>

          <div className="image-panel">
            <div className="panel-visual" aria-label="Illustrative warehouse photography" style={{ backgroundImage: `url('./Services pic/about.jpg')` }} />
          </div>
        </section>

        <section className="section business-section container" id="services">
          <div className="section-header">
            <span className="eyebrow">Our Business Areas</span>
            <h2>Our Business Areas</h2>
          </div>
          <p className="lead">We import, distribute, market and sell technology products, and back them with practical IT solutions and support.</p>

          <div className="business-grid">
            {businessAreas.map(({ title, text, image }) => (
              <article key={title} className="business-card">
                <div className="card-media" style={{ backgroundImage: `url('${image}')` }} />
                <div className="card-shade" />
                <div className="card-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a className="card-link" href="#contact">Enquire <span aria-hidden="true">&rarr;</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section network-section container" id="network">
          <div className="network-copy">
            <span className="eyebrow">Distribution Network</span>
            <h2>Our Nationwide Distribution Network</h2>
            <p>We operate approximately 32 warehouses and support distribution across eight strategic cities: Abuja, Jos, Benin City, Calabar, Enugu, Onitsha, Lagos and Ibadan.</p>
          </div>
          <div className="network-map" aria-label="RootFlow distribution network map">
            <img
              src="./workpics/file_jfj.png"
              alt="RootFlow distribution network map"
              className="network-map-image"
            />
            {cities.map((city, index) => (
              <div key={city} className={`city city-${index + 1}`}>{city}</div>
            ))}
          </div>
        </section>

        <section className="section capabilities container" id="projects">
          <div className="capabilities-header">
            <span className="eyebrow">Infrastructure and Capabilities</span>
            <h2>Infrastructure and Capabilities</h2>
            <p>We support logistics, warehousing, storage and nationwide distribution with a focus on operational reliability and local market reach.</p>
          </div>

          <div className="capability-grid">
            {capabilityImages.map((image, index) => (
              <article key={image} className="capability-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(9,18,26,.1), rgba(9,18,26,.1)), url('${image}')` }}>
                <div className={`mini-visual mini-${index + 1}`} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="section reach-section container" aria-label="Company statistics and partner brands">
          <div className="reach-header">
            <span className="eyebrow">Our Reach</span>
            <h2>Built for scale, trusted by brands and communities.</h2>
          </div>

          <div className="reach-metrics">
            {partnerMetrics.map(({ value, label }) => (
              <div key={label} className="metric-card">
                <span className="metric-value">{value}</span>
                <span className="metric-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="partner-strip">
            <div className="partner-strip-header">
              <span className="eyebrow">Selected partners</span>
            </div>

            <div className="partner-list">
              {partnerBrands.map(({ name, image }) => (
                <div key={name} className="partner-item" aria-label={name}>
                  <div className="partner-logo-wrap">
                    <div className="partner-logo">
                      <img src={image} alt={name} className="partner-logo-image" />
                    </div>
                    <span className="partner-name">{name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section gallery-section container" id="gallery">
          <div className="section-header">
            <span className="eyebrow">Gallery</span>
            <h2>A Look Inside Our Operations</h2>
          </div>
          <p className="lead">Moments from our warehouse, our deliveries and the manufacturers and partners we work with.</p>

          <div className={`gallery-wrap ${galleryOpen ? 'open' : ''}`}>
            <div className="gallery-grid">
              {galleryPhotos.map(({ src, alt }, index) => (
                <button
                  key={src}
                  className="gallery-item"
                  type="button"
                  tabIndex={galleryOpen || index < 4 ? 0 : -1}
                  aria-label={`Open photo ${index + 1}: ${alt}`}
                  onClick={() => setLightbox(index)}
                >
                  <img src={src} alt={alt} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
            <div className="gallery-fade" aria-hidden={galleryOpen}>
              <button
                className="btn btn-primary gallery-more"
                type="button"
                onClick={() => {
                  setGalleryOpen(true);
                  window.setTimeout(() => window.ScrollTrigger && window.ScrollTrigger.refresh(), 1300);
                }}
              >
                View full gallery
              </button>
            </div>
          </div>
          {galleryOpen && (
            <div className="gallery-less">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setGalleryOpen(false);
                  const section = document.getElementById('gallery');
                  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  window.setTimeout(() => window.ScrollTrigger && window.ScrollTrigger.refresh(), 1300);
                }}
              >
                Show less
              </button>
            </div>
          )}
        </section>

        <section className="section partnership-section container" id="partnership">
          <div className="section-header">
            <span className="eyebrow">Our Team</span>
            <h2>Leadership</h2>
          </div>

          <div className="partnership-grid">
            <article className="partnership-card founder-card">
              <img className="founder-photo founder-photo-1" src="./founders/IMG-20261106-WA0036.jpg" alt="Igba Matthew Alexander" />
              <div className="founder-copy">
                <h3>Igba Matthew Alexander</h3>
                <p>Co-founder, Managing Director RootFlow Global Limited</p>
              </div>
            </article>
            <article className="partnership-card founder-card">
              <img className="founder-photo founder-photo-2" src="./founders/IMG-20261106-WA0037.jpg" alt="Daniel Oluwatobiloba Olusade" />
              <div className="founder-copy">
                <h3>Daniel Oluwatobiloba Olusade</h3>
                <p>Co-founder, Chairman, Board of Directors, RootFlow Global Limited</p>
              </div>
            </article>
            <article className="partnership-card founder-card">
              <img className="founder-photo founder-photo-3" src="./founders/IMG-20261107-WA0074.jpg" alt="Ekoh Ofure Jane" />
              <div className="founder-copy">
                <h3>Ekoh Ofure Jane</h3>
                <p>Chief Financial Officer, RootFlow Global Limited</p>
              </div>
            </article>
          </div>
        </section>

        <section className="contact-section container" id="contact">
          <div className="contact-copy">
            <span className="eyebrow">Contact Us</span>
            <h2>Fill up your details and we will get back to you</h2>
          </div>

          <form className="contact-form" onSubmit={submitEnquiry} noValidate>
            <div className="field"><input type="text" name="name" placeholder="Full name" aria-label="Full name" autoComplete="name" required value={form.name} onChange={updateField} /></div>
            <div className="field"><input type="email" name="email" placeholder="Email address" aria-label="Email address" autoComplete="email" required value={form.email} onChange={updateField} /></div>
            <div className="field"><input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" autoComplete="tel" value={form.phone} onChange={updateField} /></div>
            <div className="field"><input type="text" name="organisation" placeholder="Organisation/company" aria-label="Organisation or company" autoComplete="organization" value={form.organisation} onChange={updateField} /></div>
            <div className="field"><input type="text" name="country" placeholder="Country" aria-label="Country" autoComplete="country-name" value={form.country} onChange={updateField} /></div>
            <div className="field textarea-field"><textarea name="message" placeholder="Message" aria-label="Message" required value={form.message} onChange={updateField} /></div>
            <input className="hp-field" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button type="submit" className="btn btn-primary submit-btn" disabled={formStatus.state === 'sending'}>
              {formStatus.state === 'sending' ? 'Sending...' : 'Submit'}
            </button>
            <p className={`form-status ${formStatus.state}`} role="status" aria-live="polite">{formStatus.message}</p>
          </form>
        </section>

        <section className="cta-banner container" aria-label="Partner with us">
          <div className="cta-content">
            <span className="eyebrow">Partner with Us</span>
            <h2>Partner with Us</h2>
            <p>For manufacturers, suppliers and local distribution partners.</p>
            <a href="#contact" className="btn btn-primary">Submit Request</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <svg className="footer-art" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="footer-lines" fill="none" strokeWidth="1.2">
            <path d="M-60 430 L380 40" />
            <path d="M80 560 L640 -30" />
            <path d="M380 560 L1000 -40" />
            <path d="M720 560 L1280 10" />
            <path d="M-60 250 L220 -40" />
            <path d="M980 560 L1300 230" />
          </g>
          <g className="footer-routes" fill="none" strokeWidth="2" strokeLinecap="round">
            <path className="route route-1" pathLength="600" d="M-60 430 L380 40" />
            <path className="route route-2" pathLength="600" d="M80 560 L640 -30" />
            <path className="route route-3" pathLength="600" d="M380 560 L1000 -40" />
            <path className="route route-4" pathLength="600" d="M720 560 L1280 10" />
          </g>
          <g className="footer-nodes">
            <circle className="node node-1" cx="232" cy="171" r="3.5" />
            <circle className="node node-2" cx="470" cy="165" r="3.5" />
            <circle className="node node-3" cx="760" cy="215" r="3.5" />
            <circle className="node node-4" cx="1000" cy="260" r="3.5" />
            <circle className="node node-5" cx="560" cy="430" r="3.5" />
          </g>
        </svg>
        <div className="container footer-grid">
          <div className="footer-branding">
            <div className="brand">RootFlow</div>
            <p>Connecting international manufacturers and local distributors to Nigeria’s markets.</p>
          </div>

          <div className="footer-links">
            <h3>Quick navigation</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About our company</a></li>
              <li><a href="#services">Business areas</a></li>
              <li><a href="#network">Distribution network</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Business enquiries</h3>
            <ul>
              <li><a href="#partnership">Become a partner</a></li>
              <li><a href="#contact">Manufacturer enquiries</a></li>
              <li><a href="#contact">Local distribution enquiries</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Contact details</h3>
            <ul>
              <li>Email: rootflowglobal@gmail.com</li>
              <li>Phone: 08130202741,08168515366</li>
              <li>Address: 
<br/>
Lagos Office: Block B, Lofty Heights Office complex, Baderinwa Alabi St, Lekki Phase I, Lekki 106104, Lagos
              <br/> 
              <br/> 
              Abuja Office: Office Complex 078, Wuye Ultra Modern Market, Utako, Abuja,Port harcourt</li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} RootFlow Global Limited. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
