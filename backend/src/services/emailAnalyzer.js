import dns from "dns/promises";
import validator from "validator";
import { disposableDomains } from "./disposableDomains.js";

function getRiskLevel(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function addRisk(reasons, reason, points) {
  reasons.push(reason);
  return points;
}

export async function analyzeEmail(rawEmail) {
  const email = String(rawEmail || "").trim().toLowerCase();
  const syntaxValid = validator.isEmail(email, {
    allow_utf8_local_part: false,
    require_tld: true
  });
  const domain = syntaxValid ? email.split("@").pop() : "";
  const localPart = syntaxValid ? email.split("@")[0] : "";

  let score = 0;
  const reasons = [];
  let disposable = false;
  let domainExists = false;
  let hasMxRecords = false;
  let mx = [];
  let addresses = [];

  if (!syntaxValid) {
    score += addRisk(reasons, "Email syntax is invalid.", 70);
  }

  if (domain) {
    disposable = disposableDomains.has(domain);
    if (disposable) {
      score += addRisk(reasons, "Domain is a known temporary email provider.", 45);
    }

    try {
      const records = await dns.resolveMx(domain);
      mx = records.map((record) => `${record.exchange} (${record.priority})`);
      hasMxRecords = records.length > 0;
      domainExists = true;
    } catch {
      try {
        addresses = await dns.resolve4(domain);
        domainExists = addresses.length > 0;
      } catch {
        domainExists = false;
      }
    }

    if (!domainExists) {
      score += addRisk(reasons, "Domain does not resolve in DNS.", 50);
    } else if (!hasMxRecords) {
      score += addRisk(reasons, "Domain resolves but has no MX mail records.", 20);
    }
  }

  if (localPart) {
    if (/\d{5,}/.test(localPart)) {
      score += addRisk(reasons, "Local part contains a long numeric sequence.", 10);
    }

    if (localPart.length > 30) {
      score += addRisk(reasons, "Local part is unusually long.", 10);
    }

    if (/^[a-z]{1,3}\d{2,}$/i.test(localPart)) {
      score += addRisk(reasons, "Local part looks auto-generated.", 12);
    }
  }

  if (syntaxValid && !disposable && domainExists && hasMxRecords && reasons.length === 0) {
    reasons.push("No obvious suspicious indicators found.");
  }

  const riskScore = Math.min(100, score);

  return {
    email,
    domain: domain || "unknown",
    syntaxValid,
    disposable,
    domainExists,
    hasMxRecords,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    reasons,
    dns: {
      mx,
      addresses
    }
  };
}
