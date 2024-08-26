// example
// otpauth://totp/big?issuer=IETF&secret=NBSWY3DP&period=5&algorithm=SHA256

export class OtpUriParser {
  constructor(uri) {
    this.uri = uri;
    this.scheme = "otpauth";
    this.type = null;
    this.label = null;
    this.parameters = {};
  }

  parse() {
    // Validate scheme
    if (!this.uri.startsWith(`${this.scheme}://`)) {
      throw new Error("Invalid URI scheme. Expected 'otpauth://'");
    }

    // Remove the scheme from the URI
    const uriWithoutScheme = this.uri.slice(`${this.scheme}://`.length);

    // Split URI into type, label, and parameters
    const [typeAndLabel, params] = uriWithoutScheme.split("?");
    if (!typeAndLabel || !params) {
      throw new Error(
        "Invalid URI format. Missing type, label, or parameters."
      );
    }

    // Extract type and label
    const [type, label] = typeAndLabel.split("/");

    if (!type || !label) {
      throw new Error("Invalid URI format. Missing type or label.");
    }
    this.type = type.toLowerCase();

    // this.label = label;
    this.label = decodeURIComponent(label);

    if (this.type !== "totp" && this.type !== "hotp") {
      throw new Error("Invalid OTP type. Expected 'totp' or 'hotp'.");
    }

    // Parse parameters
    const paramPairs = params.split("&");
    paramPairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      if (!key || !value) {
        throw new Error(
          `Invalid parameter format: '${pair}'. Expected 'key=value'.`
        );
      }
      if (key.toLowerCase() === "secret") {
        this.parameters[key.toLowerCase()] =
          decodeURIComponent(value).toUpperCase();
      } else {
        this.parameters[key.toLowerCase()] = decodeURIComponent(value);
      }
    });

    // Validate required parameters
    this.validateParameters();

    // console.log("parameters", this.parameters);
    // console.log("type", this.type);
    // console.log("label", this.label);
  }

  validateParameters() {
    // Secret is required
    if (!this.parameters.secret) {
      throw new Error("Missing required 'secret' parameter.");
    }

    if (!/^[A-Z2-7]+$/.test(this.parameters.secret)) {
      throw new Error("Invalid 'secret' parameter. Must be Base32 encoded.");
    }

    // If HOTP, counter is required
    if (this.type === "hotp" && !this.parameters.counter) {
      throw new Error("Missing required 'counter' parameter for HOTP.");
    }

    // Validate optional parameters
    if (
      this.parameters.algorithm &&
      !["SHA1", "SHA256", "SHA512"].includes(
        this.parameters.algorithm.toUpperCase()
      )
    ) {
      throw new Error(
        "Invalid 'algorithm' parameter. Expected 'SHA1', 'SHA256', or 'SHA512'."
      );
    }

    if (
      this.parameters.digits &&
      !["6", "7", "8"].includes(this.parameters.digits)
    ) {
      throw new Error("Invalid 'digits' parameter. Expected '6', '7', or '8'.");
    }

    if (this.parameters.period && isNaN(parseInt(this.parameters.period, 10))) {
      throw new Error("Invalid 'period' parameter. Expected a numeric value.");
    }
  }

  getType() {
    return this.type;
  }

  getLabel() {
    return this.label;
  }

  getParameters() {
    return this.parameters;
  }
}
