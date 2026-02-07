import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Users, Brain, BatteryCharging, Mountain, ArrowRight, 
  CheckCircle, Menu, X, Moon, Sun, ChevronDown, Play, Download, 
  Feather, Repeat, Coffee, Leaf, Shield, Waves, Mic, MicOff, Sparkles, Loader2, AlertCircle, RefreshCw,
  MessageCircle, Send, FileText
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

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
  quiz: { title: string; subtitle: string; button: string; bubbleBot1: string; bubbleUser: string; bubbleBot2: string; magnetTitle: string };
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
    quiz: {
      title: "На каком уровне ваше выгорание?",
      subtitle: "Пройдите 3-минутный квиз в Telegram и получите PDF-гайд «Топ-5 техник мгновенного снятия стресса» бесплатно.",
      button: "Запустить тест в Telegram",
      bubbleBot1: "Привет! Измерим уровень кортизола?",
      bubbleUser: "Да, давай начнем",
      bubbleBot2: "Отлично! Держи свой гайд 🎁",
      magnetTitle: "Гайд: Снятие стресса.pdf"
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
    quiz: {
      title: "What is your Burnout Score?",
      subtitle: "Take our 3-minute Telegram quiz and instantly get the 'Top 5 Stress Relief Protocols' PDF guide.",
      button: "Start Quiz in Telegram",
      bubbleBot1: "Hi! Ready to measure your cortisol risk?",
      bubbleUser: "Yes, let's start",
      bubbleBot2: "Great! Here is your free guide 🎁",
      magnetTitle: "Guide: Stress Relief.pdf"
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
    quiz: {
      title: "Wie hoch ist Ihr Burnout-Risiko?",
      subtitle: "Machen Sie das 3-Minuten-Quiz auf Telegram und erhalten Sie den PDF-Leitfaden 'Top 5 Techniken zum Stressabbau'.",
      button: "Quiz in Telegram starten",
      bubbleBot1: "Hallo! Wollen wir Ihr Cortisol messen?",
      bubbleUser: "Ja, starten",
      bubbleBot2: "Super! Hier ist dein Guide 🎁",
      magnetTitle: "Guide: Stressabbau.pdf"
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
    quiz: {
      title: "Quel est votre niveau d'épuisement?",
      subtitle: "Répondez au quiz de 3 minutes sur Telegram et recevez gratuitement le guide 'Top 5 Techniques Anti-Stress'.",
      button: "Lancer le quiz sur Telegram",
      bubbleBot1: "Bonjour! Prêt à mesurer votre cortisol?",
      bubbleUser: "Oui, allons-y",
      bubbleBot2: "Parfait! Voici votre guide 🎁",
      magnetTitle: "Guide: Anti-Stress.pdf"
    },
    pricing: {
      title: "Investissez en vous",
      subtitle: "Groupe intime. Seulement 12 places.",
      shared: "Chambre Partagée",
      single: "Chambre Simple",
      popular: "Choix des Leaders",
      select: "Sélectionner",
      book: "Réserver Single",
      features: ["7 nights accommodation", "Land Cruiser transfers", "Curated nutrition", "Resilience Map", "Private room", "Total confidentiality"]
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

// --- AUDIO UTILS ---

function createBlob(data: Float32Array, sampleRate: number): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Custom byte encoding to string to base64
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return {
    data: btoa(binary),
    mimeType: `audio/pcm;rate=${sampleRate}`,
  };
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


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
      className={`transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 2. Preloader Component
const Preloader: React.FC<{ fadeOut: boolean }> = ({ fadeOut }) => {
  return (
    <div className={`fixed inset-0 z-[100] bg-stone-950 flex flex-col items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative mb-6">
        <Brain size={64} className="text-brand-600 animate-pulse-slow relative z-10" strokeWidth={1} />
        <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse"></div>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase mb-2">
        Burnout<span className="text-brand-600 italic">Lab</span>
      </h1>
      <p className="text-stone-500 text-xs tracking-[0.4em] uppercase font-light">Science of Reset</p>
      
      {/* Progress Line */}
      <div className="mt-12 h-[1px] w-48 bg-stone-900 overflow-hidden relative rounded-full">
         <div className="absolute inset-0 bg-stone-800 w-full"></div>
         <div className="h-full bg-gradient-to-r from-brand-900 to-brand-500 transition-all duration-[2000ms] ease-out w-full origin-left animate-grow"></div>
      </div>
    </div>
  );
};

// 3. Quiz / Telegram Section Component
const QuizSection: React.FC<{ t: ContentText['quiz'] }> = ({ t }) => {
  return (
    <section className="py-24 px-4 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-brand-900 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left Column: Copy */}
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6">
                  <Sparkles size={16} className="mr-2 text-yellow-300" />
                  Free Lead Magnet
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  {t.title}
                </h2>
                <p className="text-indigo-100 text-lg md:text-xl mb-10 leading-relaxed opacity-90">
                  {t.subtitle}
                </p>
                <a 
                  href="https://t.me/your_bot_link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-900/50"
                >
                  <MessageCircle size={20} className="mr-3" />
                  {t.button}
                </a>
              </div>

              {/* Right Column: Visual Gamification */}
              <div className="relative animate-float">
                {/* Phone Frame */}
                <div className="mx-auto max-w-[320px] bg-stone-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-500">
                  <div className="bg-stone-900/50 rounded-[2rem] p-4 h-[380px] flex flex-col justify-end space-y-4 relative overflow-hidden">
                    {/* Bot Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-stone-800/50 border-b border-white/5 flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                         <Brain size={16} className="text-white" />
                       </div>
                       <div>
                         <div className="text-white text-xs font-bold">BurnoutBot AI</div>
                         <div className="text-indigo-300 text-[10px]">bot</div>
                       </div>
                    </div>

                    {/* Chat Bubbles */}
                    <div className="flex justify-start">
                      <div className="bg-white/10 backdrop-blur-md text-white/90 rounded-2xl rounded-tl-none py-3 px-4 text-xs max-w-[85%] shadow-sm animate-fade-in-up">
                        {t.bubbleBot1}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-brand-600 text-white rounded-2xl rounded-tr-none py-3 px-4 text-xs max-w-[85%] shadow-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                         {t.bubbleUser}
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white/10 backdrop-blur-md text-white/90 rounded-2xl rounded-tl-none py-3 px-4 text-xs max-w-[85%] shadow-sm animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                         <p className="mb-2">{t.bubbleBot2}</p>
                         <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2 border border-white/10">
                            <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center">
                              <FileText size={16} />
                            </div>
                            <span className="text-[10px] font-mono text-white/70">{t.magnetTitle}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500 rounded-full blur-[80px] opacity-40"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40"></div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// 4. Voice Assistant Component
const VoiceAssistant: React.FC<{ content: ContentText; lang: Language }> = ({ content, lang }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const retryTimeoutRef = useRef<any>(null);

  const cleanup = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    sessionRef.current = null;
  };

  const disconnect = () => {
    cleanup();
    setIsActive(false);
    setIsConnecting(false);
    setError(null);
    setRetryCount(0);
  };

  const handleError = (err: any) => {
    cleanup();
    setIsConnecting(false);
    
    console.error("Voice Assistant Error:", err);

    let message = "Connection failed.";
    let isRetryable = true;

    // Handle Specific Errors
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      message = "Microphone access denied. Please enable permissions.";
      isRetryable = false;
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      message = "No microphone found on this device.";
      isRetryable = false;
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      message = "Microphone is busy or unavailable.";
      isRetryable = false;
    } else if (err.message && (err.message.includes("API Key") || err.message.includes("403"))) {
      message = "Configuration Error: Invalid API Key.";
      isRetryable = false;
    }

    // Automatic Retry Logic
    if (isRetryable && retryCount < 3) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      setError(`${message} Retrying... (${nextRetry}/3)`);
      
      retryTimeoutRef.current = setTimeout(() => {
        connect(true);
      }, 2000 * nextRetry);
    } else {
      setError(message);
      setIsActive(false); // Ensure we are in a state where the error card can be displayed if we want, 
                          // or let the UI handle the 'error && !isActive' state.
    }
  };

  const connect = async (isRetry = false) => {
    // Explicitly check for API Key before attempting connection
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
    if (!apiKey) {
      console.error("API Key is missing");
      setError("Configuration Error: API Key is missing. Please check your environment variables.");
      return;
    }

    if (!isRetry) {
      setError(null);
      setRetryCount(0);
    }
    setIsConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // Detailed System Instruction
      const systemInstruction = `
        You are the AI concierge for 'Burnout Lab Japan'.
        
        PRIMARY DIRECTIVE:
        You must frame every answer through the lens of NEUROBIOLOGY and an ENGINEERING APPROACH to wellbeing.
        - We do not "heal souls"; we "regulate the autonomic nervous system".
        - We do not do "meditation"; we do "attentional control training".
        - We do not just "relax"; we "down-regulate cortisol and activate the parasympathetic response".
        
        SPECIFIC ENGINEERING PROTOCOLS:
        - Instead of "deep breathing", describe "Box Breathing (4-4-4-4) to mechanically stimulate the vagus nerve".
        - Instead of "positive thinking", describe "Cognitive Reframing using Cognitive Behavioral Therapy (CBT) principles to rewrite neural pathways".
        - Instead of "nature walks", describe "Phytoncide exposure in cedar forests to lower heart rate variability (HRV)".
        - Instead of "hot springs", describe "Hydrotherapy for vasodilation and muscle recovery".

        Persona: Professional, grounded, scientifically literate, empathetic. NOT spiritual.
        Language: ${LANGUAGES.find(l => l.code === lang)?.label || lang}.

        GOAL: Guide the user to decide if the retreat is right for them. YOU MUST BE PROACTIVE.
        
        CONVERSATION FLOW:
        - Answer the user's question concisely (<50 words).
        - IMMEDIATELY ask a relevant follow-up question to deepen the conversation.
        - Examples:
          - If asked about the SCHEDULE: Ask "Are you more interested in the physical recovery protocols (fascia work, onsens) or the cognitive regulation techniques (attentional control)?"
          - If asked about PRICING: Ask "Are you looking for a private sanctuary (Single Room) or comfortable shared accommodation?"
          - If asked about LOCATION: Ask "Have you experienced the physiological benefits of forest bathing (phytoncides) before?"
          - General: Ask "On a scale of 1-10, how high is your current cortisol load?"

        CONTEXT:
        - Location: Kochi, Japan (leveraging phytoncides in cedar forests and thermoregulation in onsens).
        - Price: $2,890 (Single), $2,390 (Shared).

        GUIDELINES:
        - Keep answers short.
        - Always end with a question.
      `;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            console.log("Session opened");
            setIsActive(true);
            setIsConnecting(false);
            setError(null);
            setRetryCount(0);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const highPass = inputCtx.createBiquadFilter();
            highPass.type = 'highpass';
            highPass.frequency.value = 85;

            const scriptProcessor = inputCtx.createScriptProcessor(2048, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData, inputCtx.sampleRate);
              sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(highPass);
            highPass.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: any) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const audioBytes = decodeBase64(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, outputCtx, 24000, 1);
              
              const now = outputCtx.currentTime;
              const startTime = Math.max(now, nextStartTimeRef.current);
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              source.onended = () => {
                sourcesRef.current.delete(source);
              };
              
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            
             if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = outputCtx.currentTime;
             }
          },
          onclose: () => {
            console.log("Session closed");
            // If we are not in an error state (retry logic), clean up
            if (retryCount === 0) cleanup();
            setIsActive(false);
            setIsConnecting(false);
          },
          onerror: (err) => {
            handleError(err);
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (e) {
      handleError(e);
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, [lang]); 

  // Render Logic:
  // 1. If not active, not connecting, and NO error -> Show Bubble
  if (!isActive && !isConnecting && !error) {
    return (
      <button 
        onClick={() => connect(false)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        aria-label="Start Voice Assistant"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>
    );
  }

  // 2. Otherwise (Active, Connecting, or Error) -> Show Card
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="bg-white/90 dark:bg-stone-900/95 backdrop-blur-xl border border-white/20 dark:border-stone-700 p-6 rounded-3xl shadow-2xl w-72 flex flex-col items-center text-center">
        
        {/* Status Icon */}
        <div className="mb-4 relative">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500 ${
            error ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500' :
            isConnecting ? 'bg-stone-200 dark:bg-stone-800' : 
            'bg-brand-100 dark:bg-brand-900/30 text-brand-600'
          }`}>
            {error ? (
              <AlertCircle size={28} />
            ) : isConnecting ? (
              <Loader2 size={24} className="animate-spin text-stone-500" />
            ) : (
              <div className="relative">
                 <Mic size={28} />
                 <div className="absolute inset-0 bg-brand-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            )}
          </div>
        </div>

        {/* Status Text */}
        <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-white mb-1">
          {error ? "Connection Issue" : isConnecting ? "Connecting..." : "I'm Listening"}
        </h3>
        
        <p className={`text-xs mb-6 px-2 ${error ? "text-red-600 dark:text-red-400" : "text-stone-500 dark:text-stone-400"}`}>
          {error ? error : isConnecting ? "Establishing secure connection" : `Ask me anything about the retreat in ${LANGUAGES.find(l => l.code === lang)?.label}`}
        </p>

        {/* Action Button */}
        {error ? (
          <div className="flex gap-2 w-full">
            <button 
              onClick={disconnect}
              className="flex-1 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => connect(false)}
              className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        ) : (
          <button 
            onClick={disconnect}
            className="w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MicOff size={16} />
            End Session
          </button>
        )}
      </div>
    </div>
  );
};


// 5. Hero Component
const Hero: React.FC<{ 
  t: ContentText; 
  toggleModal: () => void; 
  setIsVideoModalOpen: (open: boolean) => void; 
}> = ({ t, toggleModal, setIsVideoModalOpen }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;

      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isMobile || prefersReducedMotion) {
        videoRef.current.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      const scrolled = window.scrollY;
      videoRef.current.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (spotlightRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 40%)`;
    }
  };

  return (
    <header 
      className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-stone-900 cursor-default"
      onMouseMove={handleMouseMove}
    >
        {/* Parallax Video Container */}
        <div 
            ref={videoRef} 
            className="absolute inset-0 z-0 will-change-transform"
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-110">
            <source src={VIDEO_BG_MOBILE_URL} media="(max-width: 768px)" />
            <source src={VIDEO_BG_URL} />
          </video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-stone-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 dark:from-stone-950 via-transparent to-stone-900/40"></div>
        </div>

        {/* Interactive Spotlight */}
        <div 
          ref={spotlightRef}
          className="absolute inset-0 z-1 pointer-events-none transition-opacity duration-500"
          style={{ background: 'radial-gradient(800px circle at 50% 50%, rgba(255,255,255,0.08), transparent 40%)' }}
        />

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center mt-20">
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70 z-20">
           <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
    </header>
  );
};


// 6. Main App Component
const BurnoutLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('RU');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading sequence
    const timer1 = setTimeout(() => setFadeOut(true), 2200);
    const timer2 = setTimeout(() => setIsLoading(false), 3200);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

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
      
      {/* Preloader */}
      {isLoading && <Preloader fadeOut={fadeOut} />}

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
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Language */}
                <div className="relative">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center space-x-1 text-sm font-medium text-stone-700 dark:text-stone-200 hover:opacity-80 transition"
                    aria-label="Select language"
                    aria-expanded={isLangMenuOpen}
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
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-stone-900 dark:text-white"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
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
      <Hero t={t} toggleModal={toggleModal} setIsVideoModalOpen={setIsVideoModalOpen} />

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

      {/* Quiz / Telegram Section */}
      <QuizSection t={t.quiz} />

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
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-900 flex justify-between items-center text-xs text-stone-500">
           <p>© 2026 Burnout Lab. All rights reserved.</p>
           <p>Designed with science.</p>
        </div>
      </footer>
      
      {/* Voice Assistant */}
      <VoiceAssistant content={t} lang={lang} />

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl border border-stone-100 dark:border-stone-800">
            <button 
              onClick={toggleModal} 
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h3 className="text-3xl font-serif text-stone-900 dark:text-white mb-2">{t.modal.title}</h3>
              <p className="text-stone-500">{t.modal.desc}</p>
            </div>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thank you! We'll be in touch."); toggleModal(); }}>
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{t.modal.nameLabel}</label>
                <input id="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-transparent focus:bg-white focus:border-brand-500 focus:ring-0 transition-all text-stone-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{t.modal.emailLabel}</label>
                <input id="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-transparent focus:bg-white focus:border-brand-500 focus:ring-0 transition-all text-stone-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="room-type" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{t.modal.typeLabel}</label>
                <select id="room-type" className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-transparent focus:bg-white focus:border-brand-500 focus:ring-0 transition-all text-stone-900 dark:text-white appearance-none">
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
           <button 
             onClick={() => setIsVideoModalOpen(false)} 
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
             aria-label="Close video"
           >
              <X size={32} />
           </button>
           <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black relative border border-stone-800">
              <iframe
                src="https://player.vimeo.com/video/1148374974?autoplay=1&title=0&byline=0&portrait=0"
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Burnout Bootcamp Video"
              ></iframe>
           </div>
        </div>
      )}
    </div>
  );
};

export default BurnoutLanding;