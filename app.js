const { useEffect, useRef, useState } = React;

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Our Network', href: '#network' },
  { label: 'Projects', href: '#projects' },
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

const cities = ['Abuja', 'Jos', 'Benin', 'Calabar', 'Enugu', 'Onitsha', 'Lagos', 'Ibadan'];

const heroImages = {
  large: './workpics/Frame.png',
  smallTop: './workpics/Untitled (1)/Frame-1.png',
  smallBottom: './workpics/Untitled (1)/Frame-2.png',
};

const businessImages = [
  './Services pic/IMG-20261107-WA0111.jpg',
  './Services pic/IMG-20261107-WA0112.jpg',
  './Services pic/IMG-20261107-WA0113.jpg',
];

const capabilityImages = [
  './workpics/Untitled (1)/Frame.png',
  './workpics/Untitled (1)/Frame-1.png',
  './workpics/Untitled (1)/Frame-2.png',
];

const partnerMetrics = [
  { value: '26,750+', label: 'Strategic partners' },
  { value: '7M+', label: 'sq. ft. of warehousing space' },
  { value: '117', label: 'sales offices' },
  { value: '32', label: 'operational warehouses' },
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
  const menuRef = useRef(null);

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
        <section className="hero container" id="home">
          <div className="hero-copy">
            <h1>Connecting Global Manufacturers to Nigeria&apos;s Markets.</h1>
            <p>
              We help international brands and local distributors move products efficiently across Nigeria, combining operational expertise with local market knowledge.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#services">Explore Our Services</a>
              <a className="btn btn-secondary" href="#partnership">Become a Partner</a>
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
            <p>We distribute a wide range of products across Nigeria, combining operational expertise with local market knowledge.</p>
            <p>Four years of experience distributing pharmaceuticals, technology and construction products across Nigeria.</p>
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
          <p className="lead">We support three core business areas across pharmaceuticals, technology and construction products distribution.</p>

          <div className="business-grid">
            {businessImages.map((image, index) => (
              <article key={image} className={`business-card ${index === 1 ? 'tall' : ''}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 25, 35, 0.14), rgba(15, 25, 35, 0.14)), url('${image}')` }}>
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
              src="./workpics/1793966216350 1.png"
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

        <section className="section partnership-section container" id="partnership">
          <div className="section-header">
            <span className="eyebrow">Our Team</span>
            <h2>Leadership</h2>
          </div>

          <div className="partnership-grid">
            <article className="partnership-card founder-card">
              <div className="founder-photo founder-photo-1" style={{ backgroundImage: `url('./founders/IMG-20261106-WA0036.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }} />
              <div className="founder-copy">
                <h3>Igba Matthew Alexander</h3>
                <p>Co-founder, Managing Director RootFlow Global Limited</p>
              </div>
            </article>
            <article className="partnership-card founder-card">
              <div className="founder-photo founder-photo-2" style={{ backgroundImage: `url('./founders/IMG-20261106-WA0037.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }} />
              <div className="founder-copy">
                <h3>Daniel Oluwatobiloba Olusade</h3>
                <p>Co-founder, Chairman, Board of Directors, RootFlow Global Limited</p>
              </div>
            </article>
            <article className="partnership-card founder-card">
              <div className="founder-photo founder-photo-3" style={{ backgroundImage: `url('./founders/IMG-20261107-WA0074.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }} />
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

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field"><input type="text" placeholder="Full name" /></div>
            <div className="field"><input type="email" placeholder="Email address" /></div>
            <div className="field"><input type="tel" placeholder="Phone number" /></div>
            <div className="field"><input type="text" placeholder="Organisation/company" /></div>
            <div className="field"><input type="text" placeholder="Country" /></div>
            <div className="field textarea-field"><textarea placeholder="Message" /></div>
            <button type="submit" className="btn btn-primary submit-btn">Submit</button>
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
              <li>[Email to be supplied]</li>
              <li>[Phone to be supplied]</li>
              <li>[Address to be supplied]</li>
              <li>Social links: [URLs to be supplied]</li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} RootFlow Global Limited. All rights reserved.</span>
          <span>Photography is illustrative; not a record of company-owned facilities.</span>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
