const tabs = document.querySelectorAll(".demo-tab");
const steps = document.querySelectorAll(".form-step");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const progressFill = document.getElementById("progressFill");
const stepIndicator = document.getElementById("stepIndicator");
const verificationBadge = document.getElementById("verificationBadge");
const verificationText = document.getElementById("verificationText");
const welcomeMessage = document.getElementById("welcomeMessage");
const summaryCard = document.getElementById("summaryCard");
const matchList = document.getElementById("matchList");
const simulateButton = document.getElementById("simulateButton");
const modeSummary = document.getElementById("modeSummary");
const chatTitle = document.getElementById("chatTitle");
const chatMeta = document.getElementById("chatMeta");
const messageThread = document.getElementById("messageThread");
const messageInput = document.getElementById("messageInput");
const messageForm = document.getElementById("messageForm");
const sendButton = document.getElementById("sendButton");

const inputs = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  origin: document.getElementById("origin"),
  destination: document.getElementById("destination"),
  time: document.getElementById("time"),
  meetingPoint: document.getElementById("meetingPoint"),
  seats: document.getElementById("seats"),
  genderPreference: document.getElementById("genderPreference"),
  notes: document.getElementById("notes")
};

const errors = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  origin: document.getElementById("originError"),
  destination: document.getElementById("destinationError"),
  time: document.getElementById("timeError"),
  meetingPoint: document.getElementById("meetingPointError")
};

const recognizedSchools = {
  "usc.edu": "University of Southern California",
  "ucla.edu": "University of California, Los Angeles",
  "lmu.edu": "Loyola Marymount University",
  "caltech.edu": "California Institute of Technology",
  "pepperdine.edu": "Pepperdine University"
};

const demoMatches = {
  driver: [
    {
      id: "driver-1",
      role: "driver",
      name: "Jason Kim",
      university: "USC",
      route: "USC Village -> Santa Monica",
      time: "6:10 PM",
      meetingPoint: "Jefferson & Hoover",
      score: 96,
      driverRating: 4.9,
      riderRating: 4.8,
      detail: "Has 2 open seats, prefers cash or Venmo split, okay with one backpack.",
      car: "2021 Honda Civic",
      color: "Blue",
      plate: "CA 8LQX221",
      seatsOpen: "2 seats open",
      photo: createAvatar("Jason Kim", "#f7b36a", "#e26b4e"),
      messages: [
        "Hey, I am leaving USC around 6:10 PM and can pick up near Jefferson & Hoover.",
        "I have 2 seats open. Gas split usually comes out to around $7 each.",
        "If that works for you, I can share my exact ETA once I head out."
      ]
    },
    {
      id: "driver-2",
      role: "driver",
      name: "Maya Patel",
      university: "LMU",
      route: "Exposition Park -> West LA",
      time: "6:30 PM",
      meetingPoint: "USC Royal Street structure",
      score: 88,
      driverRating: 4.8,
      riderRating: 4.9,
      detail: "1 seat left, prefers women-only matches, can wait up to 8 minutes.",
      car: "2020 Toyota RAV4",
      color: "Silver",
      plate: "CA 6PHT914",
      seatsOpen: "1 seat open",
      photo: createAvatar("Maya Patel", "#8dd7c7", "#438f82"),
      messages: [
        "Hi, I am headed to West LA after class.",
        "Pickup would be at the USC Royal structure entrance.",
        "Let me know if your timing is flexible by a few minutes."
      ]
    },
    {
      id: "driver-3",
      role: "driver",
      name: "Ethan Romero",
      university: "UCLA",
      route: "Downtown LA -> Santa Monica",
      time: "5:55 PM",
      meetingPoint: "Expo Line station entrance",
      score: 81,
      driverRating: 4.7,
      riderRating: 4.6,
      detail: "2 seats available, prefers students with light bags, returning same night.",
      car: "2019 Tesla Model 3",
      color: "White",
      plate: "CA 9KTR602",
      seatsOpen: "2 seats open",
      photo: createAvatar("Ethan Romero", "#d1c1f8", "#7c6bc1"),
      messages: [
        "I am passing through Downtown before heading west.",
        "Happy to coordinate if you can meet near the Expo stop.",
        "The drive is usually smooth before 6 PM."
      ]
    }
  ],
  rider: [
    {
      id: "rider-1",
      role: "rider",
      name: "Nina Alvarez",
      university: "UCLA",
      route: "Westwood -> Koreatown",
      time: "8:00 PM",
      meetingPoint: "Ackerman turnaround",
      score: 95,
      driverRating: 4.8,
      riderRating: 5.0,
      detail: "Already has 1 rider confirmed and is splitting a Lyft 3 ways.",
      photo: createAvatar("Nina Alvarez", "#ffd29d", "#e27855"),
      messages: [
        "Hey, we are planning to book a Lyft from Westwood around 8:00 PM.",
        "Right now it is two of us, so adding one more rider would lower the fare a lot.",
        "We can meet at the Ackerman turnaround if that is easy for you."
      ]
    },
    {
      id: "rider-2",
      role: "rider",
      name: "Olivia Chen",
      university: "USC",
      route: "USC -> LAX",
      time: "4:45 PM",
      meetingPoint: "Leavey Library",
      score: 90,
      driverRating: 4.9,
      riderRating: 4.8,
      detail: "Looking for 2 students to split an Uber to LAX, one carry-on each preferred.",
      photo: createAvatar("Olivia Chen", "#b7e6e1", "#4d968e"),
      messages: [
        "I am ordering an Uber to LAX around 4:45 PM.",
        "If we split it 3 ways it should be much cheaper than going solo.",
        "I can meet outside Leavey Library."
      ]
    },
    {
      id: "rider-3",
      role: "rider",
      name: "Daniel Park",
      university: "LMU",
      route: "Playa Vista -> Santa Monica",
      time: "7:20 PM",
      meetingPoint: "Target parking lot",
      score: 83,
      driverRating: 4.7,
      riderRating: 4.7,
      detail: "Flexible within 15 minutes, okay with UberX or Lyft standard.",
      photo: createAvatar("Daniel Park", "#ffcfdb", "#c25f78"),
      messages: [
        "I am coordinating a shared rideshare to Santa Monica tonight.",
        "Timing is flexible by about 15 minutes.",
        "Happy to book either UberX or Lyft depending on price."
      ]
    }
  ]
};

let currentMode = "driver";
let currentStep = 1;
let activeMatchId = "";
let generatedMatches = [];

function createAvatar(name, colorA, colorB) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#g)"/>
      <circle cx="60" cy="45" r="20" fill="rgba(255,255,255,0.62)"/>
      <path d="M28 98c7-17 23-27 32-27s25 10 32 27" fill="rgba(255,255,255,0.52)"/>
      <text x="60" y="110" text-anchor="middle" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="18" font-weight="700" fill="rgba(22,33,47,0.84)">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getStoredUser() {
  try {
    return JSON.parse(window.localStorage.getItem("cogoStudent") || "null");
  } catch {
    return null;
  }
}

function getEmailDomain(email) {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1] : "";
}

function setError(key, message) {
  const input = inputs[key];
  const error = errors[key];

  if (!input || !error) {
    return;
  }

  input.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function validateAccount() {
  let valid = true;

  if (!inputs.name.value.trim()) {
    setError("name", "Please enter your full name.");
    valid = false;
  } else {
    setError("name", "");
  }

  const email = inputs.email.value.trim().toLowerCase();
  const domain = getEmailDomain(email);

  if (!email) {
    setError("email", "Please enter your verified student email.");
    valid = false;
  } else if (!domain.endsWith(".edu") || !recognizedSchools[domain]) {
    setError("email", "Use a recognized verified .edu email.");
    valid = false;
  } else {
    setError("email", "");
  }

  return valid;
}

function validateRoute() {
  let valid = true;

  ["origin", "destination", "time", "meetingPoint"].forEach((key) => {
    if (!inputs[key].value.trim()) {
      const labels = {
        origin: "Please add a departure location.",
        destination: "Please add a destination.",
        time: "Please choose a departure time.",
        meetingPoint: "Please enter a meeting point."
      };
      setError(key, labels[key]);
      valid = false;
    } else {
      setError(key, "");
    }
  });

  return valid;
}

function validateStep(step) {
  if (step === 1) {
    return validateAccount();
  }

  if (step === 2) {
    return validateRoute();
  }

  return true;
}

function renderStep() {
  steps.forEach((stepElement) => {
    stepElement.classList.toggle("active", Number(stepElement.dataset.step) === currentStep);
  });

  backButton.disabled = currentStep === 1;
  nextButton.textContent = currentStep === 3 ? "Generate matches" : "Continue";
  stepIndicator.textContent = `Step ${currentStep} of 3`;
  progressFill.style.width = `${(currentStep / 3) * 100}%`;
}

function updateModeUI() {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === currentMode);
  });

  modeSummary.textContent = currentMode === "driver"
    ? "Driver Match selected: your request will show available seats to students heading the same way."
    : "Rider Match selected: your request will form fare-sharing groups with students taking Uber or Lyft on a similar route.";
}

function formatTime(value) {
  if (!value) {
    return "TBD";
  }

  const [hours, minutes] = value.split(":");
  const hourNumber = Number(hours);
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const normalizedHour = hourNumber % 12 || 12;
  return `${normalizedHour}:${minutes} ${suffix}`;
}

function buildSummary() {
  const email = inputs.email.value.trim().toLowerCase();
  const school = recognizedSchools[getEmailDomain(email)] || "Verified campus";
  const modeLabel = currentMode === "driver" ? "Driver Match" : "Rider Match";

  summaryCard.innerHTML = `
    <div>
      <p class="summary-title">${modeLabel} request created for ${inputs.name.value.trim()}</p>
      <p class="summary-copy">
        Verified through <strong>${school}</strong> with <code>${email}</code>. Route:
        <strong>${inputs.origin.value.trim()}</strong> to <strong>${inputs.destination.value.trim()}</strong>
        at <strong>${formatTime(inputs.time.value)}</strong>.
      </p>
      <p class="summary-copy">
        Meeting point: ${inputs.meetingPoint.value.trim()}. Preference: ${inputs.genderPreference.value}.
      </p>
    </div>
  `;
}

function renderMatchCard(match) {
  const carSection = match.role === "driver"
    ? `
        <div class="car-profile">
          <div class="car-profile-title">Car information</div>
          <div class="car-detail-grid">
            <span class="meta-pill">${match.car}</span>
            <span class="meta-pill">${match.color}</span>
            <span class="meta-pill">${match.plate}</span>
            <span class="meta-pill">${match.seatsOpen}</span>
          </div>
        </div>
      `
    : "";

  return `
    <article class="match-card ${match.id === activeMatchId ? "active" : ""}" data-match-id="${match.id}">
      <div class="match-card-header">
        <span class="tag ${currentMode === "driver" ? "driver" : "rider"}">${currentMode === "driver" ? "Driver Match" : "Rider Match"}</span>
        <span class="score-pill">${match.score}% compatibility</span>
      </div>
      <div class="match-profile-header">
        <img class="driver-photo" src="${match.photo}" alt="${match.name} profile photo">
        <div>
          <h5>${match.name} · ${match.university}</h5>
          <div class="profile-meta-row">
            <span class="rating-pill">Driver ${match.driverRating.toFixed(1)}/5</span>
            <span class="rating-pill">Rider ${match.riderRating.toFixed(1)}/5</span>
          </div>
        </div>
      </div>
      <p>${match.route}</p>
      <div class="match-meta">
        <p>${match.time} · ${match.meetingPoint}</p>
        <p>${match.detail}</p>
      </div>
      ${carSection}
    </article>
  `;
}

function renderMatches() {
  if (!generatedMatches.length) {
    matchList.innerHTML = `<p class="empty-state">Your suggested drivers or riders will appear here.</p>`;
    return;
  }

  matchList.innerHTML = generatedMatches.map(renderMatchCard).join("");

  document.querySelectorAll(".match-card").forEach((card) => {
    card.addEventListener("click", () => {
      openMatch(card.dataset.matchId);
    });
  });
}

function openMatch(matchId) {
  activeMatchId = matchId;
  renderMatches();

  const match = generatedMatches.find((item) => item.id === matchId);
  if (!match) {
    return;
  }

  chatTitle.textContent = `Chat with ${match.name}`;
  chatMeta.innerHTML = match.role === "driver"
    ? `${match.university} verified student. Driver rating ${match.driverRating.toFixed(1)}/5, rider rating ${match.riderRating.toFixed(1)}/5, compatibility ${match.score}%. Driving a <strong>${match.color} ${match.car}</strong> with plate <strong>${match.plate}</strong>.`
    : `${match.university} verified student. Driver rating ${match.driverRating.toFixed(1)}/5, rider rating ${match.riderRating.toFixed(1)}/5, compatibility ${match.score}%. Coordinating a shared rideshare group.`;
  messageInput.disabled = false;
  sendButton.disabled = false;

  const intro = currentMode === "driver"
    ? `${match.name} looks like a strong seat-sharing match for your route.`
    : `${match.name} looks like a strong fare-splitting match for your trip.`;

  messageThread.innerHTML = `
    <div class="message-bubble match">${intro}</div>
    ${match.messages.map((message) => `<div class="message-bubble match">${message}</div>`).join("")}
  `;
}

function generateMatches(useSample = false) {
  const source = demoMatches[currentMode];
  const origin = useSample ? (currentMode === "driver" ? "USC Village" : "Westwood") : inputs.origin.value.trim();
  const destination = useSample ? (currentMode === "driver" ? "Santa Monica" : "Koreatown") : inputs.destination.value.trim();

  generatedMatches = source.map((match, index) => ({
    ...match,
    route: `${origin} -> ${destination}`,
    score: Math.max(76, match.score - index * 2)
  }));

  renderMatches();
  if (generatedMatches.length > 0) {
    openMatch(generatedMatches[0].id);
  }
}

function populateSampleTrip() {
  const user = getStoredUser();

  inputs.name.value = user?.name || "Jordan Lee";
  inputs.email.value = user?.email || (currentMode === "driver" ? "jordan@usc.edu" : "jordan@ucla.edu");
  inputs.origin.value = currentMode === "driver" ? "USC Village" : "Westwood";
  inputs.destination.value = currentMode === "driver" ? "Santa Monica" : "Koreatown";
  inputs.time.value = currentMode === "driver" ? "18:10" : "20:00";
  inputs.meetingPoint.value = currentMode === "driver" ? "Jefferson & Hoover" : "Ackerman turnaround";
  inputs.seats.value = currentMode === "driver" ? "2" : "3";
  inputs.genderPreference.value = "No preference";
  inputs.notes.value = currentMode === "driver"
    ? "Can carry one backpack per rider and prefer pickup within five minutes."
    : "Open to Uber or Lyft depending on surge pricing.";

  buildSummary();
  generateMatches(true);
}

function hydrateFromSignup() {
  const user = getStoredUser();

  if (!user) {
    verificationText.textContent = "Demo mode active. Sign up first for the full verified student flow.";
    verificationBadge.className = "verification-badge checking";
    verificationBadge.textContent = "Demo";
    inputs.name.value = "Jordan Lee";
    inputs.email.value = "jordan@usc.edu";
    return;
  }

  verificationBadge.className = "verification-badge verified";
  verificationBadge.textContent = "Verified";
  verificationText.textContent = `${user.school} account verified at signup and ready for route matching.`;
  inputs.name.value = user.name;
  inputs.email.value = user.email;
  welcomeMessage.textContent = `${user.name} from ${user.school} is now inside the main CoGO platform. Browse verified route matches, compare ratings, and inspect driver details including vehicle information and profile photos.`;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentMode = tab.dataset.mode;
    activeMatchId = "";
    generatedMatches = [];
    updateModeUI();
    populateSampleTrip();
  });
});

["name", "email", "origin", "destination", "time", "meetingPoint"].forEach((key) => {
  inputs[key].addEventListener("input", () => setError(key, ""));
});

backButton.addEventListener("click", () => {
  currentStep = Math.max(1, currentStep - 1);
  renderStep();
});

nextButton.addEventListener("click", () => {
  if (!validateStep(currentStep)) {
    return;
  }

  if (currentStep < 3) {
    currentStep += 1;
    renderStep();
    return;
  }

  buildSummary();
  generateMatches(false);
});

simulateButton.addEventListener("click", () => {
  populateSampleTrip();
  currentStep = 3;
  renderStep();
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = messageInput.value.trim();
  if (!value || !activeMatchId) {
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble user";
  bubble.textContent = value;
  messageThread.appendChild(bubble);
  messageInput.value = "";

  window.setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "message-bubble match";
    reply.textContent = currentMode === "driver"
      ? "Sounds good. I can confirm pickup details and seat availability once you are ready."
      : "Perfect. I will keep the group posted and confirm the fare split before we book.";
    messageThread.appendChild(reply);
  }, 500);
});

hydrateFromSignup();
updateModeUI();
renderStep();
