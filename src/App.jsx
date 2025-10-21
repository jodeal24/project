// src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Play, Globe, LogIn, LogOut, UploadCloud, Plus, Video, Film,
  Captions, Headphones, Settings, X, ChevronRight, ChevronLeft, Pencil, Trash2
} from "lucide-react";

// shadcn/ui components – make sure these exist under src/components/ui/
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";

/**
 * StreamJoy — Vite + React version (client-only)
 * - Admin login via dialog (no browser prompt)
 * - Create + Edit + Delete Series / Seasons / Episodes
 * - Language switcher
 * - Player with external audio sync + subtitles
 * - Demo persistence via localStorage (per-browser)
 *
 * Admin password:
 *   const ADMIN_PW = import.meta.env.VITE_STREAMJOY_ADMIN || "admin";
 * Set VITE_STREAMJOY_ADMIN in Vercel → Environment Variables (optional).
 */

const ADMIN_PW = import.meta.env.VITE_STREAMJOY_ADMIN || "admin";

// ------------------------- Simple i18n -------------------------
const MESSAGES = {
  en: {
    appName: "StreamJoy",
    search: "Search",
    series: "Series",
    seasons: "Seasons",
    season: "Season",
    episodes: "Episodes",
    play: "Play",
    audio: "Audio",
    subtitles: "Subtitles",
    off: "Off",
    admin: "Admin",
    login: "Log in",
    logout: "Log out",
    adminOnly: "Admin only",
    addSeries: "Add Series",
    addSeason: "Add Season",
    addEpisode: "Add Episode",
    editSeries: "Edit Series",
    editEpisode: "Edit Episode",
    deleteSeries: "Delete Series",
    deleteEpisode: "Delete Episode",
    title: "Title",
    description: "Description",
    posterUrl: "Poster URL",
    backdropUrl: "Backdrop URL (optional)",
    videoUrl: "Video URL (.mp4 / .m3u8)",
    subtitleUrl: "Subtitles (.vtt)",
    subtitleLang: "Subtitle language code",
    audioLabel: "Audio label (e.g., English)",
    audioUrl: "Audio URL (mp3/m4a)",
    language: "Language",
    interfaceLanguage: "Interface language",
    chooseLanguage: "Choose language",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    password: "Password",
    wrongPassword: "Wrong password",
    familyTagline: "Family-friendly streaming, simple and elegant",
    libraryEmpty: "Your library is empty. Add a series from Admin → Add Series.",
  },
  pt: {
    appName: "StreamJoy",
    search: "Pesquisar",
    series: "Séries",
    seasons: "Temporadas",
    season: "Temporada",
    episodes: "Episódios",
    play: "Reproduzir",
    audio: "Áudio",
    subtitles: "Legendas",
    off: "Desligado",
    admin: "Admin",
    login: "Entrar",
    logout: "Sair",
    adminOnly: "Somente administrador",
    addSeries: "Adicionar Série",
    addSeason: "Adicionar Temporada",
    addEpisode: "Adicionar Episódio",
    editSeries: "Editar Série",
    editEpisode: "Editar Episódio",
    deleteSeries: "Eliminar Série",
    deleteEpisode: "Eliminar Episódio",
    title: "Título",
    description: "Descrição",
    posterUrl: "URL do poster",
    backdropUrl: "URL do backdrop (opcional)",
    videoUrl: "URL do vídeo (.mp4 / .m3u8)",
    subtitleUrl: "Legendas (.vtt)",
    subtitleLang: "Código do idioma da legenda",
    audioLabel: "Rótulo do áudio (ex.: Português)",
    audioUrl: "URL do áudio (mp3/m4a)",
    language: "Idioma",
    interfaceLanguage: "Idioma da interface",
    chooseLanguage: "Escolher idioma",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Guardar",
    password: "Palavra-passe",
    wrongPassword: "Palavra-passe incorreta",
    familyTagline: "Streaming para a família — simples e elegante",
    libraryEmpty: "A sua biblioteca está vazia. Adicione uma série em Admin → Adicionar Série.",
  },
  fr: {
    appName: "StreamJoy",
    search: "Rechercher",
    series: "Séries",
    seasons: "Saisons",
    season: "Saison",
    episodes: "Épisodes",
    play: "Lecture",
    audio: "Audio",
    subtitles: "Sous-titres",
    off: "Désactivé",
    admin: "Admin",
    login: "Se connecter",
    logout: "Se déconnecter",
    adminOnly: "Administrateur uniquement",
    addSeries: "Ajouter une série",
    addSeason: "Ajouter une saison",
    addEpisode: "Ajouter un épisode",
    editSeries: "Modifier la série",
    editEpisode: "Modifier l’épisode",
    deleteSeries: "Supprimer la série",
    deleteEpisode: "Supprimer l’épisode",
    title: "Titre",
    description: "Description",
    posterUrl: "URL de l’affiche",
    backdropUrl: "URL du fond (facultatif)",
    videoUrl: "URL de la vidéo (.mp4 / .m3u8)",
    subtitleUrl: "Sous-titres (.vtt)",
    subtitleLang: "Code langue des sous-titres",
    audioLabel: "Libellé audio (ex.: Français)",
    audioUrl: "URL audio (mp3/m4a)",
    language: "Langue",
    interfaceLanguage: "Langue de l’interface",
    chooseLanguage: "Choisir la langue",
    confirm: "Confirmer",
    cancel: "Annuler",
    save: "Enregistrer",
    password: "Mot de passe",
    wrongPassword: "Mauvais mot de passe",
    familyTagline: "Streaming familial — simple et esthétique",
    libraryEmpty: "Votre bibliothèque est vide. Ajoutez une série via Admin → Ajouter une série.",
  },
  de: {
    appName: "StreamJoy",
    search: "Suchen",
    series: "Serien",
    seasons: "Staffeln",
    season: "Staffel",
    episodes: "Episoden",
    play: "Abspielen",
    audio: "Audio",
    subtitles: "Untertitel",
    off: "Aus",
    admin: "Admin",
    login: "Anmelden",
    logout: "Abmelden",
    adminOnly: "Nur Admin",
    addSeries: "Serie hinzufügen",
    addSeason: "Staffel hinzufügen",
    addEpisode: "Episode hinzufügen",
    editSeries: "Serie bearbeiten",
    editEpisode: "Episode bearbeiten",
    deleteSeries: "Serie löschen",
    deleteEpisode: "Episode löschen",
    title: "Titel",
    description: "Beschreibung",
    posterUrl: "Poster-URL",
    backdropUrl: "Backdrop-URL (optional)",
    videoUrl: "Video-URL (.mp4 / .m3u8)",
    subtitleUrl: "Untertitel (.vtt)",
    subtitleLang: "Untertitel-Sprachcode",
    audioLabel: "Audio-Bezeichnung (z. B. Deutsch)",
    audioUrl: "Audio-URL (mp3/m4a)",
    language: "Sprache",
    interfaceLanguage: "Interface-Sprache",
    chooseLanguage: "Sprache wählen",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    save: "Speichern",
    password: "Passwort",
    wrongPassword: "Falsches Passwort",
    familyTagline: "Familienfreundliches Streaming — schlicht & schön",
    libraryEmpty: "Ihre Bibliothek ist leer. Fügen Sie eine Serie über Admin → Serie hinzufügen hinzu.",
  },
  lb: {
    appName: "StreamJoy",
    search: "Sichen",
    series: "Serie(n)",
    seasons: "Staffelen",
    season: "Staffel",
    episodes: "Episoden",
    play: "Ofspillen",
    audio: "Audio",
    subtitles: "Ënnertitelen",
    off: "Aus",
    admin: "Admin",
    login: "Aloggen",
    logout: "Ausloggen",
    adminOnly: "Nëmmen Admin",
    addSeries: "Serie derbäisetzen",
    addSeason: "Staffel derbäisetzen",
    addEpisode: "Episod derbäisetzen",
    editSeries: "Serie änneren",
    editEpisode: "Episod änneren",
    deleteSeries: "Serie läschen",
    deleteEpisode: "Episod läschen",
    title: "Titel",
    description: "Beschreiwung",
    posterUrl: "Poster-URL",
    backdropUrl: "Hannergrond-URL (optional)",
    videoUrl: "Video-URL (.mp4 / .m3u8)",
    subtitleUrl: "Ënnertitelen (.vtt)",
    subtitleLang: "Sproochcode vun den Ënnertitelen",
    audioLabel: "Audio-Label (z. B. Lëtzebuergesch)",
    audioUrl: "Audio-URL (mp3/m4a)",
    language: "Sprooch",
    interfaceLanguage: "Sprooch vun der Interface",
    chooseLanguage: "Sprooch wielen",
    confirm: "Confirméieren",
    cancel: "Ofbriechen",
    save: "Späicheren",
    password: "Passwuert",
    wrongPassword: "Falscht Passwuert",
    familyTagline: "Familljefrëndlecht Streaming — einfach & ästhetesch",
    libraryEmpty: "Deng Bibliothéik ass eidel. Setz eng Serie derbäi iwwer Admin → Serie derbäisetzen.",
  },
};

// ------------------------- Demo storage -------------------------
const STORAGE_KEY = "streamjoy_db_v1";

function safeLoadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { series: [] };
  } catch {
    return { series: [] };
  }
}
function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// Data shapes (comment):
// Series: { id, title, description, posterUrl, backdropUrl, seasons: [Season] }
// Season: { id, number, episodes: [Episode] }
// Episode: { id, title, number, description, videoUrl, audios:[{label,url}], subtitles:[{lang,url}] }

// ------------------------- UI Helpers -------------------------
const Section = ({ title, children, icon: Icon }) => (
  <section className="mt-8">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-5 h-5" />}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    {children}
  </section>
);

const PosterCard = ({ item, onClick }) => (
  <Card className="bg-white/5 hover:bg-white/10 transition rounded-2xl overflow-hidden cursor-pointer" onClick={onClick}>
    <div
      className="aspect-[2/3] w-40 md:w-44 lg:w-48 bg-white/5"
      style={{ backgroundImage: `url(${item.posterUrl || ""})`, backgroundSize: "cover", backgroundPosition: "center" }}
    />
    <CardContent className="p-3">
      <div className="text-sm font-medium line-clamp-2">{item.title}</div>
    </CardContent>
  </Card>
);

const Row = ({ title, items, onItem }) => {
  const scrollRef = useRef(null);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })}>
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2">
        {items.map((s) => (
          <PosterCard key={s.id} item={s} onClick={() => onItem(s)} />
        ))}
      </div>
    </div>
  );
};

// ------------------------- Player with multi-audio & subs -------------------------
function Player({ episode, t, onClose }) {
  const videoRef = useRef(null);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose?.(); }}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black text-white">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full bg-black"
            controls
            poster={episode.backdropUrl || episode.posterUrl}
          >
            <source src={episode.videoUrl} />
          </video>

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 border-white/20"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>

        <div className="p-4 bg-gradient-to-b from-black to-zinc-900">
          <h3 className="text-xl font-semibold mb-1">{episode.title}</h3>
          {episode.description && (
            <p className="text-sm text-white/80">{episode.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


// ------------------------- Admin Panels -------------------------
function AdminPanel({ db, setDB, t }) {
  const [openSeries, setOpenSeries] = useState(null);

  const addSeries = (s) => {
    const next = { ...db, series: [...db.series, { ...s, id: crypto.randomUUID(), seasons: [] }] };
    setDB(next); saveDB(next);
  };
  const updateSeries = (seriesId, patch) => {
    const next = { ...db, series: db.series.map((s) => (s.id === seriesId ? { ...s, ...patch } : s)) };
    setDB(next); saveDB(next);
  };
  const deleteSeries = (seriesId) => {
    const next = { ...db, series: db.series.filter((s) => s.id !== seriesId) };
    setDB(next); saveDB(next);
  };
  const addSeason = (seriesId, number) => {
    const next = { ...db };
    const s = next.series.find((x) => x.id === seriesId);
    if (!s) return;
    s.seasons.push({ id: crypto.randomUUID(), number, episodes: [] });
    setDB(next); saveDB(next);
  };
  const addEpisode = (seriesId, seasonId, ep) => {
    const next = { ...db };
    const s = next.series.find((x) => x.id === seriesId);
    const se = s?.seasons.find((x) => x.id === seasonId);
    if (!se) return;
    se.episodes.push({ id: crypto.randomUUID(), ...ep });
    setDB(next); saveDB(next);
  };
  const updateEpisode = (seriesId, seasonId, episodeId, patch) => {
    const next = { ...db };
    const s = next.series.find((x) => x.id === seriesId);
    const se = s?.seasons.find((x) => x.id === seasonId);
    if (!se) return;
    se.episodes = se.episodes.map((e) => (e.id === episodeId ? { ...e, ...patch } : e));
    setDB(next); saveDB(next);
  };
  const deleteEpisode = (seriesId, seasonId, episodeId) => {
    const next = { ...db };
    const s = next.series.find((x) => x.id === seriesId);
    const se = s?.seasons.find((x) => x.id === seasonId);
    if (!se) return;
    se.episodes = se.episodes.filter((e) => e.id !== episodeId);
    setDB(next); saveDB(next);
  };

  return (
    <div className="space-y-6">
      <Section title={`${t.addSeries}`} icon={Film}>
        <SeriesForm t={t} onSubmit={addSeries} />
      </Section>

      <Section title={`${t.addSeason} / ${t.addEpisode}`} icon={Video}>
        <div className="grid md:grid-cols-2 gap-6">
          <SeasonForm t={t} db={db} onSubmit={addSeason} onOpenSeries={setOpenSeries} />
          <EpisodeForm t={t} db={db} onSubmit={addEpisode} openSeries={openSeries} />
        </div>
      </Section>

      <Section title={"Manage Library"} icon={Settings}>
        <ManageLibrary
          t={t}
          db={db}
          updateSeries={updateSeries}
          deleteSeries={deleteSeries}
          updateEpisode={updateEpisode}
          deleteEpisode={deleteEpisode}
        />
      </Section>
    </div>
  );
}

function SeriesForm({ t, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");

  return (
    <div className="grid gap-3 p-4 rounded-2xl bg-white/5">
      <Input placeholder={t.title} value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder={t.description} value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder={t.posterUrl} value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
      <Input placeholder={t.backdropUrl} value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} />
      <Button
        onClick={() => {
          if (!title) return;
          onSubmit({ title, description, posterUrl, backdropUrl });
          setTitle(""); setDescription(""); setPosterUrl(""); setBackdropUrl("");
        }}
      >
        <Plus className="w-4 h-4 mr-2" /> {t.addSeries}
      </Button>
    </div>
  );
}

function SeasonForm({ t, db, onSubmit, onOpenSeries }) {
  const [seriesId, setSeriesId] = useState("");
  const [number, setNumber] = useState(1);

  const series = db.series;

  return (
    <div className="grid gap-3 p-4 rounded-2xl bg-white/5">
      <Select value={seriesId} onValueChange={(v) => { setSeriesId(v); onOpenSeries(v); }}>
        <SelectTrigger className="bg-white/10 border-white/10">
          <SelectValue placeholder={t.series} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-white/10">
          {series.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="number" min={1} value={number} onChange={(e) => setNumber(parseInt(e.target.value || "1"))} placeholder={t.season} />
      <Button disabled={!seriesId} onClick={() => { if (!seriesId) return; onSubmit(seriesId, number); }}>
        <Plus className="w-4 h-4 mr-2" /> {t.addSeason}
      </Button>
    </div>
  );
}

function EpisodeForm({ t, db, onSubmit, openSeries }) {
  const [seriesId, setSeriesId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState(1);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (openSeries) setSeriesId(openSeries);
  }, [openSeries]);

  const series = db.series;
  const seasons = series.find((s) => s.id === seriesId)?.seasons || [];

  return (
    <div className="grid gap-3 p-4 rounded-2xl bg-white/5">
      {/* Select Series */}
      <Select value={seriesId} onValueChange={setSeriesId}>
        <SelectTrigger className="bg-white/10 border-white/10">
          <SelectValue placeholder={t.series} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-white/10">
          {series.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select Season */}
      <Select value={seasonId} onValueChange={setSeasonId}>
        <SelectTrigger className="bg-white/10 border-white/10">
          <SelectValue placeholder={t.season} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-white/10">
          {seasons.map((se) => (
            <SelectItem key={se.id} value={se.id}>
              {t.season} {se.number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Episode Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder={t.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          min={1}
          placeholder="#"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value || "1"))}
        />
      </div>

      <Input
        placeholder={t.description}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        placeholder={t.videoUrl}
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      {/* Save Button */}
      <Button
        disabled={!seriesId || !seasonId || !title || !videoUrl}
        onClick={() => {
          onSubmit(seriesId, seasonId, {
            title,
            number,
            description,
            videoUrl,
          });
          setTitle("");
          setNumber(1);
          setDescription("");
          setVideoUrl("");
        }}
      >
        <UploadCloud className="w-4 h-4 mr-2" /> {t.addEpisode}
      </Button>
    </div>
  );
}

// ------------------------- Main App -------------------------
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("sj_lang") || "en");
  const t = MESSAGES[lang] || MESSAGES.en;
  useEffect(() => { localStorage.setItem("sj_lang", lang); }, [lang]);

  const [db, setDB] = useState(safeLoadDB());
  const [query, setQuery] = useState("");
  const [admin, setAdmin] = useState(() => localStorage.getItem("sj_admin") === "1");

  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const filteredSeries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return db.series;
    return db.series.filter((s) => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
  }, [db, query]);

  // Admin login dialog state
  const [loginOpen, setLoginOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const tryLogin = () => {
    if (pwInput.trim() === ADMIN_PW) {
      setAdmin(true); localStorage.setItem("sj_admin", "1"); setLoginOpen(false); setPwError(""); setPwInput("");
    } else {
      setPwError(t.wrongPassword);
    }
  };
  const logout = () => { setAdmin(false); localStorage.removeItem("sj_admin"); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-rose-50 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow" />
            <div>
              <div className="text-xl font-bold tracking-tight">{t.appName}</div>
              <div className="text-xs text-zinc-600">{t.familyTagline}</div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2 mr-2">
            <div className="relative w-64">
              <Input className="pl-8" placeholder={t.search + "…"} value={query} onChange={(e) => setQuery(e.target.value)} />
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Language Switcher */}
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-[110px] bg-white/80 border-black/10">
              <Globe className="w-4 h-4 mr-1" />
              <SelectValue placeholder={t.language} />
            </SelectTrigger>
            <SelectContent className="bg-white border-black/10">
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="pt">PT</SelectItem>
              <SelectItem value="fr">FR</SelectItem>
              <SelectItem value="de">DE</SelectItem>
              <SelectItem value="lb">LB</SelectItem>
            </SelectContent>
          </Select>

          {/* Admin controls */}
          {admin ? (
            <Button variant="outline" className="ml-2" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> {t.logout}</Button>
          ) : (
            <Button variant="outline" className="ml-2" onClick={() => setLoginOpen(true)}><LogIn className="w-4 h-4 mr-2" /> {t.login}</Button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero / Featured Row */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 border border-black/5 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.series}</h1>
              <p className="text-zinc-700 mb-4">{db.series.length ? "" : t.libraryEmpty}</p>
              {admin && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" /> {t.addSeries}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>{t.addSeries}</DialogTitle></DialogHeader>
                    <SeriesForm
                      t={t}
                      onSubmit={(s) => {
                        const next = { ...db, series: [...db.series, { ...s, id: crypto.randomUUID(), seasons: [] }] };
                        setDB(next); saveDB(next);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="hidden md:block">
              <div className="aspect-video rounded-2xl bg-white/40 border border-black/5" />
            </div>
          </div>
        </div>

        {/* Rows */}
        <Row title={t.series} items={filteredSeries} onItem={setSelectedSeries} />

        {/* Admin Section */}
        {admin && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5" />
              <h2 className="text-xl font-semibold">{t.admin}</h2>
            </div>
            <AdminPanel db={db} setDB={(next) => { setDB(next); saveDB(next); }} t={t} />
          </section>
        )}
      </main>

      {/* Series Drawer */}
      <AnimatePresence>
        {selectedSeries && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-30 flex">
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="ml-auto h-full w-full max-w-3xl bg-white rounded-l-2xl overflow-y-auto"
            >
              <div className="relative">
                {selectedSeries.backdropUrl ? (
                  <div className="h-48 md:h-64 w-full" style={{ backgroundImage: `url(${selectedSeries.backdropUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : (
                  <div className="h-48 md:h-64 w-full bg-gradient-to-br from-indigo-100 to-sky-100" />
                )}
                <Button variant="secondary" size="icon" className="absolute top-3 right-3" onClick={() => setSelectedSeries(null)}><X /></Button>
              </div>
              <div className="p-5">
                <div className="flex gap-4">
                  <div
                    className="w-28 flex-shrink-0 rounded-xl overflow-hidden"
                    style={{ backgroundImage: `url(${selectedSeries.posterUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="aspect-[2/3]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{selectedSeries.title}</h3>
                    {selectedSeries.description && <p className="text-zinc-700 mb-3">{selectedSeries.description}</p>}
                    <div className="space-y-5">
                      {selectedSeries.seasons?.sort((a, b) => a.number - b.number).map((season) => (
                        <div key={season.id}>
                          <div className="font-semibold mb-2">{MESSAGES[lang].season} {season.number}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {season.episodes?.sort((a, b) => a.number - b.number).map((ep) => (
                              <Card key={ep.id} className="bg-white/60 hover:bg-white/80 transition cursor-pointer" onClick={() => setSelectedEpisode(ep)}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-16 h-10 rounded bg-gradient-to-br from-indigo-200 to-sky-200" />
                                    <div className="flex-1">
                                      <div className="font-medium">{ep.number}. {ep.title}</div>
                                      {ep.description && <div className="text-sm text-zinc-600 line-clamp-2">{ep.description}</div>}
                                    </div>
                                    <Button size="icon" variant="ghost"><Play /></Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Modal */}
      {selectedEpisode && <Player episode={selectedEpisode} t={t} onClose={() => setSelectedEpisode(null)} />}

      {/* Admin login dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.login}</DialogTitle>
          </DialogHeader>
        <div className="grid gap-2">
            <label htmlFor="pw" className="text-sm font-medium">{t.password}</label>
            <Input
              id="pw"
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") tryLogin(); }}
            />
            {pwError && <div className="text-sm text-red-600">{pwError}</div>}
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setLoginOpen(false)}>{t.cancel}</Button>
              <Button onClick={tryLogin}>{t.login}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-black/5 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-zinc-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} StreamJoy</div>
          <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> {t.interfaceLanguage}: {lang.toUpperCase()}</div>
        </div>
      </footer>
    </div>
  );
}
