import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Users, Brain, BatteryCharging, Mountain, ArrowRight, 
  CheckCircle, Menu, X, Moon, Sun, ChevronDown, Play, Download, 
  Feather, Repeat, Coffee, Leaf, Shield, Waves
} from 'lucide-react';

// --- TYPES ---

type Language = 'RU' | 'EN' | 'DE' | 'FR';

interface ContentText {
  nav: { about: string; schedule: string; team: string; pricing: string; book: string; bookShort: string };
  hero: { date: string; titlePrefix: string; titleHighlight: string; desc: string; ctaApply: string; ctaDetails: string; watchVideo: string };
  stats: { years: string; participants: string; experts: string };
  about: { title: string; desc: string; neuroTitle: string; neuroDesc: string; toolsTitle: string; toolsDesc: string; japanTitle: string; japanDesc: string };
  schedule: { title: string; subtitle: string; days: { day: string; title: string; desc: string }[] };
  team: { title: string; subtitle: string; coaches: { name: string; role: string; desc: string }[] };
  pricing: { title: string; subtitle: string; shared: string; single: string; popular: string; select: string; book: string; features: string[] };
  download: { title: string; desc: string; button: string };
  modal: { title: string; desc: string; nameLabel: string; emailLabel: string; typeLabel: string; submit: string };
}

// --- CONSTANTS ---

const PDF_URL = "https://storage.googleapis.com/uspeshnyy-projects/burnout/Kochi%20Sakura%20-%20Burnout%20Bootcamp%20(April%202026).pdf";
const VIDEO_BG_URL = "https://storage.googleapis.com/uspeshnyy-projects/burnout/hero.mp4";
const VIDEO_BG_MOBILE_URL = "https://storage.googleapis.com/uspeshnyy-projects/burnout/hero_m.mp4";

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'RU', flag: '🇷🇺', label: 'Русский' },
  { code: 'EN', flag: '🇬🇧', label: 'English' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'FR', flag: '🇫🇷', label: 'Français' }
];

const TRANSLATIONS: Record<Language, ContentText> = {
  RU: {
    nav: { about: "О программе", schedule: "Программа", team: "Команда", pricing: "Цены", book: "Подать заявку", bookShort: "Заявка" },
    hero: {
      date: "30 марта — 7 апреля 2026 • Коти, Япония",
      titlePrefix: "Burnout Bootcamp:",
      titleHighlight: "Научная Перезагрузка",
      desc: "Ретрит для основателей и лидеров, основанный на нейробиологии. Восстановите нервную систему в тишине японских гор, используя доказательные методики.",
      ctaApply: "Подать заявку",
      ctaDetails: "Узнать детали",
      watchVideo: "Смотреть видео"
    },
    stats: { years: "года опыта", participants: "лидеров-выпускников", experts: "экспертов и ученых" },
    about: {
      title: "Лаборатория восстановления",
      desc: "Высокая эффективность требует качественного восстановления. Мы исключили эзотерику в пользу нейрофизиологии. Это инженерный подход к вашему состоянию.",
      neuroTitle: "Нейробиология стресса",
      neuroDesc: "Поймите механику выгорания и научитесь управлять своей биохимией через протоколы.",
      toolsTitle: "100+ Техник восстановления",
      toolsDesc: "Персональный набор инструментов для экстренной и долгосрочной перезагрузки.",
      japanTitle: "Исцеляющая среда",
      japanDesc: "Кедровые леса, древние онсэны и горы Коти — идеальный контекст для активации парасимпатики."
    },
    schedule: {
      title: "Архитектура вашего отдыха",
      subtitle: "8 дней глубокого погружения в практику и природу",
      days: [
        { day: "01", title: "Декомпрессия", desc: "Прибытие. Переход в режим тишины. Живописное пересечение острова Авадзи." },
        { day: "02", title: "Погружение", desc: "Горный лодж. Лекции о природе кортизола. Вечер в онсэне под звездами." },
        { day: "03", title: "Телесность", desc: "Работа с фасциями. Возвращение контакта с телом. Киновечер." },
        { day: "04", title: "Цифровой Детокс", desc: "Водопады Никобути. Полное отключение связи. Психология ресурса." },
        { day: "05", title: "Созерцание", desc: "Цветение сакуры. Древние храмы. Практики внимательности." },
        { day: "06-07", title: "Интеграция", desc: "Сборка опыта. Построение личной карты жизнестойкости. Финальный ужин." }
      ]
    },
    team: {
      title: "Ваши наставники",
      subtitle: "Синтез академической науки Гарварда и практического бизнес-коучинга.",
      coaches: [
        { name: "Аксинья Мюллер", role: "Stress Scientist, Harvard", desc: "Исследует биологические маркеры стресса. Учит управлять энергией на клеточном уровне." },
        { name: "Хуан Пабло Муньис", role: "MBA, Co-founder", desc: "Эксперт по навигации кризисов. Работает с лидерами в моменты высокой турбулентности." },
        { name: "Дэниел Лоу", role: "PCC Coach", desc: "Мастер создания безопасного пространства для глубокой внутренней работы." },
        { name: "Шейн Тан", role: "Quiet Power Coach", desc: "Специалист по работе с «тихим выгоранием» и восстановлению самоценности." }
      ]
    },
    pricing: {
      title: "Инвестиция в состояние",
      subtitle: "Камерная группа. Только 12 мест для максимального комфорта.",
      shared: "Двухместное размещение",
      single: "Одноместное размещение",
      popular: "Выбор лидеров",
      select: "Выбрать пакет",
      book: "Забронировать Single",
      features: ["7 ночей проживания", "Трансферы на Land Cruiser", "Авторское питание", "Карта жизнестойкости", "Приватная комната", "Полная конфиденциальность"]
    },
    download: {
      title: "Изучите детали",
      desc: "Скачайте полную презентацию с подробным расписанием, профилями экспертов и научным обоснованием программы.",
      button: "Скачать PDF (12MB)"
    },
    modal: {
      title: "Начать восстановление",
      desc: "Оставьте контактные данные. Мы свяжемся с вами для короткого интервью-знакомства.",
      nameLabel: "Как к вам обращаться",
      emailLabel: "Email",
      typeLabel: "Желаемый тип размещения",
      submit: "Отправить заявку"
    }
  },
  EN: {
    nav: { about: "About", schedule: "Schedule", team: "Team", pricing: "Pricing", book: "Apply Now", bookShort: "Apply" },
    hero: {
      date: "March 30 — April 7, 2026 • Kochi, Japan",
      titlePrefix: "Burnout Bootcamp:",
      titleHighlight: "The Science of Reset",
      desc: "A neuroscience-based retreat for founders and leaders. Reset your nervous system in the silence of the Japanese mountains, devoid of esoteric fluff.",
      ctaApply: "Apply Now",
      ctaDetails: "Discover More",
      watchVideo: "Watch Film"
    },
    stats: { years: "years running", participants: "alumni leaders", experts: "scientists & coaches" },
    about: {
      title: "Recovery Laboratory",
      desc: "High performance demands high-quality recovery. We replaced spirituality with neurobiology. This is an engineering approach to your wellbeing.",
      neuroTitle: "Neurobiology of Stress",
      neuroDesc: "Understand the mechanics of burnout and master your biochemistry through proven protocols.",
      toolsTitle: "100+ Recovery Tools",
      toolsDesc: "A personalized toolkit for emergency resets and long-term resilience.",
      japanTitle: "Healing Environment",
      japanDesc: "Cedar forests, ancient onsens, and Kochi mountains — the perfect context to activate the parasympathetic system."
    },
    schedule: {
      title: "The Arc of Recovery",
      subtitle: "8 days of deep immersion in science and nature",
      days: [
        { day: "01", title: "Decompression", desc: "Arrival. Transition to silence. Scenic crossing of Awaji Island." },
        { day: "02", title: "Immersion", desc: "Mountain Lodge. Lectures on cortisol dynamics. Evening onsen under the stars." },
        { day: "03", title: "Embodiment", desc: "Fascia work. Reconnecting with the physical self. Cinema night." },
        { day: "04", title: "Digital Detox", desc: "Nikobuchi Waterfalls. Full disconnection. The psychology of resource." },
        { day: "05", title: "Contemplation", desc: "Sakura blooming. Ancient temples. Mindfulness practices." },
        { day: "06-07", title: "Integration", desc: "Synthesizing the experience. Building your Resilience Map. Final dinner." }
      ]
    },
    team: {
      title: "Your Mentors",
      subtitle: "A synthesis of Harvard academia and practical business coaching.",
      coaches: [
        { name: "Aksinia Mueller", role: "Stress Scientist, Harvard", desc: "Researches biological stress markers. Teaches energy management at a cellular level." },
        { name: "Juan Pablo Muñiz", role: "MBA, Co-founder", desc: "Crisis navigation expert. Coaches leaders through high-turbulence career moments." },
        { name: "Daniel Low", role: "PCC Coach", desc: "Master of creating safe spaces for deep internal work." },
        { name: "Shane Tan", role: "Quiet Power Coach", desc: "Specialist in navigating 'quiet burnout' and restoring self-worth." }
      ]
    },
    pricing: {
      title: "Invest in Your State",
      subtitle: "Intimate group. Only 12 spots available for maximum comfort.",
      shared: "Shared Room",
      single: "Single Room",
      popular: "Leader's Choice",
      select: "Select Package",
      book: "Book Single",
      features: ["7 nights accommodation", "Land Cruiser transfers", "Curated nutrition", "Resilience Map", "Private room", "Total confidentiality"]
    },
    download: {
      title: "Explore the Details",
      desc: "Download the full brochure with detailed itinerary, expert profiles, and the scientific basis of the program.",
      button: "Download PDF (12MB)"
    },
    modal: {
      title: "Start Recovery",
      desc: "Leave your details. We will contact you for a brief introductory interview.",
      nameLabel: "Your Name",
      emailLabel: "Email",
      typeLabel: "Preferred Accommodation",
      submit: "Submit Application"
    }
  },
  DE: {
    nav: { about: "Über uns", schedule: "Programm", team: "Team", pricing: "Preise", book: "Bewerben", bookShort: "Bewerben" },
    hero: {
      date: "30. März — 7. April 2026 • Kochi, Japan",
      titlePrefix: "Burnout Bootcamp:",
      titleHighlight: "Wissenschaftlicher Reset",
      desc: "Ein auf Neurowissenschaften basierendes Retreat für Führungskräfte. Setzen Sie Ihr Nervensystem in der Stille der japanischen Berge zurück.",
      ctaApply: "Jetzt bewerben",
      ctaDetails: "Mehr erfahren",
      watchVideo: "Film ansehen"
    },
    stats: { years: "Jahre Erfahrung", participants: "Alumni-Führungskräfte", experts: "Wissenschaftler" },
    about: {
      title: "Erholungslabor",
      desc: "Hochleistung erfordert hochwertige Erholung. Wir haben Spiritualität durch Neurobiologie ersetzt. Ein technischer Ansatz für Ihr Wohlbefinden.",
      neuroTitle: "Neurobiologie des Stress",
      neuroDesc: "Verstehen Sie die Mechanik von Burnout und steuern Sie Ihre Biochemie.",
      toolsTitle: "100+ Werkzeuge",
      toolsDesc: "Ein personalisiertes Toolkit für Notfall-Resets und langfristige Resilienz.",
      japanTitle: "Heilende Umgebung",
      japanDesc: "Zedernwälder, Onsen und die Berge von Kochi — ideal für das parasympathische System."
    },
    schedule: {
      title: "Der Bogen der Erholung",
      subtitle: "8 Tage Eintauchen in Wissenschaft und Natur",
      days: [
        { day: "01", title: "Dekompression", desc: "Ankunft. Übergang in die Stille. Malerische Überquerung der Insel Awaji." },
        { day: "02", title: "Immersion", desc: "Mountain Lodge. Vorträge über Cortisol. Abend im Onsen unter Sternen." },
        { day: "03", title: "Verkörperung", desc: "Faszienarbeit. Kontakt zum Körper. Kinoabend." },
        { day: "04", title: "Digital Detox", desc: "Nikobuchi-Wasserfälle. Totale Abschaltung. Psychologie der Ressourcen." },
        { day: "05", title: "Kontemplation", desc: "Sakura-Blüte. Alte Tempel. Achtsamkeitspraktiken." },
        { day: "06-07", title: "Integration", desc: "Synthese der Erfahrung. Erstellung Ihrer Resilienz-Karte. Abschiedsessen." }
      ]
    },
    team: {
      title: "Ihre Mentoren",
      subtitle: "Eine Synthese aus Harvard-Wissenschaft und Business-Coaching.",
      coaches: [
        { name: "Aksinia Mueller", role: "Stress Scientist, Harvard", desc: "Erforscht biologische Stressmarker. Lehrt Energiemanagement." },
        { name: "Juan Pablo Muñiz", role: "MBA, Co-founder", desc: "Experte für Krisennavigation bei Führungskräften." },
        { name: "Daniel Low", role: "PCC Coach", desc: "Meister im Schaffen sicherer Räume für innere Arbeit." },
        { name: "Shane Tan", role: "Quiet Power Coach", desc: "Spezialist für 'stilles Burnout' und Selbstwertgefühl." }
      ]
    },
    pricing: {
      title: "Investition in sich",
      subtitle: "Kleine Gruppe. Nur 12 Plätze für maximalen Komfort.",
      shared: "Doppelzimmer",
      single: "Einzelzimmer",
      popular: "Beste Wahl",
      select: "Auswählen",
      book: "Einzelzimmer buchen",
      features: ["7 Übernachtungen", "Land Cruiser Transfers", "Kuratierte Ernährung", "Resilienz-Plan", "Privatzimmer", "Totale Diskretion"]
    },
    download: {
      title: "Details erkunden",
      desc: "Laden Sie die vollständige Broschüre mit detailliertem Reiseverlauf und Expertenprofilen herunter.",
      button: "PDF herunterladen (12MB)"
    },
    modal: {
      title: "Erholung starten",
      desc: "Hinterlassen Sie Ihre Daten. Wir melden uns für ein kurzes Kennenlerngespräch.",
      nameLabel: "Ihr Name",
      emailLabel: "E-Mail",
      typeLabel: "Präferenz Unterkunft",
      submit: "Anfrage senden"
    }
  },
  FR: {
    nav: { about: "À propos", schedule: "Programme", team: "Équipe", pricing: "Tarifs", book: "Postuler", bookShort: "Postuler" },
    hero: {
      date: "30 mars — 7 avril 2026 • Kochi, Japon",
      titlePrefix: "Burnout Bootcamp:",
      titleHighlight: "La Science du Reset",
      desc: "Une retraite basée sur les neurosciences pour les dirigeants. Réinitialisez votre système nerveux dans le silence des montagnes japonaises.",
      ctaApply: "Postuler",
      ctaDetails: "En savoir plus",
      watchVideo: "Voir le film"
    },
    stats: { years: "ans d'expérience", participants: "leaders alumni", experts: "scientifiques" },
    about: {
      title: "Laboratoire de Récupération",
      desc: "La haute performance exige une récupération de haute qualité. Nous avons remplacé la spiritualité par la neurobiologie.",
      neuroTitle: "Neurobiologie du Stress",
      neuroDesc: "Comprenez la mécanique du burnout et maîtrisez votre biochimie.",
      toolsTitle: "100+ Outils",
      toolsDesc: "Une boîte à outils personnalisée pour la résilience à long terme.",
      japanTitle: "Environnement Guérisseur",
      japanDesc: "Forêts de cèdres, onsens et montagnes — le contexte idéal pour le système parasympathique."
    },
    schedule: {
      title: "L'Arc de Récupération",
      subtitle: "8 jours d'immersion profonde dans la science et la nature",
      days: [
        { day: "01", title: "Décompression", desc: "Arrivée. Transition vers le silence. Traversée panoramique d'Awaji." },
        { day: "02", title: "Immersion", desc: "Lodge de montagne. Conférences sur le cortisol. Onsen sous les étoiles." },
        { day: "03", title: "Incarnation", desc: "Travail des fascias. Reconnexion au corps. Soirée cinéma." },
        { day: "04", title: "Détox Digitale", desc: "Cascades Nikobuchi. Déconnexion totale. Psychologie de la ressource." },
        { day: "05", title: "Contemplation", desc: "Floraison des sakuras. Temples anciens. Pleine conscience." },
        { day: "06-07", title: "Intégration", desc: "Synthèse de l'expérience. Création de votre Carte de Résilience." }
      ]
    },
    team: {
      title: "Vos Mentors",
      subtitle: "Une synthèse de la science académique et du coaching d'affaires.",
      coaches: [
        { name: "Aksinia Mueller", role: "Stress Scientist, Harvard", desc: "Recherche sur les marqueurs biologiques du stress." },
        { name: "Juan Pablo Muñiz", role: "MBA, Co-founder", desc: "Expert en navigation de crise pour les dirigeants." },
        { name: "Daniel Low", role: "Coach PCC", desc: "Maître dans la création d'espaces sûrs pour le travail intérieur." },
        { name: "Shane Tan", role: "Quiet Power Coach", desc: "Spécialiste du 'burnout silencieux' et de l'estime de soi." }
      ]
    },
    pricing: {
      title: "Investissez en vous",
      subtitle: "Groupe intime. Seulement 12 places.",
      shared: "Chambre Partagée",
      single: "Chambre Simple",
      popular: "Choix des Leaders",
      select: "Sélectionner",
      book: "Réserver Single",
      features: ["7 nuits d'hébergement", "Transferts Land Cruiser", "Nutrition soignée", "Carte de Résilience", "Chambre privée", "Confidentialité totale"]
    },
    download: {
      title: "Explorer les détails",
      desc: "Téléchargez la brochure complète avec l'itinéraire détaillé et les profils des experts.",
      button: "Télécharger PDF (12MB)"
    },
    modal: {
      title: "Commencer",
      desc: "Laissez vos coordonnées. Nous vous contacterons pour un bref entretien.",
      nameLabel: "Votre Nom",
      emailLabel: "Email",
      typeLabel: "Hébergement préféré",
      submit: "Envoyer la demande"
    }
  }
};

// --- COMPONENTS ---

// 1. Reveal Animation Component
const Reveal: React.FC<{ children?: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transitionDelay = `${delay}ms`;

  return (
    <div
      ref={ref}
      style={{ transitionDelay }}
      className={`transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-12 blur-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 2. Main App Component
const BurnoutLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('RU');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = TRANSLATIONS[lang];

  // Logic
  useEffect(() => {
    document.title = "Burnout Lab | Science-Based Recovery";
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 ${isDarkMode ? 'dark bg-stone-950' : 'bg-stone-50'}`}>
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-stone-50/80 dark:bg-stone-950/80 border-stone-200 dark:border-stone-800 backdrop-blur-md py-2' 
          : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center group">
              <span className={`font-serif text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-stone-900 dark:text-stone-50' : 'text-stone-900 dark:text-white'}`}>
                Burnout<span className="text-brand-600 dark:text-brand-500 italic">Lab</span>
              </span>
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                ['#about', t.nav.about],
                ['#schedule', t.nav.schedule],
                ['#team', t.nav.team],
                ['#pricing', t.nav.pricing]
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors tracking-wide">
                  {label}
                </a>
              ))}
              
              <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-2"></div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Language */}
                <div className="relative">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center space-x-1 text-sm font-medium text-stone-700 dark:text-stone-200 hover:opacity-80 transition"
                  >
                    <span>{lang}</span>
                    <ChevronDown size={14} className={`transform transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-100 dark:border-stone-800 overflow-hidden py-1 animate-fade-in-up">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setIsLangMenuOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition ${lang === l.code ? 'text-brand-600 font-semibold' : 'text-stone-600 dark:text-stone-300'}`}
                        >
                          <span>{l.label}</span>
                          {lang === l.code && <CheckCircle size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleModal} className="px-6 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300">
                  {t.nav.book}
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="text-stone-600 dark:text-stone-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-stone-900 dark:text-white">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute w-full bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-8 space-y-6">
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-serif text-stone-900 dark:text-white">{t.nav.about}</a>
            <a href="#schedule" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-serif text-stone-900 dark:text-white">{t.nav.schedule}</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-serif text-stone-900 dark:text-white">{t.nav.pricing}</a>
            
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`py-2 px-4 rounded-lg text-sm border ${lang === l.code ? 'border-brand-500 text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button onClick={() => { setIsMenuOpen(false); toggleModal(); }} className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20">
              {t.nav.book}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 animate-float-slow">
            <source src={VIDEO_BG_MOBILE_URL} media="(max-width: 768px)" />
            <source src={VIDEO_BG_URL} />
          </video>
          {/* Enhanced Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-stone-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 dark:from-stone-950 via-transparent to-stone-900/40"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-20">
          <Reveal>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-8">
              <Calendar className="w-4 h-4 mr-2" />
              {t.hero.date}
            </div>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white tracking-tight leading-[1.1] mb-8 drop-shadow-lg">
              {t.hero.titlePrefix} <br/>
              <span className="italic font-light text-brand-100">{t.hero.titleHighlight}</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg md:text-2xl text-stone-100 max-w-2xl mx-auto leading-relaxed font-light mb-12 drop-shadow-md opacity-90">
              {t.hero.desc}
            </p>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button onClick={toggleModal} className="w-full sm:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                {t.hero.ctaApply}
              </button>
              
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <div className="w-6 h-6 rounded-full bg-white text-stone-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={10} fill="currentColor" />
                </div>
                {t.hero.watchVideo}
              </button>
            </div>
          </Reveal>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
           <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </header>

      {/* Stats Banner */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
        <Reveal className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl shadow-stone-900/10 border border-stone-100 dark:border-stone-800 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-100 dark:divide-stone-800">
           {[
             { val: "4", label: t.stats.years },
             { val: "850+", label: t.stats.participants },
             { val: "30+", label: t.stats.experts }
           ].map((stat, i) => (
             <div key={i} className="text-center pt-8 md:pt-0">
               <div className="text-4xl md:text-5xl font-serif text-stone-900 dark:text-white mb-2">{stat.val}</div>
               <div className="text-sm font-medium text-stone-500 uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </Reveal>
      </section>

      {/* Philosophy (About) */}
      <section id="about" className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div>
               <Reveal>
                 <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-medium mb-6">
                    <span className="w-8 h-px bg-current"></span>
                    <span className="uppercase tracking-widest text-xs">Philosophy</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-serif text-stone-900 dark:text-white mb-8 leading-tight">
                   {t.about.title}
                 </h2>
               </Reveal>
               <Reveal delay={100}>
                 <p className="text-xl text-stone-600 dark:text-stone-300 mb-12 leading-relaxed font-light">
                   {t.about.desc}
                 </p>
               </Reveal>

               <div className="space-y-8">
                  {[
                    { icon: Brain, title: t.about.neuroTitle, desc: t.about.neuroDesc },
                    { icon: Shield, title: t.about.toolsTitle, desc: t.about.toolsDesc },
                    { icon: Leaf, title: t.about.japanTitle, desc: t.about.japanDesc }
                  ].map((item, idx) => (
                    <Reveal key={idx} delay={200 + idx * 100}>
                      <div className="flex gap-6 group cursor-default">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-900 dark:text-white group-hover:bg-brand-600 group-hover:text-white transition-colors duration-500">
                          <item.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-stone-900 dark:text-white mb-2">{item.title}</h3>
                          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
               </div>
             </div>

             <div className="relative">
                <Reveal delay={200}>
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200&auto=format&fit=crop" 
                      alt="Japan Nature" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <p className="font-serif italic text-2xl opacity-90">"Nature does not hurry, yet everything is accomplished."</p>
                    </div>
                  </div>
                </Reveal>
                
                {/* Floating Card */}
                <div className="absolute -bottom-10 -left-10 md:bottom-20 md:-left-20 z-10 hidden md:block">
                  <Reveal delay={400}>
                    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 dark:border-stone-700 max-w-xs">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-lg"><Waves size={20}/></div>
                         <div>
                           <div className="text-xs text-stone-500 uppercase">Cortisol Level</div>
                           <div className="font-bold text-stone-900 dark:text-white">-45% in 4 days</div>
                         </div>
                       </div>
                       <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 w-[55%] rounded-full"></div>
                       </div>
                    </div>
                  </Reveal>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Itinerary (Horizontal Scroll on Mobile, Grid on Desktop) */}
      <section id="schedule" className="py-32 bg-stone-100 dark:bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 dark:text-white mb-6">{t.schedule.title}</h2>
              <p className="text-xl text-stone-600 dark:text-stone-400">{t.schedule.subtitle}</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.schedule.days.map((item, index) => (
              <Reveal key={index} delay={index * 100} className="h-full">
                <div className="h-full group bg-white dark:bg-stone-900 p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 font-serif text-9xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 select-none">
                    {index + 1}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 text-xs font-bold uppercase tracking-wider mb-6">
                    Day {item.day}
                  </div>
                  <h3 className="text-2xl font-serif text-stone-900 dark:text-white mb-4 group-hover:text-brand-600 transition-colors">{item.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-32 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
             <h2 className="text-4xl md:text-5xl font-serif text-stone-900 dark:text-white mb-6">{t.team.title}</h2>
             <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mb-16">{t.team.subtitle}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {t.team.coaches.map((coach, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group">
                  <div className="mb-6 overflow-hidden rounded-2xl bg-stone-100 aspect-[4/5] relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${coach.name}&backgroundColor=e5e5e5`} 
                      alt={coach.name} 
                      className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 dark:text-white">{coach.name}</h3>
                  <p className="text-brand-600 text-sm font-medium uppercase tracking-wide mb-3">{coach.role}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{coach.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-stone-900 text-stone-50 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">{t.pricing.title}</h2>
              <p className="text-stone-400 text-lg">{t.pricing.subtitle}</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <Reveal>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-colors duration-300 h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-serif mb-2 text-white">{t.pricing.shared}</h3>
                  <div className="text-sm text-stone-400">{t.pricing.subtitle}</div>
                </div>
                <div className="text-5xl font-light text-white mb-8">$2,390</div>
                <div className="flex-grow space-y-4 mb-10">
                  {t.pricing.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-start text-stone-300">
                      <CheckCircle size={18} className="text-stone-500 mr-3 mt-1 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={toggleModal} className="w-full py-4 border border-white/20 hover:bg-white hover:text-stone-900 text-white rounded-xl transition-all duration-300">
                  {t.pricing.select}
                </button>
              </div>
            </Reveal>

            {/* Card 2 (Highlighted) */}
            <Reveal delay={100}>
              <div className="bg-white text-stone-900 rounded-3xl p-10 relative shadow-2xl shadow-black/20 transform hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
                  {t.pricing.popular}
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-serif mb-2">{t.pricing.single}</h3>
                  <div className="text-sm text-stone-500">Maximum privacy</div>
                </div>
                <div className="text-5xl font-light text-stone-900 mb-8">$2,890</div>
                <div className="flex-grow space-y-4 mb-10">
                  {t.pricing.features.map((f, i) => (
                    <div key={i} className="flex items-start text-stone-700">
                      <CheckCircle size={18} className="text-brand-600 mr-3 mt-1 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={toggleModal} className="w-full py-4 bg-stone-900 hover:bg-brand-600 text-white rounded-xl transition-colors duration-300 font-medium">
                  {t.pricing.book}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-24 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <Reveal>
              <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-brand-600">
                 <Download size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-serif text-stone-900 dark:text-white mb-6">{t.download.title}</h2>
              <p className="text-stone-600 dark:text-stone-400 mb-10 leading-relaxed">{t.download.desc}</p>
              <a 
                href={PDF_URL} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                {t.download.button}
                <ArrowRight size={18} className="ml-2" />
              </a>
            </Reveal>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <span className="font-serif text-2xl text-white">Burnout<span className="italic text-brand-600">Lab</span></span>
            <p className="mt-4 max-w-xs text-stone-500">Scientific approach to wellbeing for high-performers. <br/>Kochi, Japan.</p>
          </div>
          <div className="mt-10 md:mt-0 flex flex-wrap gap-8">
             {['Instagram', 'LinkedIn', 'Email', 'Privacy Policy'].map(link => (
               <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
             ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-900 flex justify-between items-center text-xs text-stone-600">
           <p>© 2026 Burnout Lab. All rights reserved.</p>
           <p>Designed with science.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl border border-stone-100 dark:border-stone-800">
            <button onClick={toggleModal} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h3 className="text-3xl font-serif text-stone-900 dark:text-white mb-2">{t.modal.title}</h3>
              <p className="text-stone-500">{t.modal.desc}</p>
            </div>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thank you! We'll be in touch."); toggleModal(); }}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{t.modal.nameLabel}</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-transparent focus:bg-white focus:border-brand-500 focus:ring-0 transition-all text-stone-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{t.modal.emailLabel}</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-transparent focus:bg-white focus:border-brand-500 focus:ring-0 transition-all text-stone-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{t.modal.typeLabel}</label>
                <select className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-transparent focus:bg-white focus:border-brand-500 focus:ring-0 transition-all text-stone-900 dark:text-white appearance-none">
                  <option value="single">Single Room ($2,890)</option>
                  <option value="shared">Shared Room ($2,390)</option>
                </select>
              </div>
              <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 mt-4">
                {t.modal.submit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 animate-fade-in-up p-4">
           <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50">
              <X size={32} />
           </button>
           <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black relative border border-stone-800">
              <iframe
                src="https://player.vimeo.com/video/1148374974?autoplay=1&title=0&byline=0&portrait=0"
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
           </div>
        </div>
      )}
    </div>
  );
};

export default BurnoutLanding;