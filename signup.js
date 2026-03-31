const signupForm = document.getElementById("signupForm");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupCode = document.getElementById("signupCode");
const signupNameError = document.getElementById("signupNameError");
const signupEmailError = document.getElementById("signupEmailError");
const signupCodeError = document.getElementById("signupCodeError");
const signupSchoolChip = document.getElementById("signupSchoolChip");
const signupDomainChip = document.getElementById("signupDomainChip");
const signupVerificationBadge = document.getElementById("signupVerificationBadge");
const signupVerificationText = document.getElementById("signupVerificationText");
const signupCodeStatus = document.getElementById("signupCodeStatus");
const signupSendCodeButton = document.getElementById("signupSendCodeButton");
const signupTrustDomain = document.getElementById("signupTrustDomain");
const signupTrustCode = document.getElementById("signupTrustCode");
const signupTrustEnrollment = document.getElementById("signupTrustEnrollment");

const signupSchools = {
  "usc.edu": "University of Southern California",
  "ucla.edu": "University of California, Los Angeles",
  "lmu.edu": "Loyola Marymount University",
  "caltech.edu": "California Institute of Technology",
  "pepperdine.edu": "Pepperdine University"
};

let signupIssuedCode = "";
let signupSchool = "";
let signupVerified = false;

function signupSetError(input, error, message) {
  input.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function setTrustState(element, state, text) {
  element.className = `trust-item ${state}`;
  element.textContent = text;
}

function getDomain(email) {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1] : "";
}

function resetSignupVerification() {
  signupIssuedCode = "";
  signupVerified = false;
  signupCode.value = "";
  signupCodeStatus.textContent = "No code issued yet.";
  setTrustState(signupTrustCode, "pending", "Inbox code confirmed");
  setTrustState(signupTrustEnrollment, "pending", "Active student status checked");
  signupSetError(signupCode, signupCodeError, "");
}

function updateSignupState() {
  const email = signupEmail.value.trim().toLowerCase();
  const domain = getDomain(email);

  signupSchoolChip.textContent = "School not recognized yet";
  signupDomainChip.innerHTML = "Waiting for <code>.edu</code> domain";
  signupVerificationBadge.className = "verification-badge pending";
  signupVerificationBadge.textContent = "Pending";
  signupVerificationText.textContent = "Enter your school email to begin secure student verification.";
  signupSchool = "";
  setTrustState(signupTrustDomain, "pending", "Recognized .edu domain");

  if (!email) {
    resetSignupVerification();
    return;
  }

  if (!domain.endsWith(".edu")) {
    signupVerificationBadge.className = "verification-badge blocked";
    signupVerificationBadge.textContent = "Blocked";
    signupVerificationText.textContent = "CoGO only accepts verified university email addresses ending in .edu.";
    resetSignupVerification();
    return;
  }

  signupDomainChip.textContent = `Domain detected: ${domain}`;

  if (!signupSchools[domain]) {
    signupSchoolChip.textContent = "Unsupported campus in demo";
    signupVerificationBadge.className = "verification-badge blocked";
    signupVerificationBadge.textContent = "Review";
    signupVerificationText.textContent = "This demo only recognizes a small set of Los Angeles campus domains.";
    setTrustState(signupTrustDomain, "blocked", "Recognized .edu domain");
    resetSignupVerification();
    return;
  }

  signupSchool = signupSchools[domain];
  signupSchoolChip.textContent = signupSchool;
  setTrustState(signupTrustDomain, "complete", "Recognized .edu domain");

  if (signupVerified) {
    signupVerificationBadge.className = "verification-badge verified";
    signupVerificationBadge.textContent = "Verified";
    signupVerificationText.textContent = `${signupSchool} verified. Student account is ready to continue.`;
  } else if (signupIssuedCode) {
    signupVerificationBadge.className = "verification-badge checking";
    signupVerificationBadge.textContent = "Code Sent";
    signupVerificationText.textContent = `Verification code sent to ${email}. Enter the 6-digit inbox code to continue.`;
  } else {
    signupVerificationBadge.className = "verification-badge checking";
    signupVerificationBadge.textContent = "Checking";
    signupVerificationText.textContent = `School recognized as ${signupSchool}. Send a campus code to continue.`;
  }
}

function sendSignupCode() {
  const email = signupEmail.value.trim().toLowerCase();
  const domain = getDomain(email);

  if (!email) {
    signupSetError(signupEmail, signupEmailError, "Enter your student email before requesting a code.");
    return;
  }

  if (!domain.endsWith(".edu") || !signupSchools[domain]) {
    signupSetError(signupEmail, signupEmailError, "Use a recognized campus .edu email to request a code.");
    updateSignupState();
    return;
  }

  signupSetError(signupEmail, signupEmailError, "");
  signupIssuedCode = "246810";
  signupVerified = false;
  signupVerificationBadge.className = "verification-badge checking";
  signupVerificationBadge.textContent = "Code Sent";
  signupVerificationText.textContent = `Verification email sent to ${email}. Enter the 6-digit campus code to continue.`;
  signupCodeStatus.textContent = `Demo code sent to ${email}: 246810`;
  setTrustState(signupTrustCode, "pending", "Inbox code confirmed");
  setTrustState(signupTrustEnrollment, "pending", "Active student status checked");
}

function verifySignupCode() {
  if (!signupSchool) {
    signupSetError(signupEmail, signupEmailError, "Use a recognized campus email first.");
    return false;
  }

  if (!signupIssuedCode) {
    signupSetError(signupCode, signupCodeError, "Send a verification code first.");
    return false;
  }

  if (signupCode.value.trim() !== signupIssuedCode) {
    signupVerified = false;
    signupVerificationBadge.className = "verification-badge blocked";
    signupVerificationBadge.textContent = "Code Error";
    signupVerificationText.textContent = "The verification code does not match. Please check your school inbox.";
    setTrustState(signupTrustCode, "blocked", "Inbox code confirmed");
    setTrustState(signupTrustEnrollment, "pending", "Active student status checked");
    signupSetError(signupCode, signupCodeError, "That 6-digit campus code is incorrect.");
    return false;
  }

  signupVerified = true;
  signupSetError(signupCode, signupCodeError, "");
  signupVerificationBadge.className = "verification-badge verified";
  signupVerificationBadge.textContent = "Verified";
  signupVerificationText.textContent = `${signupSchool} verified. Student account is ready to continue into CoGO.`;
  signupCodeStatus.textContent = "Verification complete. Redirecting to the main CoGO website on submit.";
  setTrustState(signupTrustCode, "complete", "Inbox code confirmed");
  setTrustState(signupTrustEnrollment, "complete", "Active student status checked");
  return true;
}

signupEmail.addEventListener("input", () => {
  resetSignupVerification();
  updateSignupState();
  signupSetError(signupEmail, signupEmailError, "");
});

signupName.addEventListener("input", () => {
  signupSetError(signupName, signupNameError, "");
});

signupCode.addEventListener("input", () => {
  signupVerified = false;
  signupSetError(signupCode, signupCodeError, "");
});

signupSendCodeButton.addEventListener("click", sendSignupCode);

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let valid = true;

  if (!signupName.value.trim()) {
    signupSetError(signupName, signupNameError, "Please enter your full name.");
    valid = false;
  }

  if (!signupEmail.value.trim()) {
    signupSetError(signupEmail, signupEmailError, "Please enter your student email.");
    valid = false;
  }

  if (!verifySignupCode()) {
    valid = false;
  }

  if (!valid) {
    return;
  }

  window.localStorage.setItem("cogoStudent", JSON.stringify({
    name: signupName.value.trim(),
    email: signupEmail.value.trim().toLowerCase(),
    school: signupSchool
  }));

  window.location.href = "main.html";
});

setTrustState(signupTrustDomain, "pending", "Recognized .edu domain");
setTrustState(signupTrustCode, "pending", "Inbox code confirmed");
setTrustState(signupTrustEnrollment, "pending", "Active student status checked");
updateSignupState();
