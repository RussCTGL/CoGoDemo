const tabs = document.querySelectorAll(".demo-tab");
const steps = document.querySelectorAll(".form-step");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const progressFill = document.getElementById("progressFill");
const stepIndicator = document.getElementById("stepIndicator");
const verificationBadge = document.getElementById("verificationBadge");
const verificationText = document.getElementById("verificationText");
const summaryCard = document.getElementById("summaryCard");
const matchList = document.getElementById("matchList");
const simulateButton = document.getElementById("simulateButton");
const modeSummary = document.getElementById("modeSummary");
const chatTitle = document.getElementById("chatTitle");
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

const demoMatches = {
  driver: [
    {
      id: "driver-1",
      name: "Jason Kim",
      university: "USC",
      route: "USC Village -> Santa Monica",
      time: "6:10 PM",
      meetingPoint: "Jefferson & Hoover",
      score: 96,
      detail: "Has 2 open seats, prefers cash or Venmo split, okay with one backpack.",
      messages: [
        "Hey, I am leaving USC around 6:10 PM and can pick up near Jefferson & Hoover.",
        "I have 2 seats open. Gas split usually comes out to around $7 each.",
        "If that works for you, I can share my exact ETA once I head out."
      ]
    },
    {
      id: "driver-2",
      name: "Maya Patel",
      university: "LMU",
      route: "Exposition Park -> West LA",
      time: "6:30 PM",
      meetingPoint: "USC Royal Street structure",
      score: 88,
      detail: "1 seat left, prefers women-only matches, can wait up to 8 minutes.",
      messages: [
        "Hi, I am headed to West LA after class.",
        "Pickup would be at the USC Royal structure entrance.",
        "Let me know if your timing is flexible by a few minutes."
      ]
    },
    {
      id: "driver-3",
      name: "Ethan Romero",
      university: "UCLA",
      route: "Downtown LA -> Santa Monica",
      time: "5:55 PM",
      meetingPoint: "Expo Line station entrance",
      score: 81,
      detail: "2 seats available, prefers students with light bags, returning same night.",
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
      name: "Nina Alvarez",
      university: "UCLA",
      route: "Westwood -> Koreatown",
      time: "8:00 PM",
      meetingPoint: "Ackerman turnaround",
      score: 95,
      detail: "Already has 1 rider confirmed and is splitting a Lyft 3 ways.",
      messages: [
        "Hey, we are planning to book a Lyft from Westwood around 8:00 PM.",
        "Right now it is two of us, so adding one more rider would lower the fare a lot.",
        "We can meet at the Ackerman turnaround if that is easy for you."
      ]
    },
    {
      id: "rider-2",
      name: "Olivia Chen",
      university: "USC",
      route: "USC -> LAX",
      time: "4:45 PM",
      meetingPoint: "Leavey Library",
      score: 90,
      detail: "Looking for 2 students to split an Uber to LAX, one carry-on each preferred.",
      messages: [
        "I am ordering an Uber to LAX around 4:45 PM.",
        "If we split it 3 ways it should be much cheaper than going solo.",
        "I can meet outside Leavey Library."
      ]
    },
    {
      id: "rider-3",
      name: "Daniel Park",
      university: "LMU",
      route: "Playa Vista -> Santa Monica",
      time: "7:20 PM",
      meetingPoint: "Target parking lot",
      score: 83,
      detail: "Flexible within 15 minutes, okay with UberX or Lyft standard.",
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

function setError(key, message) {
  const input = inputs[key];
  const error = errors[key];

  if (!input || !error) {
    return;
  }

  input.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function updateVerificationState() {
  const email = inputs.email.value.trim().toLowerCase();

  verificationBadge.className = "verification-badge pending";
  verificationBadge.textContent = "Pending";
  verificationText.textContent = "Enter your school email to unlock student-only matching.";

  if (!email) {
    return false;
  }

  if (email.endsWith(".edu")) {
    verificationBadge.className = "verification-badge verified";
    verificationBadge.textContent = "Verified";
    verificationText.textContent = "Student access confirmed. This demo now treats you as part of the verified CoGO network.";
    return true;
  }

  verificationBadge.className = "verification-badge blocked";
  verificationBadge.textContent = "Blocked";
  verificationText.textContent = "Access denied in this demo. CoGO only accepts verified university email addresses ending in .edu.";
  return false;
}

function validateStep(step) {
  let valid = true;

  if (step === 1) {
    if (!inputs.name.value.trim()) {
      setError("name", "Please enter your full name.");
      valid = false;
    } else {
      setError("name", "");
    }

    if (!inputs.email.value.trim()) {
      setError("email", "Please enter your student email.");
      valid = false;
    } else if (!inputs.email.value.trim().toLowerCase().endsWith(".edu")) {
      setError("email", "CoGO requires a valid .edu email for student verification.");
      valid = false;
    } else {
      setError("email", "");
    }
  }

  if (step === 2) {
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
  }

  return valid;
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
  const modeLabel = currentMode === "driver" ? "Driver Match" : "Rider Match";

  summaryCard.innerHTML = `
    <div>
      <p class="summary-title">${modeLabel} request created for ${inputs.name.value.trim()}</p>
      <p class="summary-copy">
        Verified with <code>${inputs.email.value.trim()}</code>. Route:
        <strong>${inputs.origin.value.trim()}</strong> to <strong>${inputs.destination.value.trim()}</strong>
        at <strong>${formatTime(inputs.time.value)}</strong>.
      </p>
      <p class="summary-copy">
        Meeting point: ${inputs.meetingPoint.value.trim()}. Preference: ${inputs.genderPreference.value}.
      </p>
    </div>
  `;
}

function renderMatches() {
  if (!generatedMatches.length) {
    matchList.innerHTML = `<p class="empty-state">Your suggested drivers or riders will appear here.</p>`;
    return;
  }

  matchList.innerHTML = generatedMatches.map((match) => `
    <article class="match-card ${match.id === activeMatchId ? "active" : ""}" data-match-id="${match.id}">
      <div class="match-card-header">
        <span class="tag ${currentMode === "driver" ? "driver" : "rider"}">${currentMode === "driver" ? "Driver Match" : "Rider Match"}</span>
        <span class="score-pill">${match.score}% compatibility</span>
      </div>
      <h5>${match.name} · ${match.university}</h5>
      <p>${match.route}</p>
      <div class="match-meta">
        <p>${match.time} · ${match.meetingPoint}</p>
        <p>${match.detail}</p>
      </div>
    </article>
  `).join("");

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
  inputs.name.value = "Jordan Lee";
  inputs.email.value = currentMode === "driver" ? "jordan@usc.edu" : "jordan@ucla.edu";
  inputs.origin.value = currentMode === "driver" ? "USC Village" : "Westwood";
  inputs.destination.value = currentMode === "driver" ? "Santa Monica" : "Koreatown";
  inputs.time.value = currentMode === "driver" ? "18:10" : "20:00";
  inputs.meetingPoint.value = currentMode === "driver" ? "Jefferson & Hoover" : "Ackerman turnaround";
  inputs.seats.value = currentMode === "driver" ? "2" : "3";
  inputs.genderPreference.value = "No preference";
  inputs.notes.value = currentMode === "driver"
    ? "Can carry one backpack per rider and prefer pickup within five minutes."
    : "Open to Uber or Lyft depending on surge pricing.";

  updateVerificationState();
  buildSummary();
  generateMatches(true);
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

inputs.email.addEventListener("input", () => {
  updateVerificationState();
  if (errors.email.textContent) {
    validateStep(1);
  }
});

inputs.name.addEventListener("input", () => setError("name", ""));
["origin", "destination", "time", "meetingPoint"].forEach((key) => {
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

updateModeUI();
updateVerificationState();
renderStep();
