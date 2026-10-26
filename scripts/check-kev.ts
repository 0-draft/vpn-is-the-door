// Compare the door schedule (src/data/doors.json) with the live CISA KEV catalog.
//   node scripts/check-kev.ts [kev.json]
// Fails when a listed CVE left KEV or its date/ransomware flag changed. Also lists
// remote-access CVEs added to KEV after our pinned catalogVersion, as candidates
// to research (not added automatically: every row needs primary sources).
import { readFileSync, writeFileSync } from "node:fs";

const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
// Products whose KEV entries are candidates for the schedule.
const WATCH: [vendor: RegExp, product: RegExp][] = [
  [/fortinet/i, /fortios|fortigate|fortiproxy/i],
  [/ivanti|pulse/i, /connect secure|policy secure|pulse/i],
  [/citrix/i, /netscaler|adc|gateway/i],
  [/palo alto/i, /pan-os|globalprotect/i],
  [/sonicwall/i, /sonicos|sma/i],
  [/cisco/i, /adaptive security|asa|firepower threat defense|ftd/i],
  [/check point/i, /quantum|security gateway/i],
];

interface KevEntry {
  cveID: string;
  vendorProject: string;
  product: string;
  dateAdded: string;
  knownRansomwareCampaignUse: string;
  vulnerabilityName: string;
}
interface Kev {
  catalogVersion: string;
  vulnerabilities: KevEntry[];
}

const doors = JSON.parse(readFileSync("src/data/doors.json", "utf8")) as {
  catalogVersion: string;
  vulns: { cve: string; kevAdded: string; ransomware: "Known" | "Unknown" }[];
  excluded: { cve: string }[];
};
const file = process.argv[2];
const kev: Kev = file
  ? JSON.parse(readFileSync(file, "utf8"))
  : await (await fetch(KEV_URL, { headers: { "user-agent": "vpn-is-the-door kev check" } })).json();

const byId = new Map(kev.vulnerabilities.map((v) => [v.cveID, v]));
const drift: string[] = [];
for (const v of doors.vulns) {
  const k = byId.get(v.cve);
  if (!k) {
    drift.push(`- ${v.cve}: no longer in KEV`);
    continue;
  }
  if (k.dateAdded !== v.kevAdded) drift.push(`- ${v.cve}: dateAdded ${k.dateAdded}, ours ${v.kevAdded}`);
  if (k.knownRansomwareCampaignUse !== v.ransomware)
    drift.push(`- ${v.cve}: ransomware ${k.knownRansomwareCampaignUse}, ours ${v.ransomware}`);
}

const known = new Set([...doors.vulns.map((v) => v.cve), ...doors.excluded.map((v) => v.cve)]);
const pinned = doors.catalogVersion.replaceAll(".", "-");
const candidates = kev.vulnerabilities
  .filter((k) => !known.has(k.cveID) && k.dateAdded > pinned)
  .filter((k) => WATCH.some(([v, p]) => v.test(k.vendorProject) && p.test(k.product)))
  .map((k) => `- ${k.cveID} (${k.vendorProject} ${k.product}, added ${k.dateAdded}): ${k.vulnerabilityName}`);

const report = [
  `KEV catalogVersion ${kev.catalogVersion}; door schedule pinned to ${doors.catalogVersion}.`,
  "",
  `## Drift in listed rows (${drift.length})`,
  "",
  ...(drift.length ? drift : ["None."]),
  "",
  `## New remote-access entries to research (${candidates.length})`,
  "",
  ...(candidates.length ? candidates : ["None."]),
  "",
].join("\n");

console.log(report);
if (process.env.REPORT_FILE) writeFileSync(process.env.REPORT_FILE, report);
if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `drift=${drift.length}\ncandidates=${candidates.length}\n`, { flag: "a" });
}
process.exit(drift.length > 0 ? 1 : 0);
