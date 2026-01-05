import React, { useState, useEffect,  useCallback } from "react";

interface TimePoint {
  day: number;
  time: string;
}
interface Period {
  open: TimePoint;
  close: TimePoint;
}

const DEFAULT_HOURS: Period[] = [
  { open: { day: 1, time: "0000" }, close: { day: 1, time: "0000" } },
  { open: { day: 2, time: "0930" }, close: { day: 2, time: "1930" } },
  { open: { day: 3, time: "0930" }, close: { day: 3, time: "1930" } },
  { open: { day: 4, time: "0930" }, close: { day: 4, time: "1930" } },
  { open: { day: 5, time: "0930" }, close: { day: 5, time: "1930" } },
  { open: { day: 6, time: "0930" }, close: { day: 6, time: "1900" } },
  { open: { day: 0, time: "0000" }, close: { day: 0, time: "0000" } },
];

const CACHE_KEY_HOURS = "optique_hours_cache";
const CACHE_KEY_HOLIDAYS = "optique_holidays_cache";
const CACHE_KEY_TIME = "optique_cache_timestamp";
const ONE_DAY = 86400000;

const Horaires = () => {
  const [apiStoreHours, setApiStoreHours] = useState<Period[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedHours = localStorage.getItem(CACHE_KEY_HOURS);
      const cachedHolidays = localStorage.getItem(CACHE_KEY_HOLIDAYS);
      const cachedTime = localStorage.getItem(CACHE_KEY_TIME);

      if (cachedHours && cachedHolidays) {
        setApiStoreHours(JSON.parse(cachedHours));
        setHolidays(JSON.parse(cachedHolidays));
        if (cachedTime && Date.now() - parseInt(cachedTime) < ONE_DAY) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const year = new Date().getFullYear();
        const [holidayRes, googleRes] = await Promise.all([
          fetch(
            `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
          ),
          fetch("/api/get-google-hours"),
        ]);

        if (holidayRes.ok) {
          const holidayData = await holidayRes.json();
          const freshHolidays = Object.keys(holidayData);
          setHolidays(freshHolidays);
          localStorage.setItem(
            CACHE_KEY_HOLIDAYS,
            JSON.stringify(freshHolidays)
          );
        }

        if (googleRes.ok) {
          const data = await googleRes.json();
          if (data.status === "OK" && data.result?.opening_hours?.periods) {
            const freshPeriods = data.result.opening_hours.periods;
            setApiStoreHours(freshPeriods);
            localStorage.setItem(CACHE_KEY_HOURS, JSON.stringify(freshPeriods));
          }
        }
        localStorage.setItem(CACHE_KEY_TIME, Date.now().toString());
      } catch (error) {
        if (apiStoreHours.length === 0) setApiStoreHours(DEFAULT_HOURS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const formatDayHours = (periods: Period[]) => {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const daysOrder = [1, 2, 3, 4, 5, 6, 0];
    const periodsByDay = periods.reduce(
      (acc: { [key: number]: Period[] }, p) => {
        if (!acc[p.open.day]) acc[p.open.day] = [];
        acc[p.open.day].push(p);
        return acc;
      },
      {}
    );

    return daysOrder
      .map((dayIndex) => {
        const dayPeriods = periodsByDay[dayIndex];
        const hours = dayPeriods
          ?.map((p) => {
            if (p.open.time === "0000") return "Fermé";
            return `${p.open.time.slice(0, 2)}h${p.open.time.slice(
              2
            )} - ${p.close.time.slice(0, 2)}h${p.close.time.slice(2)}`;
          })
          .filter((h) => h !== "Fermé")
          .join(" / ");
        return `${days[dayIndex]} : ${hours || "Fermé"}`;
      })
      .join("\n");
  };

  const currentHours = apiStoreHours.length > 0 ? apiStoreHours : DEFAULT_HOURS;

  return (
    <div className="blocHoraires">
      <div className="blocHorairesTexte">
        <div className="encadréOuvertFermé">
          {!isLoading ? (
            <StoreHours periods={currentHours} holidays={holidays} />
          ) : (
            <div
              style={{ minHeight: "44px", width: "100%" }}
              aria-hidden="true"
            >
              <p>Chargement des horaires...</p>
            </div>
          )}
        </div>
        <button onClick={togglePopup} className="bouttonHoraires" type="button">
          Voir les horaires
        </button>
        {isPopupOpen && (
          <div className="tableauHoraires">
            <div className="textHorairesPopup">
              <h2>Horaires du magasin</h2>
              <pre className="horaires-pre-list">
                {formatDayHours(currentHours)}
              </pre>
              {holidays.length > 0 && (
                <p className="horaires-holiday-notice">
                  * Les horaires peuvent varier les jours fériés.
                </p>
              )}
            </div>
            <button
              className="bouttonMenuHoraires"
              onClick={togglePopup}
              type="button"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Horaires);

// --- StoreHours.tsx ---

interface StoreHoursProps {
  periods: Period[];
  holidays: string[];
}

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const StoreHours = React.memo(({ periods, holidays }: StoreHoursProps) => {
  const formatTime = (t: TimePoint) =>
    t?.time ? `${t.time.slice(0, 2)}h${t.time.slice(2)}` : "";

  const getNextOpeningTime = useCallback((pers: Period[]) => {
    const now = new Date();
    const cur = now.getDay() * 10000 + now.getHours() * 100 + now.getMinutes();
    const actualOpenings = pers.filter((p) => p.open.time !== "0000");
    if (actualOpenings.length === 0) return null;
    return (
      actualOpenings.find(
        (p) => p.open.day * 10000 + parseInt(p.open.time) > cur
      ) || actualOpenings[0]
    );
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-CA");
  const isHoliday = holidays.includes(dateStr);
  const curDay = today.getDay();
  const curTime =
    today.getHours().toString().padStart(2, "0") +
    today.getMinutes().toString().padStart(2, "0");

  const currentPeriod = periods.find(
    (p) =>
      p.open.day === curDay &&
      curTime >= p.open.time &&
      curTime <= p.close.time &&
      p.open.time !== "0000"
  );

  const isOpen = currentPeriod && !isHoliday;
  const nextOpening = getNextOpeningTime(periods);

  return (
    <div className="blocTextHeures">
      {isOpen ? (
        <>
          <p>
            Le magasin est <strong>ouvert</strong>.
          </p>
          <p>Fermeture à {formatTime(currentPeriod.close)}.</p>
        </>
      ) : (
        <>
          <p>{isHoliday ? "Fermé (jour férié)." : "Le magasin est fermé."}</p>
          {nextOpening && (
            <p>
              Ouverture {DAYS[nextOpening.open.day]} à{" "}
              {formatTime(nextOpening.open)}.
            </p>
          )}
        </>
      )}
    </div>
  );
});
