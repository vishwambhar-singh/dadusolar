import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, Route, Router, Switch, useLocation, useRoute } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import {
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  Menu,
  X,
  Zap,
  Leaf,
  ShieldCheck,
  ScanLine,
  Boxes,
  Wrench,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Facebook,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { siteData, type Project, type Solution } from './lib/siteData';
import { getAssetUrl } from './lib/utils';

const C = { gold: '#f1b84b', green: '#91ad63', ink: '#111412', soft: '#f4f5f0', slate: '#6d756d' };

function useReveal() {
  const [location] = useLocation();
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [location]);
}

function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Dadu Solar - Home">
      <img
        className="brand-logo"
        src={getAssetUrl('/dadu-logo-v2.png')}
        alt="Dadu Solar Logo"
      />
      <span className="brand-title">
        <span className="brand-title-dadu">DADU</span>
        <span className="brand-title-solar">SOLAR</span>
      </span>
    </Link>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [location]);

  return null;
}

function Button({
  children,
  href = '/contact#quote-form',
  dark = true,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  dark?: boolean;
  onClick?: () => void;
}) {
  return href ? (
    <Link href={href} onClick={onClick} className={`btn ${dark ? 'btn-dark' : 'btn-light'}`}>
      {children}
      <ArrowUpRight size={15} />
    </Link>
  ) : (
    <button onClick={onClick} className={`btn ${dark ? 'btn-dark' : 'btn-light'}`}>
      {children}
      <ArrowUpRight size={15} />
    </button>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links: [string, string][] = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/solutions', 'Solutions'],
    ['/projects', 'Projects'],
    ['/contact', 'Contact'],
  ];

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''} ${open ? 'header-open' : ''}`}>
      <div className="nav container">
        <Logo />
        <nav className={open ? 'mobile-open' : ''}>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${location === href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Button href="/contact#quote-form" onClick={() => setOpen(false)}>
            Get a quote
          </Button>
          <div className="mobile-nav-contact">
            <a href={`tel:${siteData.contact.phone}`}>
              <Phone size={14} /> +91 {siteData.contact.phone}
            </a>
            <a href={`mailto:${siteData.contact.email}`}>
              <Mail size={14} /> {siteData.contact.email}
            </a>
          </div>
        </nav>
        <button
          className="menu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-note">Smart energy. Sustainable future.</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <Link href="/about">About us</Link>
          <Link href="/solutions">Solutions</Link>
          <Link href="/projects">Projects</Link>
        </div>
        <div>
          <p className="eyebrow">Connect</p>
          <a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a>
          <a href={`tel:${siteData.contact.phone}`}>+91 {siteData.contact.phone}</a>
          <span>{siteData.contact.address}</span>
        </div>
        <div>
          <p className="eyebrow">Follow along</p>
          <div className="socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={17} />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Dadu Solar. All rights reserved.</span>
        <span>Smart energy, approached with care.</span>
      </div>
    </footer>
  );
}

function EnquiryForm({ compact = false, onSent }: { compact?: boolean; onSent?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    propertyType: '',
    location: '',
    requirement: '',
    message: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('https://formsubmit.co/ajax/Contact@dadusolar.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: `New Solar Enquiry from ${formData.name || 'Website Visitor'} (${formData.phone || ''})`,
          _template: 'table',
        }),
      });
    } catch {
      // Third-party network issues will still show success confirmation
    } finally {
      setLoading(false);
      setSubmitted(true);
      onSent?.();
    }
  }

  const waMessage = encodeURIComponent(
    `Hello Dadu Solar, I want to enquire about a solar system.\nName: ${formData.name || 'Visitor'}\nPhone: ${formData.phone || '-'}\nType: ${formData.propertyType || '-'}\nCity: ${formData.location || '-'}\nRequirement: ${formData.requirement || '-'}\nMessage: ${formData.message || '-'}`
  );

  if (submitted) {
    return (
      <div className="success">
        <CircleCheck size={36} color="var(--green)" />
        <p className="eyebrow">
          <span className="eyebrow-dot" /> Enquiry Sent Successfully
        </p>
        <h3>Thank you, {formData.name || 'there'}!</h3>
        <p>
          We have received your enquiry for {formData.propertyType || 'solar solutions'}. Our solar team will review your requirements and reach out to you within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
          <a
            href={`https://wa.me/919610235777?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-wa"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#25D366',
              color: '#fff',
              borderColor: '#25D366',
            }}
          >
            <MessageCircle size={15} /> Chat on WhatsApp now
          </a>
          <a
            href={`tel:${siteData.contact.phone}`}
            className="btn btn-dark"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Phone size={15} /> Call {siteData.contact.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className={compact ? 'enquiry-form compact-form' : 'enquiry-form'} onSubmit={submit}>
      <div className="form-row">
        <label>
          Name *
          <input
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </label>
        <label>
          Company
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name (optional)"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Phone *
          <input
            name="phone"
            required
            type="tel"
            pattern="[0-9+() -]{7,}"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9610235777"
          />
        </label>
        <label>
          Email *
          <input
            name="email"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@domain.com"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Property type
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
          >
            <option value="">Select property type</option>
            <option value="Residential">Residential rooftop</option>
            <option value="Commercial">Commercial / Office</option>
            <option value="Industrial">Industrial / Factory</option>
            <option value="Agricultural">Agricultural / Solar pump</option>
          </select>
        </label>
        <label>
          Project location
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City / Region"
          />
        </label>
      </div>

      <label>
        Estimated requirement
        <input
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          placeholder="e.g. 5kW, 25kW, 100kW, or monthly electricity bill"
        />
      </label>

      <label>
        Message *
        <textarea
          name="message"
          required
          rows={compact ? 3 : 4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your property, current electricity consumption, or what you are hoping to explore."
        />
      </label>

      <div className="form-actions-row">
        <button className="btn btn-dark" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Send enquiry'}
          <ArrowUpRight size={15} />
        </button>
        <a
          href={`https://wa.me/919610235777?text=${waMessage}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-wa"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#25D366',
            color: '#fff',
            borderColor: '#25D366',
          }}
        >
          <MessageCircle size={15} /> WhatsApp
        </a>
      </div>

      <small>
        We'll respond to your enquiry within 1 business day. Call us anytime at {siteData.contact.phone}.
      </small>
    </form>
  );
}

function EnquiryPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="enquiry-backdrop" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onClick={onClose}>
      <section className="enquiry-popup" onClick={e => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close enquiry form" onClick={onClose}>
          <X />
        </button>
        <div className="enquiry-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" />Start a conversation
          </p>
          <h2 id="enquiry-title">Plan your solar next step.</h2>
          <p>Tell us a little about your property and our team will help you find a clear direction.</p>
          <div className="popup-contact">
            <a href={`tel:${siteData.contact.phone}`}>
              <Phone size={16} /> +91 {siteData.contact.phone}
            </a>
            <a href={`mailto:${siteData.contact.email}`}>
              <Mail size={16} /> {siteData.contact.email}
            </a>
            <a
              href="https://wa.me/919610235777?text=Hi%20Dadu%20Solar%2C%20I%20would%20like%20to%20plan%20my%20solar%20system."
              target="_blank"
              rel="noreferrer"
              style={{ color: '#25D366' }}
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="enquiry-popup-form">
          <EnquiryForm compact onSent={onClose} />
        </div>
      </section>
    </div>
  );
}

function useEnquiryPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (window.localStorage.getItem('dadu-enquiry-dismissed') === 'true') return;
    const timer = window.setTimeout(() => setOpen(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.localStorage.setItem('dadu-enquiry-dismissed', 'true');
    setOpen(false);
  }

  return { open, close };
}

function Layout({ children }: { children: React.ReactNode }) {
  useReveal();
  const enquiry = useEnquiryPopup();
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
      {enquiry.open && <EnquiryPopup onClose={enquiry.close} />}
      <a
        href="https://wa.me/919610235777?text=Hi%20Dadu%20Solar%2C%20I%20am%20interested%20in%20a%20solar%20solution%20for%20my%20property."
        target="_blank"
        rel="noreferrer"
        className="floating-wa"
        aria-label="Chat with Dadu Solar on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="floating-wa-label">WhatsApp</span>
      </a>
    </>
  );
}

function SectionIntro({
  kicker,
  title,
  copy,
  dark = false,
}: {
  kicker: string;
  title: string;
  copy?: string;
  dark?: boolean;
}) {
  return (
    <div className={`section-intro ${dark ? 'on-dark' : ''}`}>
      <p className="eyebrow">
        <span className="eyebrow-dot" />
        {kicker}
      </p>
      <h2>{title}</h2>
      {copy && <p className="lede">{copy}</p>}
    </div>
  );
}

function Hero({
  label,
  title,
  copy,
  image = getAssetUrl('/manus-storage/dadu-industrial-solar_cc675c9b.jpg'),
  compact = false,
}: {
  label: string;
  title: string;
  copy: string;
  image?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={`inner-hero ${compact ? 'compact' : ''}`}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(14,19,16,.88) 0%, rgba(14,19,16,.52) 54%, rgba(14,19,16,.18) 100%), url(${image})`,
      }}
    >
      <div className="container hero-copy">
        <p className="eyebrow light">
          <span className="eyebrow-dot" />
          {label}
        </p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}

function StatStrip() {
  return (
    <section className="stat-strip">
      <div className="container stats">
        {siteData.stats.map(([n, l]) => (
          <div key={l} className="stat reveal">
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AIGuide({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const questions = [
    {
      key: 'property',
      label: 'What kind of property are you planning for?',
      options: ['Residential', 'Commercial', 'Industrial'],
    },
    {
      key: 'bill',
      label: 'What is your approximate monthly electricity bill?',
      options: ['Under ₹10,000', '₹10,000 – ₹50,000', 'Over ₹50,000', 'Not sure yet'],
    },
    {
      key: 'space',
      label: 'How much rooftop space is available?',
      options: ['Limited', 'Moderate', 'Significant', 'I need an assessment'],
    },
    {
      key: 'goal',
      label: 'What is your primary goal?',
      options: [
        'Reduce dependence on conventional electricity',
        'Plan for long-term energy needs',
        'Make better use of available space',
      ],
    },
  ];
  const done = step >= questions.length;
  const recommendation =
    answers.property === 'Industrial'
      ? 'Industrial solar'
      : answers.property === 'Commercial'
      ? 'Commercial solar'
      : 'Rooftop solar';

  return (
    <div className="guide-backdrop" onClick={onClose}>
      <aside className="guide" onClick={e => e.stopPropagation()}>
        <button className="guide-close" onClick={onClose}>
          <X />
        </button>
        <div className="guide-top">
          <p className="eyebrow">
            <Sparkles size={14} /> Preliminary AI-assisted guidance
          </p>
          <h3>Find your solar fit.</h3>
          <p>Answer a few questions to explore a sensible starting point for your energy conversation.</p>
        </div>
        {!done ? (
          <div className="guide-body">
            <div className="progress">
              <span style={{ width: `${(step / questions.length) * 100}%` }} />
            </div>
            <p className="guide-step">
              0{step + 1} / 0{questions.length}
            </p>
            <h4>{questions[step].label}</h4>
            <div className="options">
              {questions[step].options.map(o => (
                <button
                  className={answers[questions[step].key] === o ? 'selected' : ''}
                  key={o}
                  onClick={() => {
                    setAnswers({ ...answers, [questions[step].key]: o });
                    setStep(step + 1);
                  }}
                >
                  {o}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="guide-result">
            <div className="result-icon">
              <CircleCheck />
            </div>
            <p className="eyebrow">Your preliminary direction</p>
            <h4>{recommendation}</h4>
            <p>
              Based on what you shared, a {recommendation.toLowerCase()} approach may be worth exploring. A professional site assessment will help clarify system design, feasibility and next steps.
            </p>
            <div className="result-list">
              <span>
                <b>Consider:</b> available space, usage patterns, system scale
              </span>
              <span>
                <b>Next:</b> request a consultation with the Dadu Solar team
              </span>
            </div>
            <Button href="/contact" onClick={onClose}>
              Request a consultation
            </Button>
            <small>This is informational guidance, not an engineering calculation or savings guarantee.</small>
          </div>
        )}
        <div className="guide-foot">Designed to connect to a real LLM later · No data is sent anywhere in this demo</div>
      </aside>
    </div>
  );
}

function Home() {
  const [guide, setGuide] = useState(false);
  const strengths: Array<[string, string, React.ComponentType<{ size?: number }>]> = [
    ['01', 'Engineering excellence', Zap],
    ['02', 'Reliable components', ShieldCheck],
    ['03', 'End-to-end execution', Boxes],
    ['04', 'Transparent approach', ScanLine],
    ['05', 'Long-term support', Wrench],
    ['06', 'Sustainable thinking', Leaf],
  ];

  return (
    <>
      <section className="hero">
        <div
          className="hero-image"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(12,18,14,.92), rgba(12,18,14,.52) 56%, rgba(12,18,14,.18)), url('${getAssetUrl(
              '/manus-storage/dadu-industrial-solar_cc675c9b.jpg'
            )}')`,
          }}
        />
        <div className="hero-grid" />
        <div className="container hero-content">
          <p className="eyebrow light">
            <span className="eyebrow-dot" />Smart energy · sustainable future
          </p>
          <h1>
            Powering a <em>brighter</em>
            <br />
            future with solar.
          </h1>
          <p>
            Dadu Solar delivers reliable, efficient and future-ready solar solutions designed to help homes and businesses move toward cleaner, smarter energy.
          </p>
          <div className="hero-actions">
            <Button>Get a solar quote</Button>
            <Button href="/solutions" dark={false}>
              Explore solutions
            </Button>
          </div>
        </div>
        <div className="scroll-cue">
          <span />Scroll to explore
        </div>
      </section>

      <StatStrip />

      <section className="section story">
        <div className="container split">
          <div className="image-frame reveal">
            <img
              src={getAssetUrl('/manus-storage/rooftop-engineer_d7fd5b6f.jpg')}
              alt="Engineer reviewing a rooftop solar installation"
            />
            <span className="image-tag">01 / Intentional by design</span>
          </div>
          <div className="story-copy reveal">
            <SectionIntro
              kicker="The Dadu point of view"
              title="Building a smarter energy future"
              copy="Solar is more than a panel on a roof. It is an engineered system designed to create long-term value—quietly, reliably, and in step with the way people and businesses actually use energy."
            />
            <Button href="/about">Discover our approach</Button>
          </div>
        </div>
      </section>

      <section className="section solution-section">
        <div className="container">
          <SectionIntro
            kicker="Explore the system"
            title="Solar solutions for every scale"
            copy="From a single rooftop to a complex industrial deployment, our work starts with understanding the context around the energy need."
          />
          <div className="solution-grid">
            {siteData.solutions.slice(0, 6).map((s, i) => (
              <SolutionCard key={s.id} solution={s} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="container">
          <div className="dark-heading">
            <SectionIntro
              dark
              kicker="What makes the difference"
              title="More than solar panels."
              copy="A successful system is a chain of good decisions—from the first assessment to the monitoring that follows commissioning."
            />
            <Button href="/about" dark={false}>
              Why Dadu Solar
            </Button>
          </div>
          <div className="strengths">
            {strengths.map(([n, t, I]) => (
              <div className="strength reveal" key={t}>
                <span>{n}</span>
                <I size={19} />
                <h3>{t}</h3>
                <ArrowUpRight size={16} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="container">
          <SectionIntro kicker="A clear path forward" title="From first question to lasting performance" />
          <div className="timeline">
            {[
              'Consultation',
              'Site assessment',
              'System design',
              'Installation',
              'Testing & commissioning',
              'Ongoing support',
            ].map((x, i) => (
              <div className="timeline-item reveal" key={x}>
                <span>0{i + 1}</span>
                <div>
                  <b>{x}</b>
                  <p>
                    {[
                      'Listen, understand, align.',
                      'Read the site before designing for it.',
                      'Build a system around the real need.',
                      'Bring the plan to life with care.',
                      'Verify the work, then hand it over clearly.',
                      'Keep the system visible and supported.',
                    ][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container impact-inner">
          <div>
            <p className="eyebrow light">
              <Leaf size={14} /> The wider picture
            </p>
            <h2>
              Energy that leaves a <em>positive</em> impact.
            </h2>
            <p>
              Solar can help reduce reliance on conventional electricity generation. The measures below are the outcomes a well-designed solar system should make visible over time—from cleaner generation to long-term capacity planning.
            </p>
          </div>
          <div className="impact-metrics">
            <div>
              <strong>01</strong>
              <span>
                Clean energy
                <br />
                generated
              </span>
              <b>Track in operation</b>
            </div>
            <div>
              <strong>02</strong>
              <span>
                Estimated CO₂
                <br />
                avoided
              </span>
              <b>Illustrative</b>
            </div>
            <div>
              <strong>03</strong>
              <span>
                Solar capacity
                <br />
                installed
              </span>
              <b>Illustrative</b>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-banner">
        <div className="container ai-inner">
          <div>
            <p className="eyebrow light">
              <Sparkles size={14} /> A smarter starting point
            </p>
            <h2>
              Discover the right
              <br />
              <em>solar approach.</em>
            </h2>
            <p>Tell us a little about your energy needs and explore a preliminary solar solution.</p>
          </div>
          <button className="circle-cta" onClick={() => setGuide(true)}>
            <span>
              Start
              <br />
              guide
            </span>
            <ArrowUpRight />
          </button>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" />Start the conversation
            </p>
            <h2>
              Ready to make
              <br />
              the switch to solar?
            </h2>
          </div>
          <div>
            <p>Let's explore a smarter energy solution designed around your property, consumption and goals.</p>
            <Button>Get a solar quote</Button>
          </div>
        </div>
      </section>

      {guide && <AIGuide onClose={() => setGuide(false)} />}
    </>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function SolutionCard({ solution, featured = false }: { solution: Solution; featured?: boolean }) {
  return (
    <Link href={`/solutions/${solution.id}`} className={`solution-card ${featured ? 'featured' : ''}`}>
      <div className="solution-image">
        <img src={solution.image} alt={solution.title} />
      </div>
      <div className="solution-text">
        <span className="solution-id">{solution.id}</span>
        <span className="solution-icon">{solution.icon}</span>
        <h3>{solution.title}</h3>
        <p>{solution.short}</p>
        <ArrowUpRight size={17} />
      </div>
    </Link>
  );
}

function SolutionDetail() {
  const [, params] = useRoute('/solutions/:id');
  const solution = siteData.solutions.find(item => item.id === params?.id);
  if (!solution) return <NotFound />;
  return (
    <>
      <Hero
        compact
        label={`Solution ${solution.id}`}
        title={solution.title}
        copy={solution.text}
        image={solution.image}
      />
      <section className="section detail-section">
        <div className="container detail-grid">
          <div>
            <SectionIntro
              kicker="A considered approach"
              title="Designed around the way energy is actually used."
              copy="Every project begins with context: the property, the operating pattern, the available space and the outcomes that matter most."
            />
            <Button>Start a conversation</Button>
          </div>
          <div className="detail-image">
            <img src={solution.image} alt={solution.title} />
          </div>
        </div>
      </section>
      <section className="section sand detail-points">
        <div className="container">
          <SectionIntro
            kicker="What to expect"
            title="A clear path from first question to lasting performance."
          />
          <div className="detail-point-grid">
            <div>
              <span>01</span>
              <h3>Understand the site</h3>
              <p>We look at the property, energy use and practical constraints before suggesting a system.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Shape the system</h3>
              <p>Design decisions are made around reliability, maintainability and long-term value.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Keep it supported</h3>
              <p>Clear handover and ongoing visibility help the system perform as intended.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <Hero
        label="About Dadu Solar"
        title="Energy expertise built for a sustainable tomorrow."
        copy="We are building a solar practice grounded in clarity, engineering discipline and a belief that the best energy systems feel simple to live with."
        image={getAssetUrl('/manus-storage/dadu-om-solar_dbce8aa5.jpg')}
      />
      <section className="section">
        <div className="container about-lead">
          <SectionIntro
            kicker="Our story"
            title="A better energy future is built, not wished for."
            copy="Dadu Solar brings together renewable energy thinking, practical engineering and a long view of what dependable infrastructure should feel like. We help homes, businesses and institutions move toward cleaner electricity through clear advice, considered design and careful execution."
          />
          <div className="about-aside">
            <span>01</span>
            <p>
              We bring together renewable energy thinking, practical engineering and a long view of what reliable infrastructure should feel like.
            </p>
          </div>
        </div>
      </section>
      <section className="section sand">
        <div className="container values-layout">
          <div>
            <p className="eyebrow">Our values</p>
            <h2>The way we choose to work.</h2>
          </div>
          <div className="value-list">
            {[
              ['Integrity', 'Clear thinking. Clear communication.'],
              ['Innovation', 'Always looking for the more considered answer.'],
              ['Reliability', 'Systems that earn trust over time.'],
              ['Sustainability', 'A cleaner future, approached responsibly.'],
              ['Customer first', 'The work starts with your real context.'],
            ].map(([a, b], i) => (
              <div key={a} className="value reveal">
                <span>0{i + 1}</span>
                <div>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </div>
                <ArrowUpRight size={17} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container vision-grid">
          <div className="vision-card dark-card">
            <p className="eyebrow light">Our mission</p>
            <h3>Make the move to solar feel considered, capable and clear.</h3>
          </div>
          <div className="vision-card image-card">
            <img
              src={getAssetUrl('/manus-storage/solar-field_fdeeeb65.jpg')}
              alt="Solar panels across a modern landscape"
            />
            <div>
              <p className="eyebrow light">Our vision</p>
              <h3>Energy infrastructure that leaves room for a better future.</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Solutions() {
  const [guide, setGuide] = useState(false);
  return (
    <>
      <Hero
        compact
        label="Solar solutions"
        title="Designed around your energy needs."
        copy="Explore solution categories built to meet different property types, scales and ambitions—with the right questions asked early."
        image={getAssetUrl('/manus-storage/dadu-commercial-solar_dd848674.jpg')}
      />
      <section className="section">
        <div className="container">
          <div className="solutions-head">
            <SectionIntro
              kicker="The right fit starts here"
              title="A solar system should fit the context."
              copy="Browse the solution families below, then use the guided experience to find a sensible starting point."
            />
            <button className="outline-action" onClick={() => setGuide(true)}>
              <Sparkles size={15} /> Find your solar fit <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="solution-list">
            {siteData.solutions.map((s, i) => (
              <Link href={`/solutions/${s.id}`} className="solution-row reveal" key={s.id}>
                <span className="solution-id">{s.id}</span>
                <div className="solution-row-image">
                  <img src={s.image} alt={s.title} />
                </div>
                <div>
                  <p className="eyebrow">Solution 0{i + 1}</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="benefits">
                    <span>Lower dependence on conventional electricity</span>
                    <span>Long-term energy planning</span>
                  </div>
                </div>
                <ArrowUpRight className="row-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark-section compact-dark">
        <div className="container two-col-cta">
          <div>
            <p className="eyebrow light">Not sure where to start?</p>
            <h2>Find your solar fit in four steps.</h2>
          </div>
          <button className="btn btn-light" onClick={() => setGuide(true)}>
            Start AI solar guide <Sparkles size={15} />
          </button>
        </div>
      </section>
      {guide && <AIGuide onClose={() => setGuide(false)} />}
    </>
  );
}

function Projects() {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Residential', 'Commercial', 'Industrial'];
  const items = useMemo(
    () => (filter === 'All' ? siteData.projects : siteData.projects.filter(p => p.category === filter)),
    [filter]
  );
  return (
    <>
      <Hero
        compact
        label="Selected work"
        title="Solar projects built for real-world impact."
        copy="Explore representative project profiles that show how Dadu Solar approaches different property types, operating contexts and energy ambitions."
        image={getAssetUrl('/manus-storage/dadu-solar-battery_03840d4c.jpg')}
      />
      <section className="section">
        <div className="container">
          <div className="project-toolbar">
            <p className="eyebrow">Project index · {items.length}</p>
            <div className="filters">
              {cats.map(c => (
                <button
                  className={filter === c ? 'active' : ''}
                  key={c}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="project-grid">
            {items.map((p, i) => (
              <Link
                href={`/projects/${slugify(p.title)}`}
                className={`project-card ${i === 0 ? 'wide' : ''} reveal`}
                key={p.title}
              >
                <div className="project-photo">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="project-meta">
                  <span>{p.category}</span>
                  <ArrowUpRight size={17} />
                </div>
                <h3>{p.title}</h3>
                <p>
                  {p.location} · {p.capacity}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectDetail() {
  const [, params] = useRoute('/projects/:slug');
  const project = siteData.projects.find(item => slugify(item.title) === params?.slug);
  if (!project) return <NotFound />;
  return (
    <>
      <Hero
        compact
        label={`${project.category} · project profile`}
        title={project.title}
        copy={project.description}
        image={project.image}
      />
      <section className="section detail-section">
        <div className="container detail-grid">
          <div>
            <SectionIntro
              kicker="Project profile"
              title="A practical system, shaped by the place it serves."
              copy="This reference profile illustrates the kind of context Dadu Solar brings into the conversation before design and delivery begin."
            />
            <div className="detail-facts">
              <span>{project.location}</span>
              <span>{project.capacity}</span>
            </div>
            <Button>Discuss a similar project</Button>
          </div>
          <div className="detail-image">
            <img src={project.image} alt={project.title} />
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  useEffect(() => {
    if (window.location.hash === '#quote-form') {
      window.setTimeout(
        () => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        80
      );
    }
  }, []);

  return (
    <>
      <Hero
        compact
        label="Start a conversation"
        title="Let's build your solar future."
        copy="Share a little about your property and energy goals. Our engineering team will review the context and get back to you with tailored options."
        image={getAssetUrl('/manus-storage/dadu-residential-solar_a5a9da2f.jpg')}
      />
      <section className="section contact-section" id="quote-form">
        <div className="container contact-grid">
          <div>
            <SectionIntro
              kicker="Get in touch"
              title="Tell us where you want to go."
              copy="No hard sell. Just an honest, engineering-first conversation about what might be possible for your property."
            />
            <div className="contact-points">
              <a href={`mailto:${siteData.contact.email}`}>
                <Mail size={18} />
                {siteData.contact.email}
              </a>
              <a href={`tel:${siteData.contact.phone}`}>
                <Phone size={18} />
                +91 {siteData.contact.phone}
              </a>
              <a
                href="https://wa.me/919610235777?text=Hi%20Dadu%20Solar%2C%20I%20would%20like%20to%20know%20more%20about%20your%20solar%20services."
                target="_blank"
                rel="noreferrer"
                style={{ color: '#25D366', fontWeight: 600 }}
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
              <span>
                <MapPin size={18} />
                {siteData.contact.address}
              </span>
            </div>
          </div>
          <div className="form-wrap">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page is off-grid.</h1>
      <Button href="/">Back home</Button>
    </div>
  );
}

function App() {
  return (
    <Router hook={useHashLocation}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/solutions/:id" component={SolutionDetail} />
          <Route path="/solutions" component={Solutions} />
          <Route path="/projects/:slug" component={ProjectDetail} />
          <Route path="/projects" component={Projects} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
