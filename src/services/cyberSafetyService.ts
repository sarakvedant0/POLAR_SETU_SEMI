/**
 * Cybersecurity & Content Safety Filter for POLARSETU
 * Protects the platform against abusive language, hate speech, malicious injections,
 * phishing links, and spam payloads.
 */

export interface CyberCheckResult {
  isSafe: boolean;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason?: string;
  details?: string;
  ruleTriggered?: string;
  sanitizedText?: string;
}

class CyberSafetyService {
  // Banned abusive, hate speech, and harassment patterns
  private abusivePatterns = [
    /\b(fuck|shit|bitch|bastard|asshole|idiot|moron|stupid|kill\s*yourself|hate\s*you|die|nazi|terrorist)\b/i,
    /\b(scam|free\s*crypto|bitcoin\s*giveaway|whatsapp\s*\+\d{10}|earn\s*\$5000|click\s*here\s*to\s*win)\b/i,
    /\b(slut|whore|retard|fag|nigger|chink|kike)\b/i,
  ];

  // Malicious web security & injection patterns (XSS, SQLi, prompt injection, malware)
  private maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /eval\s*\(/i,
    /document\.cookie/i,
    /UNION\s+SELECT/i,
    /DROP\s+TABLE/i,
    /\bignore\s+all\s+previous\s+instructions\b/i,
    /\bsystem\s+prompt\s+override\b/i,
    /\b(trojan|ransomware|keylogger|exploit\.exe)\b/i,
  ];

  /**
   * Scans text content for safety violations
   */
  evaluateContent(text: string, title?: string): CyberCheckResult {
    const fullContent = ((title || '') + ' ' + (text || '')).trim();

    if (!fullContent) {
      return {
        isSafe: false,
        severity: 'LOW',
        reason: 'Empty Content',
        details: 'The submitted post or observation cannot be empty.',
      };
    }

    // 1. Check for malicious code / injection payloads
    for (const pattern of this.maliciousPatterns) {
      if (pattern.test(fullContent)) {
        return {
          isSafe: false,
          severity: 'CRITICAL',
          reason: 'Cybersecurity Threat / Malicious Code Injection Detected',
          details: 'Your submission contains suspicious code syntax, unauthorized script execution tokens, or prompt injection strings prohibited by NCPOR platform security protocols.',
          ruleTriggered: 'RULE-CYBER-SEC-XSS-SQLI',
        };
      }
    }

    // 2. Check for abusive / harassment terms
    for (const pattern of this.abusivePatterns) {
      if (pattern.test(fullContent)) {
        return {
          isSafe: false,
          severity: 'HIGH',
          reason: 'Abusive or Prohibited Content Detected',
          details: 'Your submission contains offensive, abusive, or spam terminology that violates the POLARSETU Community Code of Conduct.',
          ruleTriggered: 'RULE-CONTENT-SAFETY-HARASSMENT',
        };
      }
    }

    // 3. Check for suspicious phishing URLs
    if (/https?:\/\/(?!.*(gov\.in|ncpor\.res\.in|imd\.gov\.in|zenodo\.org|doi\.org|nature\.com|sciencedirect\.com|pangaea\.de|unsplash\.com)).*(\.ru|\.xyz|\.top|\.click|\.tk)/i.test(fullContent)) {
      return {
        isSafe: false,
        severity: 'HIGH',
        reason: 'Suspicious External Link Detected',
        details: 'Only verified scientific repository domains (NCPOR, DOI, Zenodo, PANGAEA, peer-reviewed publishers) and approved image hosts are permitted.',
        ruleTriggered: 'RULE-CYBER-SEC-PHISHING',
      };
    }

    return {
      isSafe: true,
    };
  }
}

export const cyberSafetyService = new CyberSafetyService();
