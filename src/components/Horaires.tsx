import React, { useState, useEffect, useMemo } from "react";
import StoreHours from "./StoreHours";

interface TimePoint {
  day: number;
  time: string;
}

interface Period {
  open: TimePoint;
  close: TimePoint;
}

const Horaires = () => {
  const [apiStoreHours, setApiStoreHours] = useState<Period[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [hasHolidays, setHasHolidays] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const defaultHours = useMemo<Period[]>(
    () => [
      { open: { day: 1, time: "0000" }, close: { day: 1, time: "0000" } },
      { open: { day: 2, time: "0930" }, close: { day: 2, time: "1930" } },
      { open: { day: 3, time: "0930" }, close: { day: 3, time: "1930" } },
      { open: { day: 4, time: "0930" }, close: { day: 4, time: "1930" } },
      { open: { day: 5, time: "0930" }, close: { day: 5, time: "1930" } },
      { open: { day: 6, time: "0930" }, close: { day: 6, time: "1900" } },
      { open: { day: 0, time: "0000" }, close: { day: 0, time: "0000" } },
    ],
    []
  );

  const getDayName = (dayIndex: number) => {
    const days = [
      "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
    ];
    return days[dayIndex] || "";
  };

  const formatTime = (time: string) => {
    if (!time || time === "0000") return null;
    return `${time.slice(0, 2)}h${time.slice(2)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = new Date().getFullYear();
        const holidayResponse = await fetch(
          `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
        );
        if (holidayResponse.ok) setHasHolidays(true);

        const response = await fetch("/api/get-google-hours");
        const contentType = response.headers.get("content-type");

        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.status === "OK" && data.result?.opening_hours?.periods) {
            setApiStoreHours(data.result.opening_hours.periods);
            setIsLoading(false);
            return;
          }
        }
        setApiStoreHours(defaultHours);
      } catch (error) {
        setApiStoreHours(defaultHours);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [defaultHours]);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const formatDayHours = (periods: Period[]) => {
    const daysOrder = [1, 2, 3, 4, 5, 6, 0];
    const periodsByDay = periods.reduce((acc: { [key: number]: Period[] }, period) => {
      const day = period.open.day;
      if (!acc[day]) acc[day] = [];
      acc[day].push(period);
      return acc;
    }, {});

    return daysOrder.map((dayIndex) => {
      const dayName = getDayName(dayIndex);
      const dayPeriods = periodsByDay[dayIndex];
      const hoursString = dayPeriods?.map((p) => {
        const open = formatTime(p.open.time);
        const close = formatTime(p.close.time);
        return open && close ? `${open} - ${close}` : "Fermé";
      }).filter((s) => s !== "Fermé").join(" / ");

      return `${dayName} : ${hoursString || "Fermé"}`;
    }).join("\n");
  };

  return (
    <div className="blocHoraires">
      <div className="blocHorairesTexte">
        <div className="encadréOuvertFermé">
          {!isLoading ? (
            <StoreHours />
          ) : (
            <div className="horaires-skeleton" aria-hidden="true" />
          )}
        </div>
        
        <button 
          onClick={togglePopup} 
          className="bouttonHoraires" 
          type="button"
        >
          Voir les horaires
        </button>

        {isPopupOpen && (
          <div className="tableauHoraires">
            <div className="textHorairesPopup">
              <h2>Horaires du magasin</h2>
              <pre className="horaires-pre-list">
                {formatDayHours(apiStoreHours.length > 0 ? apiStoreHours : defaultHours)}
              </pre>
              {hasHolidays && (
                <p className="horaires-holiday-notice">
                  * Les horaires peuvent varier les jours fériés.
                </p>
              )}
            </div>
            <button className="bouttonMenuHoraires" onClick={togglePopup} type="button">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Horaires);
