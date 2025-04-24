interface ClockEntry {
  time: Date;
  type: "in" | "out";
}

function parseTimeFromRow(row: HTMLTableRowElement): Date {
  const timeCell = row.cells[0];
  const [date, time] = timeCell.textContent?.split(" ") || [];
  const [day, month, year] = date.split("/");
  const [hours, minutes, seconds] = time.split(":");

  return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
}

function calculateWorkedTime(entries: ClockEntry[]): number {
  let totalMinutes = 0;
  let lastInTime: Date | null = null;

  // Sort entries chronologically to ensure correct order
  const sortedEntries = [...entries].sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  );

  console.log("Starting work time calculation with entries:", sortedEntries);

  for (const entry of sortedEntries) {
    if (entry.type === "in") {
      lastInTime = entry.time;
      console.log("Clock in at:", lastInTime.toLocaleTimeString());
    } else if (lastInTime && entry.type === "out") {
      const diffMinutes =
        (entry.time.getTime() - lastInTime.getTime()) / (1000 * 60);
      console.log(
        `Period: ${lastInTime.toLocaleTimeString()} to ${entry.time.toLocaleTimeString()}`,
        `\nDuration: ${Math.floor(diffMinutes / 60)}h ${Math.floor(
          diffMinutes % 60
        )}min`,
        `(${diffMinutes.toFixed(2)} minutes)`
      );
      totalMinutes += diffMinutes;
      lastInTime = null;
    }
  }

  // If still clocked in, count time until now
  if (lastInTime) {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastInTime.getTime()) / (1000 * 60);
    console.log(
      `Still clocked in - Current period: ${lastInTime.toLocaleTimeString()} to ${now.toLocaleTimeString()}`,
      `\nDuration so far: ${Math.floor(diffMinutes / 60)}h ${Math.floor(
        diffMinutes % 60
      )}min`,
      `(${diffMinutes.toFixed(2)} minutes)`
    );
    totalMinutes += diffMinutes;
  }

  console.log(
    `Total time worked: ${Math.floor(totalMinutes / 60)}h ${Math.floor(
      totalMinutes % 60
    )}min`,
    `(${totalMinutes.toFixed(2)} minutes)`
  );

  return totalMinutes;
}

function formatTimeLeft(
  minutesLeft: number,
  isDayComplete: boolean,
  entries: ClockEntry[]
): string {
  const workedMinutes = 8 * 60 - minutesLeft;
  const remainingMinutes = 8 * 60 - workedMinutes;

  if (isDayComplete) {
    return "✅ Dia completo! Até amanhã!";
  }

  // Check if we're in lunch break (exactly 2 entries and last one is "out")
  if (entries.length === 2 && entries[0].type === "in") {
    const now = new Date();
    const lunchStart = entries[0].time; // When you clocked out for lunch
    console.log("Lunch start:", lunchStart.toLocaleString());
    console.log("Current time:", now.toLocaleString());
    const lunchBreakMinutes =
      (now.getTime() - lunchStart.getTime()) / (1000 * 60);
    console.log("Lunch break minutes:", lunchBreakMinutes);
    const lunchBreakFormatted = Math.floor(lunchBreakMinutes);
    return `🕛 ${lunchBreakFormatted} minutos de intervalo de almoço`;
  }

  if (remainingMinutes <= 0) {
    const overworkedMinutes = Math.abs(remainingMinutes);
    const hours = Math.floor(overworkedMinutes / 60);
    const minutes = Math.floor(overworkedMinutes % 60);
    return `⚠️ Hora extra de ${hours}h ${minutes}min! Considere parar por hoje!`;
  }

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = Math.floor(remainingMinutes % 60);
  return `Faltam ${hours}h ${minutes}min`;
}

function createTimeLeftElement(timeLeft: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.textContent = timeLeft;
  span.classList.add("time-left-extension");

  // Center the element with flexbox
  span.style.display = "flex";
  span.style.justifyContent = "center";
  span.style.alignItems = "center";
  span.style.margin = "15px auto"; // Center horizontally
  span.style.padding = "8px 16px";
  span.style.borderRadius = "6px";
  span.style.fontSize = "1.2rem";
  span.style.fontWeight = "500";
  span.style.width = "fit-content";

  // Parent container styles
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.marginTop = "15px";

  if (timeLeft.includes("Day complete")) {
    span.style.backgroundColor = "#e6f7ff";
    span.style.color = "#1890ff";
    span.style.border = "1px solid #91d5ff";
  } else if (timeLeft.includes("Overworked")) {
    span.style.backgroundColor = "#fff2f0";
    span.style.color = "#cf1322";
    span.style.border = "1px solid #ffccc7";
  } else {
    span.style.backgroundColor = "#f6ffed";
    span.style.color = "#389e0d";
    span.style.border = "1px solid #b7eb8f";
  }

  container.appendChild(span);
  return container;
}

function init() {
  const initializeTimeLeft = () => {
    try {
      console.log("Attempting to initialize time left calculator...");

      const table = document.querySelector(".ant-table-content table");
      const clockDiv = document.querySelector('[data-testid="clock-common"]');

      if (!table || !clockDiv) return false;

      const tbody = table.querySelector("tbody");
      if (!tbody) {
        console.log("No tbody element found");
        return false;
      }

      const rows = Array.from(tbody.querySelectorAll("tr")).filter(
        (row) => !row.classList.contains("ant-table-measure-row")
      );

      // Check for a minimum number of rows
      if (rows.length < 4) {
        console.log("Not enough rows loaded yet, waiting for more data...");
        return false;
      }

      const firstRow = rows[0] as HTMLTableRowElement;
      const firstCell = firstRow?.cells[0];
      const firstRowDate = firstCell?.textContent?.trim() || "";

      if (!firstRowDate.match(/\d{2}\/\d{2}\/\d{4}/)) {
        console.log(
          "First row doesn't contain expected date format, waiting..."
        );
        return false;
      }

      const today = new Date().toLocaleDateString("pt-BR");
      const todayEntries = rows.filter((row, index) => {
        try {
          const tableRow = row as HTMLTableRowElement;
          return tableRow.cells[0].textContent?.includes(today);
        } catch (error) {
          console.error("Error filtering row:", error);
          return false;
        }
      });

      const isDayComplete = todayEntries.length >= 4;
      const mappedEntries = todayEntries
        .map((row, index) => {
          try {
            const sequencePosition = index % 4;
            const type =
              sequencePosition === 0 || sequencePosition === 2 ? "in" : "out";
            return {
              time: parseTimeFromRow(row as HTMLTableRowElement),
              type,
            };
          } catch (error) {
            console.error("Error mapping row:", error);
            return null;
          }
        })
        .filter((entry) => entry !== null);

      console.log("todayEntries", mappedEntries);

      const workedMinutes = calculateWorkedTime(mappedEntries as ClockEntry[]);
      const remainingMinutes = 8 * 60 - workedMinutes;

      // Remove any existing time left element
      const existingTimeLeft = clockDiv.querySelector(".time-left-extension");
      if (existingTimeLeft) {
        existingTimeLeft.remove();
      }

      const timeLeft = formatTimeLeft(
        remainingMinutes,
        isDayComplete,
        mappedEntries as ClockEntry[]
      );
      const timeLeftElement = createTimeLeftElement(timeLeft);
      timeLeftElement.classList.add("time-left-extension");
      clockDiv.appendChild(timeLeftElement);

      return true;
    } catch (error) {
      console.error("Error in initializeTimeLeft:", error);
      return false;
    }
  };

  const waitForTable = () => {
    try {
      console.log("Starting waitForTable...");

      let attempts = 0;
      const maxAttempts = 20;
      const attemptInterval = 1500;

      const tryInitialize = () => {
        try {
          console.log(`Attempt ${attempts + 1} of ${maxAttempts}`);

          if (initializeTimeLeft()) {
            console.log("Successfully initialized time left calculator");
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(tryInitialize, attemptInterval);
          } else {
            console.log("Failed to initialize after maximum attempts");
          }
        } catch (error) {
          console.error("Error in tryInitialize:", error);
        }
      };

      tryInitialize();

      const observer = new MutationObserver((mutations, obs) => {
        try {
          for (const mutation of mutations) {
            if (
              mutation.type === "childList" &&
              (mutation.target as HTMLElement).matches?.("tbody")
            ) {
              console.log(
                "Table body mutation detected, attempting initialization"
              );
              if (initializeTimeLeft()) {
                console.log("Successfully initialized via observer");
                obs.disconnect();
              }
            }
          }
        } catch (error) {
          console.error("Error in observer callback:", error);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        console.log("Observer disconnected after timeout");
      }, 45000);
    } catch (error) {
      console.error("Error in waitForTable:", error);
    }
  };

  try {
    waitForTable();
  } catch (error) {
    console.error("Error initializing table watcher:", error);
  }
}

// Remove the setInterval and replace with focus event listener
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    init();
  }
});

// Initial call when page loads
init();
