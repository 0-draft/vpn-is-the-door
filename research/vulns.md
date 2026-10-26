# VPN / remote-access edge vulnerabilities catalog (2019-2026)

Research notes for the "VPN is the door" explainer. Compiled 2026-10-25. Every row below is in the CISA Known Exploited Vulnerabilities (KEV) catalog (feed version 2026.10.23). Anything that could not be tied to a primary or near-primary source is marked **UNVERIFIED**. Bug classes are described conceptually only, with no exploit detail.

## How to read this

- **CVSS v3**: the NVD v3.1 base score where NVD has one. Where the vendor CNA score differs, both are in the per-product notes and in `vulns.json`. Citrix and Palo Alto now publish CVSS v4 only, so for those rows the v3 number is NVD's own score.
- **Pre-auth**: "yes" means the bug is reachable before any login. "no (chained)" means the bug alone needs a login but was used in the wild chained behind a pre-auth bug.
- **First exploited**: earliest in-the-wild exploitation that a source states. "zero-day" means before the vendor disclosed it. "n-day" means after.
- **KEV ransomware**: CISA's `knownRansomwareCampaignUse` field as of the 2026-10-23 feed ("Known" or "Unknown"). CISA can flip "Unknown" to "Known" later.

## Master table

| CVE | Nickname | Vendor / product | CVSS v3 | Bug class | Pre-auth | What the attacker gets | Disclosed | First exploited | KEV added | KEV ransomware |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CVE-2019-11510 | - | Pulse Secure (now Ivanti) Pulse Connect Secure | 10.0 | Arbitrary file read (path traversal) | yes | Read files including cached plaintext credentials and session data without logging in | 2019-04-24 | 2019-08-22 (n-day, mass scanning the day after a public exploit appeared) | 2021-11-03 | Known |
| CVE-2018-13379 | - | Fortinet FortiOS SSL-VPN (FortiGate) | 9.8 | Path traversal (arbitrary system file read) | yes | Read the SSL-VPN session file, which holds usernames and plaintext passwords, without logging in | 2019-05-24 | 2019-08 (n-day, after Black Hat 2019 talk; exact date UNVERIFIED) | 2021-11-03 | Known |
| CVE-2019-19781 | Shitrix | Citrix Citrix ADC / Gateway (now NetScaler) | 9.8 | Path traversal leading to code execution | yes | Remote code execution on the appliance without logging in | 2019-12-17 | 2020-01 (n-day, after exploit code circulated about 2020-01-10) | 2021-11-03 | Known |
| CVE-2021-20016 | - | SonicWall SMA 100 SSL-VPN | 9.8 | SQL injection | yes | Read usernames, passwords and session information without logging in | 2021-01-22 | 2021-01 (zero-day) | 2021-11-03 | Known |
| CVE-2021-22893 | - | Pulse Secure (now Ivanti) Pulse Connect Secure | 10.0 | Authentication bypass (use-after-free) | yes | Remote code execution without logging in | 2021-04-20 | before 2021-04-20 (zero-day; exact start UNVERIFIED) | 2021-11-03 | Known |
| CVE-2022-42475 | - | Fortinet FortiOS SSL-VPN (FortiGate) | 9.8 | Heap-based buffer overflow | yes | Remote code execution on the firewall without logging in | 2022-12-12 | 2022-10 (zero-day; MIVD says the actor had it at least two months before disclosure) | 2022-12-13 | Known |
| CVE-2023-27997 | XORtigate | Fortinet FortiOS / FortiProxy SSL-VPN | 9.8 | Heap-based buffer overflow | yes | Remote code execution without logging in | 2023-06-12 | 2023-06 (Fortinet said it 'may have been exploited in a limited number of cases'; exact date UNVERIFIED) | 2023-06-13 | Known |
| CVE-2023-3519 | - | Citrix NetScaler ADC / Gateway | 9.8 | Code injection | yes | Remote code execution without logging in; web shell planted | 2023-07-18 | 2023-06 (zero-day) | 2023-07-19 | Known |
| CVE-2023-20269 | - | Cisco ASA / FTD remote access VPN | 5.0 | Missing separation of authentication paths (lets attackers brute-force VPN credentials) | yes | Unauthenticated brute force of valid VPN username/password pairs; does not bypass MFA where MFA is enforced | 2023-09-06 | 2023-03 (brute-force campaigns per Rapid7; exact date UNVERIFIED) | 2023-09-13 | Known |
| CVE-2023-4966 | CitrixBleed | Citrix NetScaler ADC / Gateway | 9.4 | Out-of-bounds memory read that leaks session tokens | yes | Steal a valid post-MFA session cookie and take over the session without username, password or MFA | 2023-10-10 | 2023-08 late (zero-day, Mandiant) | 2023-10-18 | Known |
| CVE-2023-46805 | - | Ivanti Ivanti Connect Secure / Policy Secure | 8.2 | Authentication bypass | yes | Reach restricted resources without logging in; chained with CVE-2024-21887 for root-level command execution | 2024-01-10 | 2023-12 (zero-day, UNC5221 / UTA0178) | 2024-01-10 | Known |
| CVE-2024-21887 | - | Ivanti Ivanti Connect Secure / Policy Secure | 9.1 | Command injection | no (chained) | Arbitrary command execution; unauthenticated when chained with CVE-2023-46805 | 2024-01-10 | 2023-12 (zero-day, chained with CVE-2023-46805) | 2024-01-10 | Known |
| CVE-2024-21762 | - | Fortinet FortiOS SSL-VPN (FortiGate) | 9.8 | Out-of-bounds write | yes | Remote code execution without logging in | 2024-02-08 | 2024-02 (vendor said 'potentially exploited' at disclosure; exact date UNVERIFIED) | 2024-02-09 | Known |
| CVE-2024-3400 | - | Palo Alto Networks PAN-OS GlobalProtect | 10.0 | OS command injection | yes | Remote code execution on the firewall without logging in | 2024-04-12 | 2024-03-26 (zero-day test attempts; working exploitation detected 2024-04-10) | 2024-04-12 | Known |
| CVE-2024-24919 | - | Check Point Quantum Security Gateway (Remote Access VPN / Mobile Access) | 8.6 | Path traversal (arbitrary file read) | yes | Read files such as local account password hashes without logging in; seen leading to NTDS.dit theft within hours | 2024-05-28 | 2024-04-07 (zero-day; Check Point revised from 2024-04-30) | 2024-05-30 | Known |
| CVE-2024-40766 | - | SonicWall SonicOS (firewall management and SSLVPN) | 9.3 | Improper access control | yes | Unauthorized access to firewall resources; used for SSLVPN initial access by ransomware | 2024-08-22 | 2024-08/09 (n-day; exact date UNVERIFIED) | 2024-09-09 | Known |
| CVE-2024-53704 | - | SonicWall SonicOS SSLVPN | 8.2 | Authentication bypass that hijacks active VPN sessions | yes | Take over a logged-in user's SSL VPN session (bypassing password and MFA) and open a tunnel into the network | 2025-01-07 | 2025-02 (n-day, shortly after the PoC was published 2025-02-10) | 2025-02-18 | Known |
| CVE-2025-0282 | - | Ivanti Ivanti Connect Secure | 9.0 | Stack-based buffer overflow | yes | Remote code execution without logging in | 2025-01-08 | 2024-12 mid (zero-day, Mandiant) | 2025-01-08 | Known |
| CVE-2025-22457 | - | Ivanti Ivanti Connect Secure | 9.0 | Stack-based buffer overflow | yes | Remote code execution without logging in | 2025-04-03 | 2025-03 mid (n-day against unpatched 22.7R2.5 and earlier) | 2025-04-04 | Known |
| CVE-2025-5777 | CitrixBleed 2 | Citrix NetScaler ADC / Gateway | 7.5 | Out-of-bounds memory read that leaks session tokens | yes | Leak session tokens from memory and hijack sessions, bypassing MFA | 2025-06-17 | 2025-06 mid/late (n-day; before public PoCs on 2025-07-04/07; exact date UNVERIFIED) | 2025-07-10 | Known |
| CVE-2025-6543 | - | Citrix NetScaler ADC / Gateway | 9.8 | Memory overflow (initially described as DoS) | yes | Remote code execution in practice; web shells planted | 2025-06-25 | 2025-05 early (zero-day, NCSC-NL) | 2025-06-30 | Unknown |
| CVE-2025-7775 | - | Citrix NetScaler ADC / Gateway | 9.8 | Memory overflow | yes | Remote code execution and/or DoS without logging in (Gateway/AAA configs) | 2025-08-26 | 2025-08 (zero-day, exploited at disclosure; exact date UNVERIFIED) | 2025-08-26 | Unknown |
| CVE-2025-20333 | - | Cisco Secure Firewall ASA / FTD VPN web server | 9.9 | Buffer overflow | no (chained) | Code execution as root (needs VPN credentials alone; used with CVE-2025-20362) | 2025-09-25 | 2025-05 or earlier (zero-day, ArcaneDoor / UAT4356) | 2025-09-25 | Unknown |
| CVE-2025-20362 | - | Cisco Secure Firewall ASA / FTD VPN web server | 6.5 | Missing authorization | yes | Reach restricted VPN URL endpoints without logging in; chained with CVE-2025-20333 in ArcaneDoor | 2025-09-25 | 2025-05 or earlier (zero-day; Cisco engaged by government agencies in May 2025) | 2025-09-25 | Unknown |
| CVE-2026-24858 | - | Fortinet FortiOS (and FortiManager/FortiAnalyzer/FortiProxy/FortiWeb) FortiCloud SSO | 9.8 | Authentication bypass via alternate path (cloud SSO trust) | yes | Admin login to other customers' devices that have FortiCloud SSO enabled; attackers created admin accounts and exfiltrated configs | 2026-01-27 | 2026-01-20 (zero-day; customer reports, secondary) | 2026-01-27 | Unknown |
| CVE-2025-68686 | - | Fortinet FortiOS SSL-VPN | 5.9 | Information exposure (bypass of the anti-symlink-persistence patch) | yes | On an already-compromised device, read files through the leftover symlink despite Fortinet's cleanup patch | 2026-02-10 | UNVERIFIED (KEV lists it; vendor page says 'Known Exploited: No') | 2026-07-27 | Unknown |
| CVE-2026-3055 | - | Citrix NetScaler ADC / Gateway (SAML IdP config) | 9.8 | Out-of-bounds memory read (two overread bugs under one CVE) | yes | Leak appliance memory, potentially including admin session IDs, without logging in | 2026-03-23 | 2026-03-27 (n-day, 4 days after disclosure) | 2026-03-30 | Unknown |
| CVE-2026-0257 | - | Palo Alto Networks PAN-OS GlobalProtect portal/gateway (and some Prisma Access) | 9.1 | Authentication bypass (trusts forged authentication-override cookies) | yes | Establish an unauthorized VPN connection without valid credentials (and so without MFA) | 2026-05-13 | 2026-05-17 (n-day, per Rapid7 via secondary) | 2026-05-29 | Known |
| CVE-2026-50751 | - | Check Point Quantum Security Gateway Remote Access VPN / Mobile Access / Spark (IKEv1) | 9.3 | Improper authentication (certificate-validation logic flaw in legacy IKEv1) | yes | Establish a remote-access VPN session without a valid password | 2026-06-08 | 2026-05-07 (zero-day) | 2026-06-08 | Known |
| CVE-2026-8452 | - | Citrix NetScaler ADC / Gateway (Gateway or AAA vserver, SAML) | UNVERIFIED | Heap memory overflow in SAML processing | yes | Vendor rates it DoS; public research shows unauthenticated RCE and attackers dropping web shells | 2026-06-30 | 2026-08 (n-day, after watchTowr research 2026-08-14; exact date UNVERIFIED) | 2026-08-26 | Unknown |
| CVE-2026-15409 | - | SonicWall SMA 1000 (Work Place interface) | 10.0 | Server-side request forgery (chained with CVE-2026-15410 code injection) | yes | Unauthenticated access to internal-only services; with CVE-2026-15410, root code execution | 2026-07-14 | before 2026-07-14 (zero-day, Rapid7 MDR) | 2026-07-14 | Known |
| CVE-2026-104935 | - | Ivanti Ivanti Connect Secure 22.8 / 25.1 | 8.6 | Authentication bypass by spoofing plus RCE (third privilege-escalation bug in the chain still unpatched) | yes | Unauthenticated root-level code execution on a fully patched appliance (when chained) | 2026-10-13 | 2026-10-03 (zero-day, Volexity) | 2026-10-13 | Unknown |

## Per-product notes

### Fortinet FortiGate / FortiOS SSL-VPN

- **The most-hit family by volume.** Five FortiOS SSL-VPN pre-auth bugs are in KEV with the ransomware flag set: CVE-2018-13379, CVE-2022-42475, CVE-2023-27997, CVE-2024-21762, and CVE-2020-12812 (an SSL-VPN 2FA bypass, not tabled here). The KEV entries are linked from the JSON.
- **87,000-device credential leak (confirmed).** On 2021-09-08 Fortinet said a threat actor had published SSL-VPN access information for 87,000 FortiGate devices, obtained through CVE-2018-13379. Fortinet's warning: devices patched but never password-reset "remain vulnerable" ([Fortinet PSIRT blog](https://www.fortinet.com/blog/psirt-blogs/malicious-actor-discloses-fortigate-ssl-vpn-credentials)).
- **Symlink persistence that survived patching (April 2025).** Attackers who got in through FG-IR-22-398 / 23-097 / 24-015 left a symbolic link in the SSL-VPN language-file folder. The link exposed the root filesystem read-only, including configs. Fortinet: "even if the customer device was updated with FortiOS versions that addressed the original vulnerabilities, this symbolic link may have been left behind". Cleanup arrived in FortiOS 7.6.2 / 7.4.7 / 7.2.11 / 7.0.17 / 6.4.16 ([Fortinet, 2025-04-10](https://www.fortinet.com/blog/psirt-blogs/analysis-of-threat-actor-activity)). In February 2026 Fortinet published CVE-2025-68686, a bypass of that cleanup patch on already-compromised devices. FortiOS 7.2/7.0/6.4 have no in-branch fix ([FG-IR-25-934](https://fortiguard.fortinet.com/psirt/FG-IR-25-934)).
- **COATHANGER.** Dutch MIVD/AIVD: a FortiGate RAT planted after CVE-2022-42475 exploitation "survives reboots and firmware upgrades". The MIVD later said the campaign reached more than 20,000 FortiGates across 2022-2023 ([MIVD/AIVD advisory mirror](https://www.agilicus.com/www/TLP-CLEAR+MIVD+AIVD+Advisory+COATHANGER.pdf), [The Hacker News](https://thehackernews.com/2024/02/chinese-hackers-exploited-fortigate.html)).
- **2025-2026: the cloud-SSO admin plane.** CVE-2025-59718 (Dec 2025, KEV 2025-12-16) and then CVE-2026-24858 (Jan 2026 zero-day, FG-IR-26-060) let attackers log in as admin through FortiCloud SSO. CVE-2026-24858 also worked on devices already patched for the December bug ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-24858), [Censys](https://censys.com/advisory/cve-2026-24858/)).

### Ivanti Connect Secure (formerly Pulse Connect Secure)

- **Lineage.** CVE-2019-11510 (2019) → CVE-2021-22893 (2021, CISA ED 21-03) → CVE-2023-46805 + CVE-2024-21887 (2024, CISA ED 24-01) → CVE-2025-0282 and CVE-2025-22457 (2025) → CVE-2026-104935 (Oct 2026). Every entry was exploited in the wild and almost every one was a zero-day.
- **ED 24-01.** CISA ordered federal agencies to apply mitigations by 2024-01-22. Supplemental direction then ordered agencies to *disconnect all instances* by 2024-02-02, factory-reset and rebuild them, and treat linked domain accounts as compromised ([CISA ED 24-01](https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities)).
- **Integrity Checker Tool evasion.** CISA found the internal and external ICT "failed to detect compromise" and saw web shells on systems that ICT reported clean. Its lab research says an actor may "maintain persistence despite issuing factory resets and appliance upgrades" ([CISA AA24-060B](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060b)). In 2025 Mandiant documented malware that rewrote and re-signed the ICT manifest, faked a successful upgrade, and copied itself into the new partition during a real upgrade ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/ivanti-connect-secure-vpn-zero-day)).
- **Patch-diffing.** CVE-2025-22457 was silently fixed as a product bug on 2025-02-11. The attackers "likely studied the patch" and were exploiting unpatched boxes by mid-March ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/china-nexus-exploiting-critical-ivanti-vulnerability)).
- **Oct 2026.** CVE-2026-104935 was chained into unauthenticated root on a fully patched 22.8R2.4 appliance, starting 2026-10-03. The actor used no implant and the ICT did not detect it. A third bug in the chain (privilege escalation) was still unpatched at disclosure ([Volexity](https://www.volexity.com/blog/2026/10/13/a-series-of-unauthenticated-events-chained-exploitation-of-ivanti-connect-secure-zero-days/)).

### Citrix NetScaler ADC / Gateway

- **Shitrix (CVE-2019-19781).** Disclosed 2019-12-17 with mitigations only. Exploit code circulated within weeks, and firmware fixes did not land until 2020-01-19 to 2020-01-24 ([CISA AA20-020A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-020a), [AA20-031A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-031a)).
- **CitrixBleed (CVE-2023-4966).** An out-of-bounds read returns memory that can contain a valid post-MFA session cookie. With that cookie an attacker has a session "without the username, password, or MFA token" ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/session-hijacking-citrix-cve-2023-4966)). LockBit 3.0 affiliates used it against Boeing Distribution Inc. ([CISA AA23-325A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a)). The ICBC Financial Services link is press-reported only (**UNVERIFIED** in primary sources; [Dark Reading](https://www.darkreading.com/vulnerabilities-threats/citrixbleed-linked-to-ransomware-hit-on-china-s-state-owned-bank)).
- **CitrixBleed 2 (CVE-2025-5777).** Same bug class. It was exploited before public PoCs, and patching was not enough because sessions also had to be killed ([Tenable FAQ](https://www.tenable.com/blog/cve-2025-5777-cve-2025-6543-frequently-asked-questions-about-citrixbleed-2)).
- **2025-2026 stream.** CVE-2025-6543 was a zero-day from early May 2025 against Dutch critical organisations ([The Hacker News on NCSC-NL](https://thehackernews.com/2025/08/dutch-ncsc-confirms-active-exploitation.html)). It was followed by CVE-2025-7775 (zero-day at disclosure), CVE-2026-3055 (SAML-IdP memory overread, exploited 4 days after disclosure per [watchTowr](https://watchtowr.com/resources/rapid-reaction-to-cve-2026-3055/)) and CVE-2026-8452 (SAML heap overflow, KEV 2026-08-26). KEV also lists three more NetScaler entries added 2026-09-27 to 2026-10-04: CVE-2026-88771, CVE-2026-88772 and CVE-2026-88779. Those were not researched here (**UNVERIFIED** detail).

### Palo Alto Networks PAN-OS GlobalProtect

- **CVE-2024-3400.** Command injection in GlobalProtect, CVSS 10.0, pre-auth root-level RCE. Test attempts started 2024-03-26 and working exploitation was detected 2024-04-10, two days before disclosure. The actor (UTA0218) pivoted inward and took NTDS.dit and browser credential stores ([Volexity](https://www.volexity.com/blog/2024/04/12/zero-day-exploitation-of-unauthenticated-remote-code-execution-vulnerability-in-globalprotect-cve-2024-3400/)).
- **CVE-2026-0257.** GlobalProtect trusted authentication-override cookies without integrity checks, so an attacker could open a VPN session with no credentials. Exploited from 2026-05-17 (Rapid7, via secondary). Unit 42 named Qilin and Inc operators in an October 2026 update (secondary: [Help Net Security](https://www.helpnetsecurity.com/2026/10/21/ransomware-groups-exploit-palo-alto-globalprotect-cve-2026-0257/)). It needs a non-default feature plus a specific certificate setup ([vendor advisory](https://security.paloaltonetworks.com/CVE-2026-0257)).
- **Older history.** CVE-2019-1579 (GlobalProtect pre-auth RCE, 2019) and CVE-2020-2021 (SAML auth bypass) are also in KEV with the ransomware flag "Known" (KEV feed, not tabled).

### SonicWall SMA / SonicOS SSLVPN

- **CVE-2021-20016.** A zero-day in SMA 100, also used against SonicWall itself. Mandiant tied it to UNC2447 and FiveHands ransomware ([The Hacker News](https://thehackernews.com/2021/04/hackers-exploit-sonicwall-zero-day-bug.html)).
- **CVE-2024-40766 and the 2025 Akira wave.** In August 2025 SonicWall said the surge was not a zero-day. It was CVE-2024-40766 plus local passwords carried over in Gen 6 → Gen 7 migrations and never reset ([The Hacker News](https://thehackernews.com/2025/08/sonicwall-confirms-patched.html), [Help Net Security](https://www.helpnetsecurity.com/2025/08/07/sonicwall-gen-7-firewalls-exploit-vulnerability/)).
- **CVE-2024-53704.** An SSLVPN session hijack, exploited within days of the PoC ([Bishop Fox](https://bishopfox.com/blog/sonicwall-cve-2024-53704-ssl-vpn-session-hijacking), [Arctic Wolf](https://arcticwolf.com/resources/blog/cve-2024-53704/)).
- **SMA 1000, 2025-2026.** CVE-2025-23006 (KEV 2025-01-24, ransomware "Known"), CVE-2025-40602 (KEV 2025-12-17), and the CVE-2026-15409 + 15410 zero-day chain (KEV 2026-07-14, both ransomware "Known"; [Tenable](https://www.tenable.com/blog/cve-2026-15409-cve-2026-15410-sonicwall-sma-1000-zero-day-vulnerabilities-exploited-in-the)).

### Cisco ASA / FTD (AnyConnect / Secure Client remote access VPN)

- **Credentials as the attack surface.** CVE-2023-20269 does not bypass auth. It lets attackers brute-force VPN credentials, and Akira targeted Cisco VPNs without MFA ([Cisco PSIRT blog](https://blogs.cisco.com/security/akira-ransomware-targeting-vpns-without-multi-factor-authentication)).
- **ArcaneDoor.** The 2024 wave used CVE-2024-20353 and CVE-2024-20359 (KEV 2024-04-24). The 2025 wave used CVE-2025-20362 + CVE-2025-20333 and led to CISA ED 25-03. The actor modified ASA ROM "to persist through reboot and system upgrade" ([CISA ED 25-03](https://www.cisa.gov/news-events/directives/ed-25-03-identify-and-mitigate-potential-compromise-cisco-devices)). NCSC UK named the bootkit RayInitiator and the loader LINE VIPER ([NCSC](https://www.ncsc.gov.uk/news/persistent-malicious-targeting-cisco-devices)).
- **2026.** CVE-2026-20349 is a pre-auth RA SSL VPN crash (DoS only), exploited and added to KEV 2026-08-11 (secondary: [The Hacker News](https://thehackernews.com/2026/08/cisco-asa-and-ftd-flaw-exploited-in.html)). It is not tabled because it is not an entry vector.

### Check Point Quantum Security Gateway

- **CVE-2024-24919.** A file read on gateways with Remote Access VPN or Mobile Access, exploited from 2024-04-07. Attackers pulled local-account password hashes, and in one case NTDS.dit within 2-3 hours of logging in ([mnemonic](https://www.mnemonic.io/resources/blog/advisory-check-point-remote-access-vpn-vulnerability-cve-2024-24919/), [Help Net Security](https://www.helpnetsecurity.com/2024/05/31/cve-2024-24919/)).
- **CVE-2026-50751.** An IKEv1 remote-access auth bypass that gives a VPN session with no valid password. A zero-day from 2026-05-07, with one incident tied to a Qilin affiliate at medium confidence ([Rapid7](https://www.rapid7.com/blog/post/etr-critical-check-point-vpn-zero-day-exploited-in-the-wild-cve-2026-50751/)).

## Japan relevance

- **National Police Agency statistics (primary).** For H1 2025, VPN devices made up 62.2% of ransomware intrusion routes and remote desktop 22.2%. 52% of VPN-using organisations surveyed had *not* applied the latest patch, and 39.8% authenticated remote access with ID/password only ([NPA leaflet, Jan 2026, citing the H1 2025 report](https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf), [H1 2025 report](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7kami/R07_kami_cyber_jyosei.pdf)).
- **NPA full-year 2025: UNVERIFIED.** VPN devices are reported as 61 of 92 (66.3%). This figure is only from secondary coverage, because the primary PDF was too large to fetch. Primary location: [Nara Prefectural Police mirror of the NPA report](https://www.police.pref.nara.jp/cmsfiles/contents/0000003/3629/R07_cyber_jousei.pdf).
- **Fortinet's Japan footprint: UNVERIFIED as market share.** No IDC Japan primary was found. The best public proxy is the Nikkei xTECH IT-manager survey "ネットワーク機器利用実態調査2025". Its headline says Fortinet is approaching 50% in UTM/firewall, but the exact figure is behind the paywall page ([Nikkei xTECH, 2025-10-29](https://xtech.nikkei.com/atcl/nxt/column/18/03360/100100003/)). Resellers cite 45.2% for Fortinet in the 2022 survey, against 19.6% for Palo Alto and 14.6% for Cisco (secondary). This is usage share among survey respondents, not shipment share.
- **Japanese incidents tied to FortiGate SSL-VPN.** For the 2021 Tsurugi Town Handa Hospital ransomware case, the expert-panel report concludes the FortiGate 60E's unpatched CVE-2018-13379 was the very likely entry point and lists the 2021 credential-leak reporting ([report, technical volume](https://www.handa-hospital.jp/topics/2022/0616/report_02.pdf)). For the 2022 Osaka General Medical Center case, entry came via a catering supplier's remote-maintenance VPN device, "possibly using leaked and published ID/password" ([report summary](https://www.gh.opho.jp/pdf/reportgaiyo_v01.pdf)).
- **Ivanti in Japan.** JPCERT/CC confirmed multiple domestic victims of CVE-2025-0282 from late December 2024, before disclosure ([JPCERT-AT-2025-0001](https://www.jpcert.or.jp/at/2025/at250001.html), [SPAWNCHIMERA analysis](https://blogs.jpcert.or.jp/ja/2025/02/spawnchimera.html)).
- **Pulse Secure 2019.** Bad Packets' August 2019 scan reportedly ranked Japan second by count of vulnerable CVE-2019-11510 endpoints (secondary: [Radiflow summary](https://www.radiflow.com/blog/1913/)).

## Evidence mapped to the explainer points

### (a) The bug is reachable before login, so passwords and MFA do not help

- 30 of the 32 tabled CVEs are pre-auth. The two exceptions, CVE-2024-21887 and CVE-2025-20333, were exploited chained behind pre-auth bugs (CVE-2023-46805 and CVE-2025-20362). CVE-2025-68686 is reachable without login but only matters on an already-compromised device. See the `preauth` field in `vulns.json`.
- CVE-2024-3400 is "unauthenticated remote code execution", CVSS 10.0 ([Volexity](https://www.volexity.com/blog/2024/04/12/zero-day-exploitation-of-unauthenticated-remote-code-execution-vulnerability-in-globalprotect-cve-2024-3400/)). CVE-2023-3519 is "an unauthenticated remote code execution (RCE) vulnerability" ([CISA AA23-201A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-201a)). CVE-2025-0282 is an "unauthenticated stack-based buffer overflow" ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/ivanti-connect-secure-vpn-zero-day)).
- CVE-2018-13379 and CVE-2019-11510 are pre-auth file reads that hand over the credentials themselves ([Fortinet](https://www.fortinet.com/blog/psirt-blogs/malicious-actor-discloses-fortigate-ssl-vpn-credentials), [CISA AA20-107A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-107a)).
- CVE-2026-50751 and CVE-2026-0257 give a VPN session with no valid password at all ([Rapid7](https://www.rapid7.com/blog/post/etr-critical-check-point-vpn-zero-day-exploited-in-the-wild-cve-2026-50751/), [Palo Alto](https://security.paloaltonetworks.com/CVE-2026-0257)).

### (b) Stolen session tokens bypass MFA

- CitrixBleed "allows threat actors to bypass password requirements and multifactor authentication (MFA)" ([CISA AA23-325A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a)). The leaked cookie "is issued after authentication, including MFA checks" ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/session-hijacking-citrix-cve-2023-4966)).
- CitrixBleed 2: attackers hijacked sessions and bypassed MFA. Patching without killing sessions left them valid ([Tenable](https://www.tenable.com/blog/cve-2025-5777-cve-2025-6543-frequently-asked-questions-about-citrixbleed-2)).
- SonicWall CVE-2024-53704 hijacks a logged-in user's SSLVPN session and lets the attacker open a tunnel ([Bishop Fox](https://bishopfox.com/blog/sonicwall-cve-2024-53704-ssl-vpn-session-hijacking)).
- CVE-2026-3055 can leak admin session identifiers from memory ([watchTowr](https://labs.watchtowr.com/please-we-beg-just-one-weekend-free-of-appliances-citrix-netscaler-cve-2026-3055-memory-overread-part-2/)).
- Counterpoint for honesty: Cisco CVE-2023-20269 does *not* bypass MFA. Akira went after VPNs where MFA was absent ([Cisco](https://blogs.cisco.com/security/akira-ransomware-targeting-vpns-without-multi-factor-authentication)).

### (c) Leaked credential lists keep working after patching

- Fortinet, 2021: 87,000 devices' SSL-VPN credentials were published, and patched devices "remain vulnerable" without a password reset ([Fortinet](https://www.fortinet.com/blog/psirt-blogs/malicious-actor-discloses-fortigate-ssl-vpn-credentials)).
- CISA, 2020: attackers who stole Pulse Secure credentials kept access after patching if the victims "did not change those stolen credentials" ([CISA AA20-107A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-107a)).
- SonicWall, 2025: Akira's wave rode credentials carried over through firmware migration that were never reset ([The Hacker News](https://thehackernews.com/2025/08/sonicwall-confirms-patched.html)).
- Check Point, 2024: the first sign was logins with "old local accounts with unrecommended password-only authentication". Remediation includes password resets ([Help Net Security, quoting Check Point](https://www.helpnetsecurity.com/2024/05/31/cve-2024-24919/)).
- Japan: the Handa Hospital and Osaka General Medical Center reports both point to old FortiGate VPNs and leaked or published credentials ([Handa report](https://www.handa-hospital.jp/topics/2022/0616/report_02.pdf), [OGMC summary](https://www.gh.opho.jp/pdf/reportgaiyo_v01.pdf)).

### (d) Persistence survives patching or upgrades

- Fortinet symlink, 2025: the link "may have been left behind" after updating to fixed FortiOS. A 2026 CVE then bypassed the cleanup ([Fortinet blog](https://www.fortinet.com/blog/psirt-blogs/analysis-of-threat-actor-activity), [FG-IR-25-934](https://fortiguard.fortinet.com/psirt/FG-IR-25-934)).
- COATHANGER "survives reboots and firmware upgrades" ([MIVD/AIVD](https://www.agilicus.com/www/TLP-CLEAR+MIVD+AIVD+Advisory+COATHANGER.pdf)).
- Ivanti: actors may "maintain persistence despite issuing factory resets and appliance upgrades", and ICT missed web shells ([CISA AA24-060B](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060b)). Malware has also faked upgrades and survived real ones ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/ivanti-connect-secure-vpn-zero-day)).
- Cisco ArcaneDoor: ROM modification persists "through reboot and system upgrade", and updates do "not necessarily remove" the actor ([CISA ED 25-03](https://www.cisa.gov/news-events/directives/ed-25-03-identify-and-mitigate-potential-compromise-cisco-devices)).
- Citrix CVE-2025-6543: NCSC-NL says updating does not remove an existing compromise ([The Hacker News](https://thehackernews.com/2025/08/dutch-ncsc-confirms-active-exploitation.html)).

### (e) Disclosure to mass exploitation can be hours or days, and often negative

- **Negative gap (zero-day, exploited before disclosure).** CVE-2024-3400 (2024-03-26 vs 2024-04-12), CVE-2023-4966 (late Aug vs 2023-10-10), CVE-2024-24919 (2024-04-07 vs 2024-05-28), CVE-2025-0282 (mid-Dec 2024 vs 2025-01-08), CVE-2025-6543 (early May vs 2025-06-25), CVE-2026-50751 (2026-05-07 vs 2026-06-08), CVE-2026-104935 (2026-10-03 vs 2026-10-13). Sources are in the table rows.
- **Days.** CVE-2026-3055 was exploited 4 days after disclosure ([watchTowr](https://watchtowr.com/resources/rapid-reaction-to-cve-2026-3055/)). CVE-2026-0257 took 4 days (secondary). CVE-2024-53704 was hit shortly after the 2025-02-10 PoC ([Arctic Wolf](https://arcticwolf.com/resources/blog/cve-2024-53704/)). For CVE-2019-11510, mass scanning began the day after a public exploit (secondary, [Radiflow on Bad Packets](https://www.radiflow.com/blog/1913/)).
- **Same-day KEV.** CISA added CVE-2023-46805/CVE-2024-21887, CVE-2024-3400, CVE-2025-0282, CVE-2025-7775, CVE-2025-20333/20362, CVE-2026-24858, CVE-2026-50751, CVE-2026-15409 and CVE-2026-104935 to KEV on their disclosure day. CitrixBleed 2 got a one-day federal deadline ([BleepingComputer](https://www.bleepingcomputer.com/news/security/cisa-tags-citrix-bleed-2-as-exploited-gives-agencies-a-day-to-patch/)).
- **Patch-diffing.** For CVE-2025-22457, a silent fix on 2025-02-11 was weaponised by mid-March ([Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/china-nexus-exploiting-critical-ivanti-vulnerability)).
- **Long tail.** Bad Packets still counted 3,623 unpatched Pulse servers on 2020-01-10, nine months after the patch (secondary, [Radiflow](https://www.radiflow.com/blog/1913/)).

## Timeline (for the figure)

- 2019-04-24: Pulse Secure discloses CVE-2019-11510
- 2019-05-24: Fortinet discloses CVE-2018-13379 (FG-IR-18-384; day **UNVERIFIED**, "May 2019" per Fortinet)
- 2019-08-22: Mass scanning for CVE-2019-11510 begins
- 2019-12-17: Citrix discloses CVE-2019-19781 "Shitrix" (mitigation only)
- 2020-01-10: CISA AA20-010A on continued Pulse exploitation; Shitrix exploit code circulating
- 2020-01-19: First Citrix firmware fix for CVE-2019-19781 (all fixes by 2020-01-24)
- 2020-04-16: CISA AA20-107A: stolen Pulse credentials keep working after patching
- 2021-01-22: SonicWall SMA 100 zero-day (CVE-2021-20016) disclosed
- 2021-04-20: Pulse CVE-2021-22893 zero-day disclosed; CISA ED 21-03
- 2021-09-08: Fortinet confirms 87,000-device SSL-VPN credential leak
- 2021-10: Handa Hospital (Japan) ransomware via FortiGate (day **UNVERIFIED**)
- 2021-11-03: CISA launches KEV; the 2018-2021 VPN bugs are added
- 2022-10: CVE-2022-42475 exploited as a zero-day (per MIVD)
- 2022-10: Osaka General Medical Center ransomware via supplier VPN (day **UNVERIFIED**)
- 2022-12-12: Fortinet discloses CVE-2022-42475
- 2023-06: CVE-2023-3519 zero-day hits a US critical-infrastructure org
- 2023-06-12: Fortinet discloses CVE-2023-27997 "XORtigate"
- 2023-07-18: Citrix discloses CVE-2023-3519
- 2023-08 (late): CitrixBleed zero-day exploitation begins
- 2023-08-24: Cisco warns Akira is targeting VPNs without MFA
- 2023-09-06: Cisco discloses CVE-2023-20269
- 2023-10-10: Citrix discloses CVE-2023-4966 "CitrixBleed"
- 2023-11-21: CISA/FBI AA23-325A: LockBit via CitrixBleed (Boeing)
- 2023-12: Ivanti CVE-2023-46805 / CVE-2024-21887 zero-day exploitation
- 2024-01-10: Ivanti discloses CVE-2023-46805 / CVE-2024-21887
- 2024-01-19: CISA Emergency Directive 24-01
- 2024-02-02: ED 24-01 deadline to disconnect all federal Ivanti instances
- 2024-02-06: MIVD/AIVD COATHANGER advisory (FortiGate persistence across upgrades); date per press, **UNVERIFIED** exact day
- 2024-02-08: Fortinet discloses CVE-2024-21762
- 2024-02-29: CISA AA24-060B: Ivanti ICT misses compromises
- 2024-03-26: First CVE-2024-3400 test exploitation
- 2024-04-07: First CVE-2024-24919 exploitation
- 2024-04-12: Palo Alto discloses CVE-2024-3400
- 2024-05-28: Check Point discloses CVE-2024-24919
- 2024-08-22: SonicWall discloses CVE-2024-40766
- 2024-12 (mid): Ivanti CVE-2025-0282 zero-day exploitation begins (Japan victims from late Dec)
- 2025-01-07: SonicWall discloses CVE-2024-53704
- 2025-01-08: Ivanti discloses CVE-2025-0282
- 2025-02-10: Bishop Fox PoC for CVE-2024-53704; exploitation follows within days
- 2025-02-11: Ivanti silently fixes the CVE-2025-22457 bug (22.7R2.6)
- 2025-03 (mid): CVE-2025-22457 exploited
- 2025-04-03: Ivanti discloses CVE-2025-22457
- 2025-04-10: Fortinet discloses symlink persistence that survived patching
- 2025-05: Cisco engaged on ArcaneDoor 2025; CVE-2025-6543 zero-day exploitation begins
- 2025-06-17: Citrix discloses CVE-2025-5777 "CitrixBleed 2"
- 2025-06-25: Citrix discloses CVE-2025-6543
- 2025-07-10: CitrixBleed 2 added to KEV with a one-day deadline
- 2025-08-06: SonicWall ties the Akira wave to CVE-2024-40766 and un-reset migrated passwords
- 2025-08-26: Citrix discloses CVE-2025-7775 (zero-day)
- 2025-09-25: Cisco discloses CVE-2025-20333 / 20362; CISA Emergency Directive 25-03
- 2026-01-20: FortiCloud SSO zero-day (CVE-2026-24858) attacks reported
- 2026-01-27: Fortinet discloses CVE-2026-24858
- 2026-02-10: Fortinet discloses CVE-2025-68686 (bypass of the symlink cleanup)
- 2026-03-23: Citrix discloses CVE-2026-3055
- 2026-03-27: CVE-2026-3055 exploited (4 days)
- 2026-05-07: Check Point CVE-2026-50751 zero-day exploitation begins
- 2026-05-13: Palo Alto discloses CVE-2026-0257
- 2026-05-17: CVE-2026-0257 exploited (secondary)
- 2026-06-08: Check Point discloses CVE-2026-50751; added to KEV with the ransomware flag
- 2026-06-30: Citrix discloses CVE-2026-8452
- 2026-07-14: SonicWall SMA 1000 CVE-2026-15409/15410 zero-days disclosed
- 2026-08-26: CVE-2026-8452 added to KEV
- 2026-10-03: Ivanti CVE-2026-104935 chain exploited on a fully patched appliance
- 2026-10-13: Ivanti discloses CVE-2026-104935
- 2026-10-19: Unit 42 names Qilin and Inc exploiting CVE-2026-0257 (secondary)

## UNVERIFIED / open items

- KEV `dateAdded` and ransomware flags were read from the 2026-10-23 KEV JSON feed through a text-extraction tool, not a script. Re-check with `jq` against the feed before publishing.
- CVE-2018-13379 exact disclosure day. Fortinet says May 2019; NVD published 2019-06-04.
- First-exploitation dates for CVE-2018-13379, CVE-2021-22893, CVE-2023-27997, CVE-2024-21762, CVE-2024-40766, CVE-2025-5777, CVE-2025-7775 and CVE-2026-8452 are approximate.
- CVE-2023-20269 "since March 2023" rests on Rapid7 via secondary coverage. Cisco's blog does not give the date.
- The ICBC (Nov 2023) vector, CitrixBleed, is press-reported only.
- Travelex via CVE-2019-11510 is press-reported only.
- CVE-2026-8452 CVSS v3 is unconfirmed.
- CVE-2026-15409 CVSS 10.0 comes from secondary coverage (Tenable).
  - _訂正 2026-10-27: NVD (Analyzed) lists CVSS 3.1 10.0 from CISA-ADP. The 2026-numbered rows were re-checked against the NVD API the same day: published dates and scores match; score sources corrected to Fortinet (CVE-2025-68686), Ivanti (CVE-2026-104935) and CISA-ADP (CVE-2026-15409, CVE-2026-50751)._
- CVE-2026-24858 CVSS: 9.8 on NVD (Fortinet CNA) vs 9.4 in some coverage.
- CVE-2025-68686: KEV lists it as exploited, but Fortinet's page says "Known Exploited: No".
- CVE-2026-0257 ransomware actors (Qilin, Inc, Settra) come via secondary coverage of Unit 42. The brief itself was not read.
- NPA full-year 2025 split (VPN 66.3%) is secondary only. The H1 2025 62.2% figure is primary.
- No primary source was found for Fortinet's Japan market share. The Nikkei survey measures usage among respondents, not market share.
- Handa Hospital and OGMC attack days are not stated here.
- The COATHANGER advisory day (2024-02-06) is not confirmed against the NCSC-NL page.
- CVE-2026-88771 / 88772 / 88779 (NetScaler, KEV Sept-Oct 2026) and CVE-2026-0300 / 0322 (PAN-OS, KEV May and Oct 2026) were seen in KEV but not researched.

## Sources

Per-CVE source URLs are in `vulns.json`. Cross-cutting sources:

- [CISA KEV catalog (JSON feed)](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)
- [CISA ED 24-01](https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities)
- [CISA ED 25-03](https://www.cisa.gov/news-events/directives/ed-25-03-identify-and-mitigate-potential-compromise-cisco-devices)
- [CISA AA20-107A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-107a)
- [CISA AA23-325A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a)
- [CISA AA24-060B](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060b)
- [Fortinet: 87,000 credential leak](https://www.fortinet.com/blog/psirt-blogs/malicious-actor-discloses-fortigate-ssl-vpn-credentials)
- [Fortinet: symlink persistence](https://www.fortinet.com/blog/psirt-blogs/analysis-of-threat-actor-activity)
- [Mandiant: CitrixBleed session hijacking](https://cloud.google.com/blog/topics/threat-intelligence/session-hijacking-citrix-cve-2023-4966)
- [Mandiant: CVE-2025-0282](https://cloud.google.com/blog/topics/threat-intelligence/ivanti-connect-secure-vpn-zero-day)
- [Mandiant: CVE-2025-22457](https://cloud.google.com/blog/topics/threat-intelligence/china-nexus-exploiting-critical-ivanti-vulnerability)
- [Volexity: CVE-2024-3400](https://www.volexity.com/blog/2024/04/12/zero-day-exploitation-of-unauthenticated-remote-code-execution-vulnerability-in-globalprotect-cve-2024-3400/)
- [Volexity: CVE-2026-104935](https://www.volexity.com/blog/2026/10/13/a-series-of-unauthenticated-events-chained-exploitation-of-ivanti-connect-secure-zero-days/)
- [NPA leaflet (Jan 2026)](https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf)
- [JPCERT-AT-2025-0001](https://www.jpcert.or.jp/at/2025/at250001.html)
