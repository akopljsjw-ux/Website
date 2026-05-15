import React, { ReactNode, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { 
  ArrowUpRight, 
  MapPin, 
  Instagram, 
  Mail,
  Linkedin, 
  Menu,
  X,
  ChevronRight,
  Terminal,
  Brush,
  ShoppingBag,
  Zap
} from 'lucide-react';

const TopoBackground = React.memo(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer rendering of heavy SVG filter until after opening animation
    const timer = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden mix-blend-multiply"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <filter id="topoFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.003" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter="url(#topoFilter)" stroke="var(--color-primary)" fill="none" strokeWidth="1.5" opacity="0.8">
          {Array.from({ length: 80 }).map((_, i) => (
            <line key={`line-${i}`} x1="-50%" y1={i * 40 - 200} x2="150%" y2={i * 40 - 200} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
             <circle key={`c1-${i}`} cx="30%" cy="30%" r={i * 60 + 20} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
             <circle key={`c2-${i}`} cx="80%" cy="80%" r={i * 80 + 40} />
          ))}
        </g>
      </svg>
    </motion.div>
  );
});

TopoBackground.displayName = 'TopoBackground';

const CustomCursor = React.memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleLinkHoverEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true), { passive: true });
        el.addEventListener('mouseleave', () => setLinkHovered(false), { passive: true });
      });
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    
    // Slight delay to ensure DOM is ready
    setTimeout(handleLinkHoverEvents, 500);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div 
        className="hidden md:block custom-cursor" 
        style={{ 
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }} 
      />
      <motion.div 
        className="hidden md:block custom-cursor-follower" 
        style={{ 
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: linkHovered ? 1.5 : 1,
          backgroundColor: linkHovered ? 'rgba(212, 165, 165, 0.1)' : 'transparent',
          borderColor: linkHovered ? 'rgba(212, 165, 165, 0.5)' : 'rgba(43, 31, 34, 0.3)',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
});
CustomCursor.displayName = 'CustomCursor';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/5 backdrop-blur-xl border-b border-on-surface/10 h-20 flex items-center">
      <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
        <motion.a 
          href="#" 
          className="text-2xl font-display font-medium tracking-tighter text-on-surface"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          S<span className="italic font-light text-primary mx-1">&</span>A
        </motion.a>

        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-xs font-sans font-medium tracking-widest uppercase text-on-surface/60 hover:text-on-surface transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {link.name}
            </motion.a>
          ))}
          <motion.a 
            href="#contact"
            className="px-6 py-2 border border-secondary text-xs font-medium uppercase tracking-widest hover:bg-secondary/10 transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Inquire
          </motion.a>
        </div>

        <div className="md:hidden flex items-center gap-6">
          <button 
            className="text-on-surface"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-surface/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-4xl font-display italic text-on-surface hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact"
              className="mt-8 px-10 py-4 border border-on-surface text-on-surface text-sm tracking-widest uppercase hover:bg-on-surface hover:text-surface transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Project
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <main className="bg-navy">
      <motion.div 
        className="relative bg-surface min-h-screen origin-center"
        initial={{ clipPath: "circle(0% at 50% 50%)", scale: 0.95 }}
        animate={{ clipPath: "circle(150% at 50% 50%)", scale: 1 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        style={{ willChange: "transform, clip-path" }}
      >
        <TopoBackground />
        <CustomCursor />
        <Navbar />

      {/* Hero Section */}
      <motion.header 
        style={{ scale, opacity, y, willChange: 'transform, opacity' }}
        className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-20 origin-bottom"
      >
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ 
            background: 'radial-gradient(circle at center, transparent 0%, #fdfaf9 100%)',
            scale 
          }}
        />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <motion.span 
            className="text-tertiary font-sans font-medium tracking-[0.4em] uppercase text-[10px] mb-8 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Established 2024
          </motion.span>

          <motion.h1 
            className="text-7xl md:text-[110px] lg:text-[130px] font-display font-light text-on-surface leading-none italic mb-12 tracking-tighter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
          >
            Sahil & Anmol
          </motion.h1>

          <motion.p 
            className="max-w-2xl mx-auto text-lg md:text-xl font-sans font-light text-on-surface/80 leading-relaxed mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            We build beautiful, responsive websites — without the agency price tag. 
            High-end design meets elite engineering for ambitious brands.
          </motion.p>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <a href="#work" className="group flex items-center gap-3 font-sans font-medium text-[10px] tracking-[0.3em] uppercase border-b border-primary pb-1 hover:border-tertiary transition-colors">
              View Recent Work
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.header>

      {/* About Section */}
      <section id="about" className="py-32 relative px-6 overflow-hidden z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 space-y-12">
              <FadeInSection>
                <span className="text-secondary font-sans font-medium tracking-[0.2em] text-[10px] mb-4 block uppercase text-rose">The Duo</span>
                <h2 className="text-4xl md:text-6xl font-display font-normal leading-tight">Anmol & Sahil. <br/><span className="italic">Significant impact.</span></h2>
              </FadeInSection>

              <div className="space-y-16">
                <FadeInSection className="space-y-4 glass p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Brush size={100} />
                  </div>
                  <h3 className="text-2xl font-display italic">Sahil: Strategy & Design</h3>
                  <p className="font-sans font-light text-on-surface/80 leading-relaxed relative z-10">Focusing on the intersection of brand identity and user experience. Every pixel is intentional, every interaction a choice in luxury storytelling.</p>
                </FadeInSection>

                <FadeInSection className="space-y-4 glass p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Terminal size={100} />
                  </div>
                  <h3 className="text-2xl font-display italic">Anmol: Engineering & Performance</h3>
                  <p className="font-sans font-light text-on-surface/80 leading-relaxed relative z-10">Architecting scalable solutions that fly. Clean code, lightning-fast load times, and technical precision are the foundations of our craft.</p>
                </FadeInSection>
              </div>
            </div>

            <div className="md:col-span-1" />

            <div className="md:col-span-6 flex flex-col gap-12 items-start justify-center">
              <FadeInSection className="max-w-md">
                <p className="text-5xl md:text-6xl font-display italic text-primary/60 mb-8 select-none">"Digital distinction for the discerning few."</p>
                <p className="font-sans font-extralight text-xl text-on-surface/80 leading-relaxed italic">
                  We stripped away the agency bloat to deliver pure, concentrated excellence. We operate at the nexus of art and code across the digital landscape.
                </p>
                <div className="mt-12 space-y-2">
                   <div className="flex items-center gap-4 py-4 border-b border-primary/20">
                      <span className="text-[10px] font-medium tracking-widest uppercase opacity-40">Founded</span>
                      <span className="text-sm font-light">2024</span>
                   </div>
                   <div className="flex items-center gap-4 py-4 border-b border-primary/20">
                      <span className="text-[10px] font-medium tracking-widest uppercase opacity-40">Aesthetic</span>
                      <span className="text-sm font-light">Blush Topography</span>
                   </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-40 z-10">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />
        <div className="container mx-auto px-6 max-w-7xl text-left">
          <FadeInSection className="mb-20">
            <span className="text-secondary font-sans font-medium tracking-[0.2em] text-[10px] mb-4 block uppercase">Capabilities</span>
            <h2 className="text-4xl md:text-6xl font-display font-normal">Elevating the digital standard.</h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Brush size={32} />, title: 'Web Design', desc: 'Editorial-grade layouts designed to convert through sophisticated aesthetic appeal.' },
              { icon: <Terminal size={32} />, title: 'Development', desc: 'Robust, future-proof codebases built with modern frameworks and performance in mind.' },
              { icon: <Zap size={32} />, title: 'Performance', desc: 'Optimizing for the highest lighthouse scores and search engine visibility from day one.' },
              { icon: <ShoppingBag size={32} />, title: 'E-commerce', desc: 'Seamless luxury shopping experiences that prioritize security and conversion.' }
            ].map((service, i) => (
              <FadeInSection key={i} className="glass p-10 flex flex-col justify-between hover:bg-white/80 transition-all duration-500 min-h-[300px] shadow-sm rounded-3xl">
                <div className="text-secondary mb-12">{service.icon}</div>
                <div>
                  <h4 className="text-2xl font-display mb-4 italic">{service.title}</h4>
                  <p className="text-sm font-sans font-light text-on-surface/70 leading-relaxed">{service.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-40 px-6 max-w-7xl mx-auto relative z-10">
        <FadeInSection className="flex justify-between items-end mb-20">
          <div>
            <span className="text-secondary font-sans font-medium tracking-[0.2em] text-[10px] mb-4 block uppercase">Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-display font-normal">Selected Works</h2>
          </div>
          <div className="hidden md:block opacity-30 font-sans font-light text-sm tracking-widest">
            2023 — 2024
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {[
            { 
              title: 'Lumina E-Commerce', 
              cat: 'Web Design / High-Conversion', 
              img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200' 
            },
            { 
              title: 'Nexus Analytics', 
              cat: 'SaaS Dashboard / React', 
              img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200' 
            },
            { 
              title: 'Aura Agency', 
              cat: 'Landing Page / Motion', 
              img: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=1200' 
            },
            { 
              title: 'Zenith Platform', 
              cat: 'Web App / Next.js', 
              img: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=1200' 
            }
          ].map((item, i) => (
            <FadeInSection key={i} className={`group relative cursor-pointer ${i % 2 !== 0 ? 'md:mt-32' : ''}`}>
              <div className="glass p-3 overflow-hidden aspect-[16/10] rounded-[2rem] shadow-md border-white">
                <div className="w-full h-full overflow-hidden relative rounded-[1.5rem]">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                    <span className="text-tertiary text-[10px] font-sans font-medium tracking-widest uppercase mb-2">{item.cat}</span>
                    <h3 className="text-3xl font-display italic text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-40 z-10">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <FadeInSection className="mb-20">
            <span className="text-secondary font-sans font-medium tracking-[0.2em] text-[10px] mb-4 block uppercase">Investment</span>
            <h2 className="text-4xl md:text-6xl font-display font-normal">Transparent Pricing</h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { name: 'Essentials', price: '20', items: ['Up to 3 pages', 'Responsive layout', 'Basic animations', 'Contact form setup'] },
              { name: 'Professional', price: '40', items: ['Up to 6 pages', 'Custom illustrations', 'Advanced scroll effects', 'SEO optimization'], popular: true },
              { name: 'Enterprise', price: 'Custom', items: ['Unlimited pages', 'Full-stack application', 'Complex logic / APIs', 'Ongoing maintenance'] }
            ].map((plan, i) => (
              <FadeInSection key={i} className={`p-12 relative flex flex-col min-h-[450px] transition-all duration-500 rounded-[2.5rem] ${plan.popular ? 'bg-primary text-white scale-105 shadow-xl shadow-primary/20 border border-transparent' : 'glass border-white hover:-translate-y-2 hover:shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-on-surface text-surface text-[8px] font-bold tracking-[0.2em] uppercase px-6 py-2 rounded-full shadow-md">Most Popular</div>
                )}
                <h3 className={`text-3xl font-display italic mb-2 ${plan.popular ? 'text-white' : 'text-on-surface'}`}>{plan.name}</h3>
                <div className={`text-5xl font-display mb-12 ${plan.popular ? 'text-white' : 'text-primary'}`}>
                  {plan.price === 'Custom' ? plan.price : `$${plan.price}`}
                  {plan.price !== 'Custom' && <span className="text-base opacity-60 italic ml-1 font-sans">/site</span>}
                </div>
                
                <ul className="space-y-6 flex-grow mb-12">
                  {plan.items.map((item) => (
                    <li key={item} className={`text-sm font-sans font-medium flex items-center gap-3 ${plan.popular ? 'text-white/90' : 'text-on-surface/80'}`}>
                      <div className={`w-1.5 h-1.5 rotate-45 flex-shrink-0 ${plan.popular ? 'bg-white' : 'bg-secondary'}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <a href="#contact" className={`block text-center w-full py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ${plan.popular ? 'bg-white text-primary hover:bg-surface' : 'bg-on-surface text-surface hover:bg-primary hover:text-white shadow-md'}`}>
                  Choose {plan.name}
                </a>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <FadeInSection>
            <span className="text-secondary font-sans font-medium tracking-[0.2em] text-[10px] mb-4 block uppercase">Contact</span>
            <h2 className="text-5xl md:text-8xl font-display font-light mb-12 text-on-surface">Ready to build something <span className="italic text-primary">extraordinary?</span></h2>
            
            <p className="font-sans font-light text-xl text-on-surface/80 mb-12">
              We are currently accepting new projects. Reach out on Instagram to start the conversation.
            </p>

            <a 
              href="https://www.instagram.com/web_builder___?igsh=Njg1cjV4Zmh6Y25t" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-4 text-xs font-bold tracking-[0.3em] uppercase py-5 px-10 rounded-full bg-on-surface text-surface hover:bg-primary hover:text-white shadow-xl transition-all duration-300"
            >
              <Instagram size={20} />
              Connect on Instagram
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-primary/20 relative z-10">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-2xl font-display font-medium tracking-tighter">S<span className="italic font-light text-primary mx-1">&</span>A</div>
          
          <div className="flex gap-12">
            {['Privacy', 'Terms', 'Instagram', 'LinkedIn'].map((link) => (
              <a key={link} href="#" className="text-[10px] font-medium tracking-widest uppercase text-on-surface/40 hover:text-tertiary transition-colors">{link}</a>
            ))}
          </div>

          <div className="text-[10px] font-medium tracking-widest uppercase text-on-surface/40">
            © 2024 Sahil & Anmol. Built for the bold.
          </div>
        </div>
      </footer>
      </motion.div>
    </main>
  );
}
