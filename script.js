const tabs = document.querySelectorAll(".demo-tab");
const steps = document.querySelectorAll(".form-step");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const progressFill = document.getElementById("progressFill");
const stepIndicator = document.getElementById("stepIndicator");
const verificationBadge = document.getElementById("verificationBadge");
const verificationText = document.getElementById("verificationText");
const schoolChip = document.getElementById("schoolChip");
const domainChip = document.getElementById("domainChip");
const sendCodeButton = document.getElementById("sendCodeButton");
const codeStatus = document.getElementById("codeStatus");
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
  verificationCode: document.getElementById("verificationCode"),
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
  verificationCode: document.getElementById("verificationCodeError"),
  origin: document.getElementById("originError"),
  destination: document.getElementById("destinationError"),
  time: document.getElementById("timeError"),
  meetingPoint: document.getElementById("meetingPointError")
};

const trustItems = {
  domain: document.getElementById("trustDomain"),
  code: document.getElementById("trustCode"),
  enrollment: document.getElementById("trustEnrollment")
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
      name: "Jason Kim",
      university: "USC",
      route: "USC Village -> Santa Monica",
      time: "6:10 PM",
      meetingPoint: "Jefferson & Hoover",
      score: 96,
      driverRating: 4.9,
      riderRating: 4.8,
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
      driverRating: 4.8,
      riderRating: 4.9,
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
      driverRating: 4.7,
      riderRating: 4.6,
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
      driverRating: 4.8,
      riderRating: 5.0,
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
      driverRating: 4.9,
      riderRating: 4.8,
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
      driverRating: 4.7,
      riderRating: 4.7,
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
let issuedCode = "";
let verificationPassed = false;
let recognizedSchool = "";

function setError(key, message) {
  const input = inputs[key];
  const error = errors[key];

  if (!input || !error) {
    return;
  }

  input.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function setTrustState(element, state, text) {
  element.className = `trust-item ${state}`;
  element.textContent = text;
}

function getEmailDomain(email) {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1] : "";
}

function resetVerificationFlow() {
  issuedCode = "";
  verificationPassed = false;
  inputs.verificationCode.value = "";
  setError("verificationCode", "");
  codeStatus.textContent = "No code issued yet.";
  setTrustState(trustItems.code, "pending", "Inbox code confirmed");
  setTrustState(trustItems.enrollment, "pending", "Active student status checked");
}

function updateVerificationState() {
  const email = inputs.email.value.trim().toLowerCase();
  const domain = getEmailDomain(email);

  schoolChip.textContent = "School not recognized yet";
  domainChip.innerHTML = "Waiting for <code>.edu</code> domain";
  verificationBadge.className = "verification-badge pending";
  verificationBadge.textContent = "Pending";
  verificationText.textContent = "Enter your school email to begin secure student verification.";
  recognizedSchool = "";
  setTrustState(trustItems.domain, "pending", "Recognized .edu domain");

  if (!email) {
    resetVerificationFlow();
    return false;
  }

  if (!domain.endsWith(".edu")) {
    verificationBadge.className = "verification-badge blocked";
    verificationBadge.textContent = "Blocked";
    verificationText.textContent = "Access denied in this demo. CoGO only accepts verified university email addresses ending in .edu.";
    resetVerificationFlow();
    return false;
  }

  domainChip.textContent = `Domain detected: ${domain}`;

  if (!recognizedSchools[domain]) {
    schoolChip.textContent = "Unsupported campus in demo";
    verificationBadge.className = "verification-badge blocked";
    verificationBadge.textContent = "Review";
    verificationText.textContent = "The email is academic, but this demo only recognizes a small set of Los Angeles-area campus domains.";
    setTrustState(trustItems.domain, "blocked", "Recognized .edu domain");
    resetVerificationFlow();
    return false;
  }

  recognizedSchool = recognizedSchools[domain];
  schoolChip.textContent = recognizedSchool;
  setTrustState(trustItems.domain, "complete", "Recognized .edu domain");

  if (verificationPassed) {
    verificationBadge.className = "verification-badge verified";
    verificationBadge.textContent = "Verified";
    verificationText.textContent = `${recognizedSchool} verified. Enrollment check passed and student-only access is now enabled.`;
  } else if (issuedCode) {
    verificationBadge.className = "verification-badge checking";
    verificationBadge.textContent = "Code Sent";
    verificationText.textContent = `School recognized as ${recognizedSchool}. Enter the 6-digit inbox code to finish verification.`;
  } else {
    verificationBadge.className = "verification-badge checking";
    verificationBadge.textContent = "Checking";
    verificationText.textContent = `School recognized as ${recognizedSchool}. Send a campus code to continue.`;
  }

  return verificationPassed;
}

function issueVerificationCode() {
  const email = inputs.email.value.trim().toLowerCase();
  const domain = getEmailDomain(email);

  if (!email) {
    setError("email", "Enter your school email before requesting a verification code.");
    return;
  }

  if (!domain.endsWith(".edu") || !recognizedSchools[domain]) {
    setError("email", "Use a recognized campus .edu email to request a verification code.");
    updateVerificationState();
    return;
  }

  setError("email", "");
  issuedCode = "246810";
  verificationPassed = false;
  verificationBadge.className = "verification-badge checking";
  verificationBadge.textContent = "Code Sent";
  verificationText.textContent = `Verification email sent to ${email}. Enter the 6-digit campus code to continue.`;
  codeStatus.textContent = `Demo code sent to ${email}: 246810`;
  setTrustState(trustItems.code, "pending", "Inbox code confirmed");
  setTrustState(trustItems.enrollment, "pending", "Active student status checked");
}

function verifyCode() {
  const value = inputs.verificationCode.value.trim();

  if (!recognizedSchool) {
    setError("email", "Use a recognized campus email first.");
    return false;
  }

  if (!issuedCode) {
    setError("verificationCode", "Send a verification code first.");
    return false;
  }

  if (value !== issuedCode) {
    verificationPassed = false;
    verificationBadge.className = "verification-badge blocked";
    verificationBadge.textContent = "Code Error";
    verificationText.textContent = "The verification code does not match. Please re-check your school inbox.";
    setTrustState(trustItems.code, "blocked", "Inbox code confirmed");
    setTrustState(trustItems.enrollment, "pending", "Active student status checked");
    setError("verificationCode", "That 6-digit campus code is incorrect.");
    return false;
  }

  verificationPassed = true;
  setError("verificationCode", "");
  verificationBadge.className = "verification-badge verified";
  verificationBadge.textContent = "Verified";
  verificationText.textContent = `${recognizedSchool} verified. Enrollment check passed and student-only access is now enabled.`;
  setTrustState(trustItems.code, "complete", "Inbox code confirmed");
  setTrustState(trustItems.enrollment, "complete", "Active student status checked");
  codeStatus.textContent = "Verification complete. Your student profile is trusted for matching.";
  return true;
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
    } else if (!recognizedSchool) {
      setError("email", "Use a recognized Los Angeles campus .edu email in this demo.");
      valid = false;
    } else {
      setError("email", "");
    }

    if (!verifyCode()) {
      valid = false;
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
        Verified through <strong>${recognizedSchool}</strong> with <code>${inputs.email.value.trim()}</code>. Route:
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
      <div class="match-rating-row">
        <span class="rating-pill">Driver ${match.driverRating.toFixed(1)}/5</span>
        <span class="rating-pill">Rider ${match.riderRating.toFixed(1)}/5</span>
      </div>
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
  chatMeta.textContent = `${match.university} verified student. Driver rating ${match.driverRating.toFixed(1)}/5, rider rating ${match.riderRating.toFixed(1)}/5, compatibility ${match.score}%.`;
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
  inputs.verificationCode.value = "246810";
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
  issueVerificationCode();
  verifyCode();
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
  resetVerificationFlow();
  updateVerificationState();
  if (errors.email.textContent) {
    setError("email", "");
  }
});

inputs.verificationCode.addEventListener("input", () => {
  verificationPassed = false;
  setError("verificationCode", "");
  if (issuedCode && recognizedSchool) {
    verificationBadge.className = "verification-badge checking";
    verificationBadge.textContent = "Checking";
    verificationText.textContent = `Code entry in progress for ${recognizedSchool}.`;
  }
});

sendCodeButton.addEventListener("click", issueVerificationCode);

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

setTrustState(trustItems.domain, "pending", "Recognized .edu domain");
setTrustState(trustItems.code, "pending", "Inbox code confirmed");
setTrustState(trustItems.enrollment, "pending", "Active student status checked");
updateModeUI();
updateVerificationState();
renderStep();
