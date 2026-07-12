import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Shield, Crown, Globe, Clock, Users, Award, Star, Phone, Mail, MapPin,
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X, Briefcase, Building2,
  Hotel, Home, Dog, Plane, Building, Landmark, ShieldCheck, Radio, Lock,
  Target, Zap, Languages, UserCheck, FileText, Activity, BadgeDollarSign,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import sVip from "@/assets/service-vip.jpg";
import sEvent from "@/assets/service-event.jpg";
import sHotel from "@/assets/service-hotel.jpg";
import sK9 from "@/assets/service-k9.jpg";
import sResidential from "@/assets/service-residential.jpg";
import sCorporate from "@/assets/service-corporate.jpg";
import logo from "@/assets/logo.png";

// ─── EmailJS Config ────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_swxs8hc";
const EMAILJS_TEMPLATE_ID = "template_f1x38gp";
const EMAILJS_PUBLIC_KEY  = "jiLF_SxkNcxJW6Hoj";
// ──────────────────────────────────────────────────────────

const EASE = [0.2, 0.8, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-gold">
      <span className="h-px w-8 bg-gold/50" />
      {children}
    </div>
  );
}

function Field({ label, placeholder, name, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="rounded-xl border border-gold/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
      />
    </div>
  );
}

// ─── Continent / Country Data ──────────────────────────────
const CONTINENT_COUNTRIES = {
  "Africa": [
    "Algeria", "Angola", "Cameroon", "DR Congo", "Egypt", "Ethiopia",
    "Ghana", "Ivory Coast", "Kenya", "Libya", "Mali", "Morocco",
    "Mozambique", "Nigeria", "Senegal", "South Africa", "Sudan",
    "Tanzania", "Tunisia", "Uganda", "Zimbabwe", "Other (Africa)",
  ],
  "Asia": [
    "Afghanistan", "Bangladesh", "Bhutan", "Cambodia", "China",
    "Hong Kong", "India", "Indonesia", "Japan", "Kazakhstan",
    "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal",
    "Pakistan", "Philippines", "Singapore", "South Korea",
    "Sri Lanka", "Taiwan", "Thailand", "Uzbekistan", "Vietnam",
    "Other (Asia)",
  ],
  "Europe": [
    "Austria", "Belgium", "Czech Republic", "Denmark", "Finland",
    "France", "Germany", "Greece", "Hungary", "Ireland", "Italy",
    "Netherlands", "Norway", "Poland", "Portugal", "Romania",
    "Russia", "Spain", "Sweden", "Switzerland", "Turkey",
    "Ukraine", "United Kingdom", "Other (Europe)",
  ],
  "Middle East": [
    "Bahrain", "Cyprus", "Iran", "Iraq", "Israel", "Jordan",
    "Kuwait", "Lebanon", "Oman", "Qatar", "Saudi Arabia",
    "Syria", "United Arab Emirates", "Yemen", "Other (Middle East)",
  ],
  "Americas": [
    "Argentina", "Bolivia", "Brazil", "Canada", "Chile", "Colombia",
    "Ecuador", "Guatemala", "Jamaica", "Mexico", "Panama", "Peru",
    "Trinidad & Tobago", "United States", "Uruguay", "Venezuela",
    "Other (Americas)",
  ],
  "Oceania": [
    "Australia", "Fiji", "New Zealand", "Papua New Guinea",
    "Samoa", "Solomon Islands", "Other (Oceania)",
  ],
};

const CONTINENTS = Object.keys(CONTINENT_COUNTRIES);

const CONTINENT_PRICES = {
  "Africa":       { usd: "1,200", label: "$1,200 / month" },
  "Asia":         { usd: "600",   label: "$600 / month"   },
  "Europe":       { usd: "3,500", label: "$3,500 / month" },
  "Middle East":  { usd: "1,200", label: "$1,200 / month" },
  "Americas":     { usd: "5,000", label: "$5,000 / month" },
  "Oceania":      { usd: "2,800", label: "$2,800 / month" },
};

function SelectField({ label, name, value, onChange, options, placeholder, disabled = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border border-gold/20 bg-background/50 px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors ${
            disabled
              ? "cursor-not-allowed opacity-40 text-muted-foreground"
              : value ? "text-foreground" : "text-muted-foreground/60"
          }`}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[oklch(0.16_0.006_90)] text-foreground">{o}</option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            disabled ? "text-muted-foreground/30" : "text-gold/70"
          }`}
        />
      </div>
    </div>
  );
}
// ──────────────────────────────────────────────────────────

function TrainingVideo() {
  return (
    <section id="training" className="section-pad relative overflow-hidden">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(55% 40% at 50% 0%, oklch(0.82 0.14 86 / 0.13), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow>Guard Training</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-tight lg:text-6xl">
            Know the{" "}
            <span className="text-gold-gradient italic">standards</span>{" "}
            we uphold.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Understand the requirements and rigorous training behind every BNC Royal Guard operative — from exam standards to field-readiness.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-2xl shadow-black/60"
            style={{
              background: "linear-gradient(135deg, oklch(0.14 0.006 90), oklch(0.10 0.004 90))",
            }}
          >
            {/* gold top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            {/* 16:9 responsive iframe wrapper */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/2RW9QkzL6n4?rel=0&modestbranding=1&color=white"
                title="Security Guard Exam Requirements & Training Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            {/* gold bottom accent line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
        </Reveal>

        {/* 3 quick-info chips below video */}
        <Reveal delay={0.25} className="mt-10">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: ShieldCheck, text: "Licensing Requirements" },
              { icon: Target,      text: "Physical Standards"     },
              { icon: FileText,    text: "Exam Preparation"       },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="glass-card flex items-center gap-2.5 rounded-full border border-gold/20 px-5 py-2.5"
              >
                <Icon className="h-4 w-4 text-gold" strokeWidth={1.6} />
                <span className="text-[0.75rem] uppercase tracking-[0.25em] text-muted-foreground">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Industries", href: "#industries" },
    { label: "Training", href: "#training" },
    { label: "Why Us", href: "#why" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-gold/15 py-3" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="BNC Royal Guard" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block">
            <div className="font-display text-base font-semibold tracking-wide text-foreground">BNC Royal Guard</div>
            <div className="text-[0.6rem] uppercase tracking-[0.35em] text-gold/80">Elite Protection</div>
          </div>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group relative text-sm text-foreground/80 transition-colors hover:text-gold">
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden btn-gold lg:inline-flex">Request Protection <ArrowRight className="h-3.5 w-3.5" /></a>
        <button onClick={() => setOpen((o) => !o)} className="lg:hidden text-gold p-2">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mx-6 mt-4 glass-card rounded-2xl p-6"
          >
            <div className="flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-foreground/85 hover:text-gold">
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn-gold justify-center mt-2">Request Protection</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const cards = [
    { icon: Clock, label: "24/7 Operations" },
    { icon: Globe, label: "Worldwide Coverage" },
    { icon: ShieldCheck, label: "Ex-Military Personnel" },
    { icon: Zap, label: "Rapid Deployment" },
  ];

  return (
    <section id="home" ref={ref} className="relative min-h-screen w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={hero} alt="Elite protection" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-background/30 px-5 py-2 text-[0.7rem] uppercase tracking-[0.3em] text-gold backdrop-blur-md">
                <Crown className="h-3.5 w-3.5" />
                Elite Protection · Global Reach · Royal Standards
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-display text-5xl font-medium leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-[5.5rem]">
                Your Safety <br />
                Is Our <span className="text-gold-gradient italic font-normal">Royal Duty</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Premium security solutions for VIP clients, corporations, hotels, events and international assignments —
                delivered with absolute discretion and uncompromising standards.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
                <a href="#contact" className="btn-gold">Request Protection <ArrowRight className="h-4 w-4" /></a>
                <a href="#services" className="btn-ghost-gold">Explore Services</a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`glass-card rounded-2xl p-6 ${i % 2 ? "mt-8" : ""}`}
              >
                <c.icon className="h-7 w-7 text-gold" strokeWidth={1.4} />
                <div className="mt-4 text-sm font-medium text-foreground">{c.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">Royal standard</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold/70"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let r;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Trust() {
  const stats = [
    { value: 500, suffix: "+", label: "Clients Protected" },
    { label: "Operations", text: "24/7" },
    { label: "Coverage", text: "Worldwide" },
    { value: 100, suffix: "%", label: "Confidentiality" },
  ];
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gold/15 bg-gold/15 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="bg-background p-6 text-center sm:p-10">
              <div className={`font-display font-medium text-gold-gradient inline-block ${s.text ? "text-2xl sm:text-4xl md:text-5xl lg:text-5xl" : "text-3xl sm:text-5xl lg:text-6xl"}`}>
                {s.text ? s.text : <><Counter to={s.value} suffix={s.suffix} /></>}
              </div>
              <div className="mt-3 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs sm:tracking-[0.3em]">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const features = [
    { icon: Shield, title: "Elite Protection", text: "Operational excellence at the highest level." },
    { icon: UserCheck, title: "Professional Personnel", text: "Vetted military and law enforcement veterans." },
    { icon: Globe, title: "Worldwide Coverage", text: "Seamless deployment across continents." },
    { icon: Crown, title: "Royal Standards", text: "Discretion, refinement and luxury service." },
  ];
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-gold/20">
            <img src={about} alt="BNC Royal Guard personnel" className="h-[640px] w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          <div className="glass-card absolute -bottom-8 -right-4 hidden rounded-2xl p-6 sm:block lg:-right-10">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 text-gold" strokeWidth={1.4} />
              <div>
                <div className="font-display text-2xl text-gold-gradient">Est. Excellence</div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Royal Heritage</div>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-medium leading-tight lg:text-5xl">
              An institution of <span className="text-gold-gradient italic">refined protection</span>.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              BNC Royal Guard is a premium security services provider delivering elite protection solutions
              for private clients, corporations, hotels, events and international assignments. Our personnel
              include highly trained professionals with military, law enforcement and specialized security
              backgrounds.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="glass-card group h-full rounded-2xl p-4 transition-all hover:border-gold/50 hover:-translate-y-1 sm:p-6">
                  <f.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
                  <div className="mt-4 font-display text-base sm:text-lg">{f.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{f.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {[
            { eyebrow: "Vision", title: "The world's most trusted name in protection.", text: "To become the world's most trusted premium security service provider — synonymous with discretion, capability and royal-grade service.", icon: Target },
            { eyebrow: "Mission", title: "Discreet, reliable, uncompromising.", text: "To deliver professional, reliable and discreet protection solutions while maintaining the highest standards of integrity and excellence — every assignment, every continent.", icon: Activity },
          ].map((b, i) => (
            <Reveal key={b.eyebrow} delay={i * 0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-gold/20 p-10 lg:p-14"
                style={{ background: "linear-gradient(135deg, oklch(0.16 0.006 90) 0%, oklch(0.13 0.005 90) 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }} />
                <div className="relative">
                  <Eyebrow>{b.eyebrow}</Eyebrow>
                  <h3 className="mt-6 font-display text-3xl font-medium leading-snug lg:text-4xl">{b.title}</h3>
                  <p className="mt-6 text-muted-foreground">{b.text}</p>
                  <b.icon className="mt-8 h-10 w-10 text-gold/60" strokeWidth={1.2} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  const items = [
    { icon: Shield, label: "Ex-Military Personnel" },
    { icon: ShieldCheck, label: "Ex-Law Enforcement" },
    { icon: Globe, label: "Worldwide Operations" },
    { icon: Award, label: "Advanced Training" },
    { icon: Lock, label: "Client Confidentiality" },
    { icon: UserCheck, label: "Professional Conduct" },
    { icon: Target, label: "Risk Prevention" },
    { icon: Zap, label: "Rapid Deployment" },
  ];
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow>Our Core Strengths</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-tight lg:text-5xl">
            Capabilities forged from <span className="text-gold-gradient italic">decades of service</span>.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) * 0.06}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}
                className="glass-card group h-full rounded-2xl p-5 text-center transition-all hover:border-gold/50 sm:p-8">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/5 transition-all group-hover:bg-gold/10 sm:h-14 sm:w-14">
                  <s.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
                </div>
                <div className="mt-4 font-display text-sm text-foreground sm:mt-5 sm:text-base">{s.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { img: sVip, icon: Crown, title: "VIP Protection Services", text: "Personal bodyguards, executive protection, celebrity security, travel security and private family protection.", span: "lg:col-span-2 lg:row-span-2" },
    { img: sEvent, icon: Star, title: "Event Security", text: "Weddings, corporate events, concerts, crowd management and trade shows." },
    { img: sHotel, icon: Hotel, title: "Hotel & Hospitality", text: "Five-star hotels, resorts, guest safety, access control and luxury hospitality protection." },
    { img: sCorporate, icon: Building2, title: "Commercial Security", text: "Corporate offices, retail, shopping malls, warehouse and industrial facilities." },
    { img: sResidential, icon: Home, title: "Residential Security", text: "Villas, community patrols, estates and private property monitoring." },
    { img: sK9, icon: Dog, title: "K9 Security Services", text: "Explosive detection, patrol dogs, VIP K9 support and rapid response teams." },
    { img: sVip, icon: Shield, title: "Armed & Unarmed Guards", text: "Static security, mobile patrol, night patrol and emergency response." },
    { img: sHotel, icon: Plane, title: "International Security", text: "Global deployment, VIP escort, embassy support and cross-border security." },
    { img: sCorporate, icon: FileText, title: "Security Consulting", text: "Risk assessment, audits, threat analysis, emergency planning and crisis management." },
  ];
  return (
    <section id="services" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Services</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-medium leading-tight lg:text-6xl">
              A complete spectrum <br /> of <span className="text-gold-gradient italic">protective services</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Tailored security solutions executed with the precision of an elite operation and the polish of a luxury concierge.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 auto-rows-[minmax(220px,auto)] gap-4 sm:gap-5 lg:auto-rows-[minmax(280px,auto)] lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08} className={s.span ? `col-span-2 ${s.span}` : ""}>
              <motion.a
                href="#contact"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                className={`group relative block h-full overflow-hidden rounded-3xl border border-gold/15 ${
                  s.span ? "min-h-[360px] lg:min-h-[580px]" : "min-h-[240px] sm:min-h-[300px]"
                }`}
              >
                <img src={s.img} alt={s.title} loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-full border border-gold/30 bg-background/40 backdrop-blur sm:mb-4 sm:h-12 sm:w-12">
                    <s.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                  </div>
                  <h3 className="font-display text-lg font-medium text-foreground sm:text-2xl lg:text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-md text-xs text-muted-foreground sm:mt-3 sm:text-sm">{s.text}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-gold opacity-90 transition-all group-hover:gap-3 sm:mt-5 sm:text-xs sm:tracking-[0.3em]">
                    Read More <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const items = [
    { icon: Hotel, label: "Hotels", img: sHotel },
    { icon: Landmark, label: "Government", img: sCorporate },
    { icon: Home, label: "Residential", img: sResidential },
    { icon: Briefcase, label: "Retail", img: sCorporate },
    { icon: Building2, label: "Corporate", img: sCorporate },
    { icon: Building, label: "Construction", img: sCorporate },
    { icon: Star, label: "Events", img: sEvent },
    { icon: Crown, label: "VIP Clients", img: sVip },
    { icon: Globe, label: "International Delegations", img: sHotel },
  ];
  return (
    <section id="industries" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow>Industries We Serve</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-tight lg:text-5xl">
            Trusted across <span className="text-gold-gradient italic">every demanding sector</span>.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={(i % 3) * 0.08}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-3xl border border-gold/15">
                <div className="relative h-44 sm:h-64">
                  <img src={it.img} alt={it.label} loading="lazy"
                    className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-5 sm:p-8">
                    <it.icon className="h-6 w-6 text-gold sm:h-8 sm:w-8" strokeWidth={1.3} />
                    <div className="mt-3 font-display text-base text-foreground sm:mt-4 sm:text-2xl">{it.label}</div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Shield, t: "Ex-Military Professionals" },
    { icon: ShieldCheck, t: "Ex-Police Officers" },
    { icon: Globe, t: "Worldwide Service Network" },
    { icon: Crown, t: "Luxury Security Specialists" },
    { icon: Dog, t: "K9 Units Available" },
    { icon: Clock, t: "24/7 Operations" },
    { icon: Zap, t: "Rapid Deployment" },
    { icon: UserCheck, t: "Professional Appearance" },
    { icon: Languages, t: "Multilingual Guards" },
    { icon: Award, t: "Advanced Training" },
    { icon: Lock, t: "Confidential Services" },
    { icon: Star, t: "Proven Reliability" },
  ];
  return (
    <section id="why" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <Eyebrow>Why Choose BNC Royal Guard</Eyebrow>
          <h2 className="mt-6 font-display text-4xl font-medium leading-tight lg:text-5xl">
            Twelve reasons the world's most discerning clients <span className="text-gold-gradient italic">trust us</span>.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {items.map((w, i) => (
            <Reveal key={w.t} delay={(i % 3) * 0.06}>
              <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.3 }}
                className="glass-card flex flex-col items-start gap-3 rounded-2xl p-4 transition-all hover:border-gold/50 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/5 sm:h-12 sm:w-12">
                  <w.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                </div>
                <div className="font-display text-sm sm:text-lg">{w.t}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Consultation", d: "Understand the client and the assignment." },
    { n: "02", t: "Threat Assessment", d: "Identify risks across people and places." },
    { n: "03", t: "Strategic Planning", d: "Engineer a discreet protection blueprint." },
    { n: "04", t: "Deployment", d: "Mobilize vetted personnel and resources." },
    { n: "05", t: "Continuous Protection", d: "Sustain coverage with relentless precision." },
  ];
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow>Our Process</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-tight lg:text-5xl">
            A choreography of <span className="text-gold-gradient italic">precision and care</span>.
          </h2>
        </Reveal>

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block" />
          <div className="grid gap-10 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12} className="text-center">
                <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-background font-display text-sm text-gold">
                  {s.n}
                </div>
                <div className="mt-6 font-display text-xl">{s.t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q: "Their team's discretion and professionalism is unmatched. We have not engaged any other firm since.", n: "H.E. Ambassador", c: "International Delegation" },
    { q: "BNC Royal Guard transformed our event security into an extension of the guest experience itself.", n: "General Manager", c: "Five-Star Hotel Group" },
    { q: "Calm, decisive and invisible when needed. They are exactly what executive protection should feel like.", n: "Chief Executive", c: "Private Holding Company" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-6 font-display text-4xl font-medium leading-tight lg:text-5xl">
            Spoken in confidence by <span className="text-gold-gradient italic">those we protect</span>.
          </h2>
        </Reveal>

        <div className="relative mt-16 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="glass-card rounded-3xl p-10 text-center lg:p-14"
            >
              <div className="flex justify-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-gold" />)}
              </div>
              <p className="mt-8 font-display text-2xl italic leading-relaxed text-foreground lg:text-3xl">
                "{items[i].q}"
              </p>
              <div className="mt-8">
                <div className="text-sm font-medium text-gold">{items[i].n}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{items[i].c}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, k) => (
              <button key={k} onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-10 bg-gold" : "w-4 bg-gold/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const regions = [
    {
      flag: "🌍",
      continent: "Africa",
      price: "1,200",
      highlight: false,
      features: ["Armed & Unarmed Guards", "Static Post Security", "Event Protection", "Mobile Patrol"],
    },
    {
      flag: "🌏",
      continent: "Asia",
      price: "600",
      highlight: false,
      features: ["Corporate Security", "Residential Protection", "K9 Services", "Local Deployment"],
    },
    {
      flag: "🌍",
      continent: "Europe",
      price: "3,500",
      highlight: true,
      features: ["International Protection", "Embassy Detail", "Cross-border Escort", "Crisis Response"],
    },
    {
      flag: "🌙",
      continent: "Middle East",
      price: "1,200",
      highlight: false,
      features: ["VIP Close Protection", "Hotel Security", "Luxury Event Guards", "Executive Escort"],
    },
    {
      flag: "🌎",
      continent: "Americas",
      price: "5,000",
      highlight: false,
      features: ["Elite VIP Protection", "Celebrity Security", "Federal-grade Standards", "24/7 Command Center"],
    },
    {
      flag: "🌊",
      continent: "Oceania",
      price: "2,800",
      highlight: false,
      features: ["VIP Protection", "Corporate Security", "Event Security", "Mobile Response"],
    },
  ];

  return (
    <section id="pricing" className="section-pad relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(60% 50% at 50% 0%, oklch(0.82 0.14 86 / 0.12), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow>Global Pricing</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-tight lg:text-6xl">
            Transparent rates across{" "}
            <span className="text-gold-gradient italic">every continent</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Elite protection priced to reflect local standards — the same royal-grade security, every market.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r, i) => (
            <Reveal key={r.continent} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 ${
                  r.highlight
                    ? "border-gold/60 bg-gradient-to-b from-gold/10 to-gold/[0.04]"
                    : "glass-card border-gold/15"
                }`}
              >
                {r.highlight && (
                  <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-gold">
                    <Star className="h-2.5 w-2.5 fill-gold text-gold" />
                    Popular
                  </div>
                )}
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-4xl leading-none">{r.flag}</span>
                  <div>
                    <div className="font-display text-xl font-medium text-foreground">{r.continent}</div>
                    <div className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">USD</div>
                  </div>
                </div>
                <div className="mb-1 flex items-end gap-1">
                  <span className="font-display text-lg font-semibold leading-none tracking-tight text-gold/80">$</span>
                  <span className={`font-display text-3xl font-semibold leading-none tracking-tight ${r.highlight ? "text-gold-gradient" : "text-foreground"}`}>
                    {r.price}
                  </span>
                </div>
                <div className="mb-7 text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">/ month</div>
                <div className="hairline mb-7" />
                <ul className="flex flex-1 flex-col gap-3">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/5">
                        <Check className="h-2.5 w-2.5 text-gold" strokeWidth={2.5} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 block rounded-full py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                    r.highlight
                      ? "btn-gold"
                      : "border border-gold/30 text-gold hover:border-gold hover:bg-gold/8"
                  }`}
                >
                  Get a Quote
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            All rates shown are starting prices guards per month.{" "}
            <a href="#contact" className="text-gold/80 underline underline-offset-4 hover:text-gold transition-colors">
              Contact us
            </a>{" "}
            for a tailored quote based on your exact requirements.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 p-12 text-center lg:p-24"
            style={{ background: "radial-gradient(120% 100% at 50% 0%, oklch(0.82 0.14 86 / 0.18), transparent 60%), linear-gradient(180deg, oklch(0.1 0.005 90), oklch(0.13 0.005 90))" }}>
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }} />
            <div className="relative">
              <Crown className="mx-auto h-10 w-10 text-gold" strokeWidth={1.3} />
              <h2 className="mx-auto mt-8 max-w-3xl font-display text-4xl font-medium leading-tight lg:text-6xl">
                Experience <span className="text-gold-gradient italic">world-class</span> protection.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
                Elite protection services tailored to your security needs. Speak with a senior advisor — confidentially.
              </p>
              <a href="#contact" className="btn-gold mt-10">Request Protection <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");

  const handleContinentChange = (e) => {
    setContinent(e.target.value);
    setCountry(""); // reset country when continent changes
  };

  const autoRate = continent && CONTINENT_PRICES[continent] ? CONTINENT_PRICES[continent].label : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
      formRef.current.reset();
      setContinent("");
      setCountry("");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-6 font-display text-4xl font-medium leading-tight lg:text-6xl">
            Begin a <span className="text-gold-gradient italic">private conversation</span>.
          </h2>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Share a brief outline of your requirement. A senior protection advisor will respond within hours.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass-card grid gap-5 rounded-3xl p-8 lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name"  name="from_name"  placeholder="Your full name" />
                <Field label="Email" name="from_email" placeholder="you@domain.com" type="email" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone"            name="phone"   placeholder="+977 ..." />
                <Field label="Service Required" name="service" placeholder="VIP, Event, K9 ..." />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Continent"
                  name="continent"
                  value={continent}
                  onChange={handleContinentChange}
                  options={CONTINENTS}
                  placeholder="Select continent..."
                />
                <SelectField
                  label="Country"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  options={continent ? CONTINENT_COUNTRIES[continent] : []}
                  placeholder={continent ? "Select country..." : "Select continent first"}
                  disabled={!continent}
                />
              </div>
              {/* Auto Rate Field */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Auto Rate
                </label>
                <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  autoRate
                    ? "border-gold/40 bg-gold/5"
                    : "border-gold/10 bg-background/30"
                }`}>
                  <BadgeDollarSign className={`h-4 w-4 shrink-0 ${autoRate ? "text-gold" : "text-muted-foreground/30"}`} strokeWidth={1.5} />
                  <span className={`text-sm font-medium tracking-wide ${autoRate ? "text-gold" : "text-muted-foreground/40"}`}>
                    {autoRate || "Select a continent to see the starting rate"}
                  </span>
                </div>
                {/* Hidden input so rate is sent via EmailJS */}
                <input type="hidden" name="rate" value={autoRate} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your requirement..."
                  required
                  className="rounded-xl border border-gold/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className={`btn-gold mt-2 justify-center transition-opacity ${
                  status === "sending" || status === "sent" ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {status === "idle"    && <><span>Request Protection</span><ArrowRight className="h-4 w-4" /></>}
                {status === "sending" && <span>Sending…</span>}
                {status === "sent"    && <span>Message Sent ✓</span>}
                {status === "error"   && <><span>Try Again</span><ArrowRight className="h-4 w-4" /></>}
              </button>
              {status === "sent" && (
                <p className="text-center text-sm text-green-400">
                  Your request has been received. A senior advisor will contact you within hours.
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-red-400">
                  Submission failed. Please try again or reach us directly at{" "}
                  <a href="tel:+9774534577" className="underline">+977-4534577</a>.
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-4">
              <div className="glass-card flex items-start gap-5 rounded-2xl p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/5">
                  <Phone className="h-5 w-5 text-gold" strokeWidth={1.4} />
                </div>
                <div>
                  <div className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">Phone</div>
                  <div className="mt-1 font-display text-lg text-foreground">+977-4534577</div>
                </div>
              </div>
              <div className="glass-card flex items-start gap-5 rounded-2xl p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/5">
                  <Mail className="h-5 w-5 text-gold" strokeWidth={1.4} />
                </div>
                <div>
                  <div className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">Email</div>
                  <div className="mt-1 font-display text-lg text-foreground">info@bncsolutiongroup.com</div>
                </div>
              </div>
              <div className="glass-card flex items-center gap-4 rounded-2xl px-6 py-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/5">
                  <MapPin className="h-4 w-4 text-gold" strokeWidth={1.4} />
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Location</div>
                  <div className="mt-1 text-base text-foreground">Mahalaxmi Plaza, Kalimati Road, KTM</div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gold/20 bg-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5510.561393474242!2d85.2962908741824!3d27.697302025936814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb185bed72cacf%3A0x9848bc262229ae42!2sMahalaxmi%20Plaza!5e1!3m2!1sen!2snp!4v1781515889543!5m2!1sen!2snp"
                  className="h-[280px] w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-gold/15 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src={logo} alt="BNC Royal Guard" className="h-12 w-12 object-contain" />
              <div>
                <div className="font-display text-lg">BNC Royal Guard</div>
                <div className="text-[0.6rem] uppercase tracking-[0.35em] text-gold/80">Elite Protection</div>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm text-muted-foreground">
              Premium security services for VIP clients, corporations, hotels, events and international assignments.
            </p>
          </div>
          <FooterCol title="Navigate" items={[
            { l: "Home", h: "#home" }, { l: "About", h: "#about" }, { l: "Services", h: "#services" },
            { l: "Industries", h: "#industries" }, { l: "Why Us", h: "#why" }, { l: "Pricing", h: "#pricing" }, { l: "Contact", h: "#contact" },
          ]} />
          <FooterCol title="Services" items={[
            { l: "VIP Protection", h: "#services" }, { l: "Event Security", h: "#services" },
            { l: "Hotel & Hospitality", h: "#services" }, { l: "K9 Services", h: "#services" },
            { l: "International", h: "#services" }, { l: "Consulting", h: "#services" },
          ]} />
          <div>
            <div className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">Contact</div>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold" /> +977-4534577</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" /> info@bncsolutiongroup.com</li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold" /> Mahalaxmi Plaza, Kalimati Road, KTM</li>
            </ul>
          </div>
        </div>
        <div className="hairline mt-16" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} BNC Royal Guard. All rights reserved.</div>
          <div className="uppercase tracking-[0.3em]">Discretion · Excellence · Royalty</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">{title}</div>
      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li key={i.l}>
            <a href={i.h} className="text-sm text-muted-foreground transition-colors hover:text-gold">{i.l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MouseGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const on = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, oklch(0.82 0.14 86 / 0.06), transparent 60%)`,
      }}
    />
  );
}

export default function App() {
  return (
    <div className="relative overflow-x-clip bg-background text-foreground">
      <MouseGlow />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <TrainingVideo />
        <About />
        <MissionVision />
        <Strengths />
        <Services />
        <Industries />
        <WhyUs />
        <Process />
        <Testimonials />
        <Pricing />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}