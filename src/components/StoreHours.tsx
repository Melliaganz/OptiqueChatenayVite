import React, { useEffect, useState, useCallback, useMemo } from "react";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

interface TimePoint {
  day: number;
  time: string;
}

interface Period {
  open: TimePoint;
  close: TimePoint;
}

interface StoreDetails {
  opening_hours?: {
    periods: Period[];
  };
}

const StoreHours = () => {
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [holidays, setHolidays] = useState<string[]>([]);

  const defaultPeriods = useMemo<Period[]>(
    () => [
      { open: { day: 2, time: "0930" }, close: { day: 2, time: "1930" } },
      { open: { day: 3, time: "0930" }, close: { day: 3, time: "1930" } },
      { open: { day: 4, time: "0930" }, close: { day: 4, time: "1930" } },
      { open: { day: 5, time: "0930" }, close: { day: 5, time: "1930" } },
      { open: { day: 6, time: "0930" }, close: { day: 6, time: "1900" } },
    ],
    []
  );

  const formatTime = (t: TimePoint) =>
    t?.time ? `${t.time.slice(0, 2)}:${t.time.slice(2)}` : "";

  const getNextOpeningTime = useCallback((periods: Period[]) => {
    const now = new Date();
    const cur = now.getDay() * 10000 + now.getHours() * 100 + now.getMinutes();
    return (
      periods.find((p) => p.open.day * 10000 + parseInt(p.open.time) > cur) ||
      periods[0]
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = new Date().getFullYear();
        const [hRes, sRes] = await Promise.all([
          fetch(
            `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
          ),
          fetch("/api/get-google-hours"),
        ]);

        if (hRes.ok) setHolidays(Object.keys(await hRes.json()));

        if (sRes.ok && sRes.headers.get("content-type")?.includes("json")) {
          const data = await sRes.json();
          if (data.status === "OK") {
            setStoreDetails(data.result);
            return;
          }
        }
        throw new Error();
      } catch {
        setStoreDetails({ opening_hours: { periods: defaultPeriods } });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [defaultPeriods]);

  const renderStoreStatus = () => {
    if (loading) {
      return null;
    }

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    const isHoliday = holidays.includes(dateStr);
    const periods = storeDetails?.opening_hours?.periods || defaultPeriods;
    const curDay = today.getDay();
    const curTime =
      today.getHours().toString().padStart(2, "0") +
      today.getMinutes().toString().padStart(2, "0");

    const currentPeriod = periods.find(
      (p) =>
        p.open.day === curDay &&
        curTime >= p.open.time &&
        curTime <= p.close.time
    );
    const isOpen = currentPeriod && !isHoliday;

    return (
      <>
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
            {getNextOpeningTime(periods) && (
              <p>
                Ouverture {DAYS[getNextOpeningTime(periods).open.day]} à{" "}
                {formatTime(getNextOpeningTime(periods).open)}.
              </p>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="blocTextHeures">
      {renderStoreStatus()}
    </div>
  );
};

export default React.memo(StoreHours);
