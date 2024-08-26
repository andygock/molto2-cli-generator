import { OtpUriParser } from "./otp-parser.js";
import VanillaQR from "./VanillaQR.module.js";

// Copy command line to clipboard
function copyToClipboard() {
  const commandLine = document.getElementById("command-line").value;
  navigator.clipboard
    .writeText(commandLine)
    .then(() => {
      // console.log("Copied to clipboard:", commandLine);

      // save previous button text
      const previousText = document.getElementById("copy").textContent;

      // change button text to indicate success
      document.getElementById("copy").disabled = true;
      document.getElementById("copy").textContent = "Copied!";

      // reset button text after 1 second
      setTimeout(() => {
        document.getElementById("copy").textContent = previousText;
        document.getElementById("copy").disabled = false;
      }, 1000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

// Pad base32 secret to the nearest power of 2
function padBase32(secret) {
  const length = secret.length;
  const nearestPowerOf2 = Math.pow(2, Math.ceil(Math.log2(length)));
  return secret.padEnd(nearestPowerOf2, "A");
}

// save binaryDefinition, profileNumber, additionalArgs to local storage and always load them on page load
// do not save anything else to local storage
function saveToLocalStorage({ binary, profileNumber, additionalArgs }) {
  localStorage.setItem("moltoConfigBinaryDefinition", binary);
  localStorage.setItem("moltoConfigProfileNumber", profileNumber);
  localStorage.setItem("moltoConfigAdditionalArgs", additionalArgs);
}

// restore binaryDefinition, profileNumber from local storage
function restoreFromLocalStorage() {
  const binary = localStorage.getItem("moltoConfigBinaryDefinition");
  const profileNumber = localStorage.getItem("moltoConfigProfileNumber");
  const additionalArgs = localStorage.getItem("moltoConfigAdditionalArgs");

  if (binary) {
    document.getElementById("binary").value = binary;
  }

  if (profileNumber) {
    document.getElementById("profile-number").value = profileNumber;
  }

  if (additionalArgs) {
    document.getElementById("additional-args").value = additionalArgs;
  }
}

// display error message below the form
function displayError(message) {
  document.getElementById("error").textContent = message;
}

// Generate command line based on form fields
function generateCommandLine() {
  try {
    displayError("");
    const otpauthUrl = document.getElementById("otpauth-url").value;

    // parse otpauth url
    const parser = new OtpUriParser(otpauthUrl);
    parser.parse();
    const parameters = parser.getParameters();
    const { algorithm, secret, issuer } = parameters;
    const paddedSecret = padBase32(secret);
    const type = parser.getType();
    const label = parser.getLabel();

    // only 'totp' type is supported
    if (type !== "totp") {
      throw new Error("Only TOTP type is supported.");
    }

    // get form fields
    const binary = document.getElementById("binary").value;
    const profileNumber = document.getElementById("profile-number").value;
    const additionalArgs = document.getElementById("additional-args").value;

    // algorithmCode, determines the algorithm used by the OTP generator
    // if not specified, the default is SHA1 HMAC
    // 1 = SHA1 HMAC
    // 2 = SHA256 HMAC
    const algorithmCode = algorithm === "SHA256" ? 2 : 1;

    // create command line and update textarea in ui
    const commandLine = `"${binary}"${
      additionalArgs ? " " + additionalArgs : ""
    } --config --profile ${profileNumber} --seedbase32 "${paddedSecret}" --display_timeout 0 --algorithm ${algorithmCode} --timestep 1 --title ${label}`;
    document.getElementById("command-line").value = commandLine;

    // save only some fields to local storage
    saveToLocalStorage({ binary, profileNumber, additionalArgs });

    // update qrcodes

    // otp auth url
    qrOtpAuth.url = otpauthUrl;
    qrOtpAuth.init();
    document.getElementById("qrcode-otpauth").appendChild(qrOtpAuth.domElement);

    // command line
    qrCli.url = commandLine;
    qrCli.init();
    document.getElementById("qrcode-cli").appendChild(qrCli.domElement);
  } catch (error) {
    console.error(error);
    displayError(error.message);
  } finally {
  }
}

// script starts to run here

// initialise qr code for otp auth url
const qrOtpAuth = new VanillaQR({
  url: "",
  size: 200,
  colorLight: "#ffffff",
  colorDark: "#000000",
  toTable: false, // to canvas if false, borders are wrong if canvas
  ecclevel: 1, // 1 to 4
  noBorder: true,
  borderSize: 0,
});

// initialise qr code for command line
const qrCli = new VanillaQR({
  url: "",
  size: 200,
  colorLight: "#ffffff",
  colorDark: "#000000",
  toTable: false, // to canvas if false, borders are wrong if canvas
  ecclevel: 1, // 1 to 4
  noBorder: true,
  borderSize: 0,
});

// Generate command line on page load
document.addEventListener("DOMContentLoaded", function () {
  displayError("");
  restoreFromLocalStorage();
  generateCommandLine();

  // Add event listener to copy button
  document.getElementById("copy").addEventListener("click", copyToClipboard);
});

// Add event listeners to update command line on input change
document
  .getElementById("generator-form")
  .addEventListener("input", generateCommandLine);
