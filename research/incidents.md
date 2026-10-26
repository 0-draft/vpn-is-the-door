# Incidents: VPN and remote-access edge devices as the ransomware entry point

Compiled 2026-10-25. Every entry vector below is taken from the victim's own announcement, an official investigation report, a government statement, or reputable press quoting the organisation. Where the vector is only reported second-hand it is marked **UNVERIFIED**. Page numbers refer to the page number printed in the cited PDF.

Status key: **confirmed** means the stated vector is in a primary source as described in the row. It does not always mean the device was a VPN: several Japanese 2025-2026 victims say only "network device" or "communications equipment" without naming the device type, and the row says so.

## Summary table

| # | Organisation | Country | Attacked | Disclosed | Entry vector (as stated) | CVE | Status | Headline impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | つるぎ町立半田病院 (Handa Hospital) | JP | 2021-10-31 | 2021-10-31; report 2022-06 | FortiGate 60E remote-maintenance VPN; unpatched CVE; credentials in public 87k dump; no source-IP limit | CVE-2018-13379 | confirmed (reasoned, no logs) | EMR down ~2 months; normal care 2022-01-04 |
| 2 | 大阪急性期・総合医療センター | JP | 2022-10-31 | 2022-10-31; report 2023-03-28 | Catering contractor's FortiGate VPN (CVE + leaked-list credentials), then always-on RDP into the hospital | CVE-2018-13379 | confirmed | Core systems 43 days, full 73 days; all ~2,200 terminals reinstalled |
| 3 | 名古屋港運協会 (NUTS) | JP | 2023-07-04 | 2023-07-05; report 2023-07-26 | "Remote connection device" vulnerability; MLIT: maintenance VPN device, no IP limit | not stated | confirmed (not definitive per MLIT) | All Nagoya container terminals stopped ~2.5 days |
| 4 | 関通 (Kantsu) | JP | 2024-09-12 | 2024-09-13 | Company: "external network connection point" (type not stated); a SoftBank blog article's narration says leaked VPN credentials | not stated | confirmed (device type undisclosed) | All servers encrypted; losses >¥1.7bn |
| 5 | 岡山県精神科医療センター | JP | 2024-05-13 / 05-19 | 2024-05-20; report 2025-02-13 | Cisco ASA 5506-X maintenance SSL-VPN; guessable shared password; unpatched since 2018; no IP limit | not stated | confirmed (3 hypotheses) | Up to 40,000 patients' data leaked; ~3 months to recover |
| 6 | アスクル (ASKUL) | JP | 2025-06-05 / 10-19 | 2025-10-19; report 2025-12-12 | Contractor admin account without MFA used from outside (VPN-vendor CVE checked: no trace) | none (CVE ruled out) | confirmed | ~740k records leaked; orders stopped ~6 weeks |
| 7 | アサヒグループHD | JP | ~2025-09-19 / 09-29 | 2025-09-29; results 2025-11-27 | "Network equipment at a Group site" (type not disclosed); fix: abolish remote-access VPN | not stated | confirmed (device type undisclosed) | Up to ~1.91M records possibly exposed; ~2 months to contain |
| 8 | 穴吹興産 / あなぶきグループ | JP | 2026-02-03 | 2026-02-04; 2026-04-03 | Vulnerability in "our communications equipment" (type undisclosed) | not stated | confirmed (device type undisclosed) | Data on leak site; ~210k files from group company |
| 9 | YCC情報システム | JP | 2026-04-02 | 2026-04-03; 2026-05-20 | Network-device admin credentials guessed/obtained (type undisclosed) | n/a | confirmed (device type undisclosed) | Up to ~1M records across ~20 client orgs (press) |
| 10 | 精電舎電子工業 | JP | 2026-04-08 / 04-22 | 2026-05-07; 2026-07-21 | "Intruded from the VPN" | not stated | confirmed | Most servers encrypted; AD data exfiltrated |
| 11 | 両毛システムズ | JP | 2026-08-12 | 2026-08-15; 2026-09-25 | Misused account on "network connection equipment (VPN)" | n/a | confirmed (3rd report, archived copy) | Sales, transaction and personal data possibly leaked |
| 12 | ワシントンホテル | JP | 2026-02-13 | 2026-02-14; final 2026-09-07 | "External connection equipment" (secondary only) | — | **UNVERIFIED** | Some servers encrypted; restored from backup |
| 13 | Colonial Pipeline | US | 2021-05-07 | 2021-05-08; testimony 2021-06-08 | Legacy VPN profile, single-factor auth | n/a | confirmed (password-in-leak detail UNVERIFIED) | Pipeline shut ~5 days; $4.4M ransom |
| 14 | Boeing Distribution Inc. | US | 2023-10 | 2023-11-01; CISA 2023-11-21 | Citrix Bleed on NetScaler (session hijack bypasses MFA) | CVE-2023-4966 | confirmed (via CISA advisory) | Parts/distribution business hit; ~45 GB leaked (press) |
| 15 | ICBC Financial Services | US | 2023-11-08 | 2023-11-09 | Citrix Bleed (researcher/Treasury, not confirmed) | CVE-2023-4966? | **UNVERIFIED** | US Treasury trades disrupted |
| 16 | US CISA (CSAT) — Ivanti / ED 24-01 | US | 2024-01-23..26 | 2024-03; 2024-06 | Webshell on CISA's own Ivanti Connect Secure | ED 24-01: CVE-2023-46805, CVE-2024-21887 | confirmed | 2 systems offline; FISMA major incident |
| 17 | MITRE (NERVE) | US | 2024-01 | 2024-04-19 | Ivanti Connect Secure VPN zero-days + session hijack past MFA | CVE-2023-46805, CVE-2024-21887 | confirmed | R&D network compromised (nation-state, not ransomware) |

Checked and **excluded** (organisation did not state a VPN/edge-device entry): KADOKAWA / ドワンゴ 2024 (company "presumes" employee account credentials stolen by phishing etc.; route unknown), メディカ出版 2026 (intrusion with legitimate account credentials; leak route of credentials unidentified; no VPN mention in its notice), トンボ飲料 2026 (remote-desktop software operable over the internet installed on a server; not a VPN appliance). See the end of this file.

## Japan

### 1. つるぎ町立半田病院 (Tsurugi Town Handa Hospital), 2021

- Attacked: early hours of 2021-10-31; printers began printing the ransom note. Disclosed same day at a press conference. Expert-panel report submitted 2022-06-07, published 2022-06-16.
- Entry vector (report): FortiGate 60E VPN appliance installed for remote maintenance of hospital and lab systems. CVE-2018-13379 was left unpatched; the September 2021 public dump of ~87,000 FortiGate credentials contained the hospital's global IP, ID and password; no source-IP restriction on VPN or management access. Because logs and evidence did not survive, the route is a reasoned conclusion (phishing, exposed RDP, insider and supply-chain updates were each considered and ruled less likely).
- After entry: LockBit 2.0. Remote Desktop activity on 2021-10-30 23:57, before discovery. AD policy allowed 5-character passwords with no lockout and an unchanged Administrator ID; built-in Administrator password shared across all PCs; users were local Administrators; antivirus and Defender disabled to keep the EMR stable. The forensics vendor noted Mimikatz and PsExec. 40 terminals affected (9 logon success, 15 encrypted, 16 both). Backup server data from 2018 onward found physically deleted; offline backups up to 2018 survived.
- Dwell time: entry date unknown; attacker activity confirmed at least ~1 hour before the 00:30 discovery.
- Impact: hospital functions "effectively stopped" (emergency and new patients refused, surgery postponed). Normal care resumed 2022-01-04. No ransom paid. The report gives no cost figure.
- Recommendations: vulnerability management for network devices, IP restriction for maintenance VPNs, offline/offsite backups, least privilege, AD hardening, and a contract clause making vendors accountable for informing the hospital about vulnerabilities.
- Quotes:
  - "侵入経路としては導入している仮想プライベートネットワーク（…「VPN」という。）装置の脆弱性を悪用して侵入したものと思われる。" (本編 p.6)
  - "侵入経路は VPN 装置であると考えるのが合理的である。" (技術編 p.14)
  - "その漏洩データに、半田病院のグローバル IP アドレス、ID、パスワードが含まれていた事を確認している。" (技術編 p.10)
  - "インターネット上のすべてのシステムからの接続が可能であった。" (技術編 p.11)

Sources: [有識者会議調査報告書 本編](https://www.handa-hospital.jp/topics/2022/0616/report_01.pdf), [同 技術編](https://www.handa-hospital.jp/topics/2022/0616/report_02.pdf)

### 2. 大阪急性期・総合医療センター (Osaka General Medical Center), 2022

- Attacked: EMR failure noticed 2022-10-31 07:45; ransomware confirmed ~08:30. Investigation committee report 2023-03-28.
- Entry vector (report): supply chain. The hospital's catering contractor (E社) had a FortiGate VPN device ("Firewall Z") installed by its system builder for remote maintenance. It had CVE-2018-13379, and its global IP, ID and password were in the publicly leaked list. From the caterer's network the attacker used an always-on RDP connection (opened at the vendor's request) to reach the hospital's catering server.
- After entry: dictionary attack on the caterer's terminals (shared, guessable Administrator password); the hospital catering server's Administrator password cracked with Mimikatz; antivirus uninstalled; the same ID/password on other hospital servers allowed spread to the EMR and core systems; ~240 IPs enumerated and RDP attempted to ~70. Ransomware "Elbie" (Phobos family) on servers. No significant data transfer observed; leak judged "extremely unlikely". The vendor upgraded the VPN firmware on the evening of 10-31 without a backup, which erased the VPN syslog.
- Dwell time: not determinable (VPN logs lost; data restored to the state of 10-27).
- Impact: core systems restarted after 43 days (2022-12-12), full clinical systems after 73 days (2023-01-11). Some of the hospital's ~2,200 terminals showed traces of access; because each could not be checked in time, all servers and terminals were clean-installed (report p.40 area; the summary's 2,200 is the total count). November 2022 new inpatients at 33.3% of the prior year. Estimated "several hundred million yen or more" for investigation/recovery plus "over ten-odd hundred million yen" (十数億円以上) in lost revenue. Two other hospitals using the same catering system avoided EMR encryption because they used separate passwords and network segments.
- Recommendations: document maintenance and vulnerability-management responsibilities per device, set criteria and monitoring for remote maintenance, unique Windows passwords, account lockout, standard (non-admin) user accounts, antivirus on EMR servers, an inventory of every device connected to the clinical network.
- Quotes:
  - "E 社の VPN 機器には、CVE-2018-13379 (CVSS v3:9.8、緊急）という脆弱性が存在し、管理者の ID、パスワードを保存したファイルを窃取できた。" (報告書 p.45)
  - "公開されたリストにある ID、パスワードを使用して侵入されたと考えるのが合理的である。" (報告書 p.45)
  - "VPN機器の管理やRDP接続の運用などが適切になされていれば被害を免れた可能性がある。" (概要 p.3)

Sources: [調査報告書](https://www.gh.opho.jp/pdf/report_v01.pdf), [調査報告書 概要](https://www.gh.opho.jp/pdf/reportgaiyo_v01.pdf)

### 3. 名古屋港統一ターミナルシステム (NUTS), 2023

- Attacked: NUTS stopped ~06:30 on 2023-07-04; ransom note printed at 07:30. Association press release 2023-07-05; written account 2023-07-26; MLIT committee interim summary 2023.
- Entry vector: the association's own report says a vulnerability was confirmed in a "remote connection device" and unauthorized access is believed to have come through it. MLIT's committee, unable to conclude definitively because logs were encrypted, judged it "appropriate" to regard the maintenance VPN device as the route. That VPN had no source-IP restriction (anyone with the ID/password could connect), and vulnerabilities in the VPN device and the physical servers published months earlier were unpatched. USB media and the NAT link to stevedores were also listed as candidates.
- After entry: all 8 physical servers and all 45 virtual servers in the data center encrypted. Malware was also detected in the backup (only 3 days kept; dev/test not backed up). The note named no amount; the attacker was not contacted. No sign of data leakage.
- Dwell time: not stated.
- Impact: all container terminals at Japan's largest port halted until 18:15 on 07-06 (~2.5 days). 37 vessels' schedules affected (up to ~24h delay); ~20,000 containers' gate-in/out affected (estimate).
- Recommendations (MLIT): restrict VPN source IPs, multi-factor authentication, 12+ character passwords, account lockout, alerting on unusual logins, keep network-device firmware updated, collect and back up VPN logs, replace network devices after compromise, longer backup retention.
- Quotes:
  - "本件についてリモート接続機器の脆弱性が確認されており、そこから不正なアクセスを受けたと考えられます。" (協会 経緯報告 p.2)
  - "VPN 機器からの侵入が行われたものと見ることが適切である。" (国交省 中間取りまとめ p.3)
  - "ID とパスワードさえ合致すればインターネット上で誰からでもアクセス可能な状態にあった" (国交省 中間取りまとめ p.4)

Sources: [名古屋港運協会 NUTS システム障害の経緯報告](https://meikoukyo.com/wp-content/uploads/2023/07/0bb9d9907568e832da8f400e529efc99.pdf), [国交省 コンテナターミナルにおける情報セキュリティ対策等検討委員会 中間取りまとめ①](https://www.mlit.go.jp/kowan/content/001633384.pdf)

### 4. 関通 (Kantsu), 2024

- Attacked: server failures from ~18:00 on 2024-09-12. Third report 2024-09-28.
- Entry vector: the company's notice says the intrusion came "from the connection point with external networks" and attackers entered multiple servers and encrypted them. An October 2025 article on SoftBank's business blog, based on an interview with Kantsu's IT department, says that preliminary forensics found "server intrusion due to leaked VPN credentials"; this sentence is the writer's narration, not a quoted remark by Kantsu staff. A Nikkei xTECH interview with the president is headlined "VPN device vulnerability" (paywalled; body not read). The company's own notices do not say VPN, so the site classifies the entry as a device of undisclosed type and mentions the SoftBank article only as an article.
- After entry: Akira ransomware; per the interview, all servers were encrypted. The company decided on 09-13 to discard everything and rebuild (450 PCs and 8 servers replaced).
- Impact: clients' shipments stopped or delayed; inventory system felt recovered about 1.5 months later. Per the interview, losses over ¥1.7 billion (≈¥300M asset write-offs, ≈¥400M recovery, ≈¥1B customer compensation).
- Quote: "本事象は、外部ネットワークとの接続口からの侵入であり、" (第3報)

Sources: [関通 第3報](https://www.kantsu.com/news/6615/), [SoftBank ビジネスブログ（関通 情シス インタビュー）](https://www.softbank.jp/business/content/blog/202510/kantsu-ransomware-it), [日経クロステック 社長インタビュー（見出しのみ確認）](https://xtech.nikkei.com/atcl/nxt/column/18/01156/102000074/)

### 5. 岡山県精神科医療センター (Okayama Psychiatric Medical Center), 2024

- Attacked: first intrusion 2024-05-13 02:41 (found later by forensics); EMR failed ~16:00 on 05-19; ransomware confirmed 05-20 06:15. Report by an investigation committee set up at Software ISAC, published 2025-02-13.
- Entry vector (report): the maintenance SSL-VPN appliance in the data center, a Cisco ASA 5506-X (ASA 9.9(2)40, end of support 2023-05-31). Its ID/password was the guessable "administrator/P@ssw0rd", reused as the Administrator credential on every Windows machine; it had not been patched since installation in 2018 and carried several vulnerabilities previously used in ransomware attacks; no source-IP restriction. The report lists three possible causes: a dictionary attack on the SSL-VPN, credentials bought from an initial access broker, or exploitation of an SSL-VPN vulnerability. Syslog was kept only in 4 MB of device memory and had been overwritten.
- After entry: over about six days the attacker scanned the network, searched for and deleted backups, stole AD user and computer information, dumped LSASS credentials on the AD server (05-18/19), stopped and deleted antivirus, and stole Office documents from shared folders. Encryption ran 05-19 13:10-17:34 via admin shares (C$). Encrypted: 23 virtual servers, shared storage, 3 hypervisor hosts (ESXi/vSphere), 6 other physical servers and 244 terminals; the shared storage data was totally lost. The contracted offline backup had not actually been taken.
- Dwell time: ~6 days (05-13 to 05-19).
- Impact: EMR down at the hospital and its clinic; paper charts used and care never stopped. Personal data of up to 40,000 people (names, addresses, dates of birth, diagnoses) leaked, confirmed by Okayama prefectural police. Full recovery ~3 months, restoring from a data-warehouse server that escaped encryption.
- Recommendations: follow the MHLW medical-information-system guideline (patching, no guessable passwords, IoT/device updates); restrict VPN source IPs; end blanket administrator rights; reliable offline backups.
- Quotes:
  - "保守用 VPN 装置への接続元 IP アドレス制限がなく、インターネット上から誰でも攻撃が可能であった。多くは、厚労省ガイドラインの遵守で容易に防げたものである。" (p.13)
  - "保守用 SSL-VPN 装置の ID/PW が、administrator/P@ssw0rd という推測可能なものが使用されていた。" (p.16)
  - "初期侵入が確認できたのは 2024 年 5 月 13 日 02:41" (p.12)

Sources: [ランサムウェア事案調査報告書（掲載ページ）](https://www.okayama-pmc.jp/home/consultation/er9dkox7/lromw3x9/), [報告書 PDF](https://www.okayama-pmc.jp/wp-content/uploads/2025/02/24bb9b94f7eb10eff58b605c01c384ad.pdf)

### 6. アスクル (ASKUL), 2025

- Attacked: initial intrusion 2025-06-05; ransomware 2025-10-19. Investigation results (13th report) 2025-12-12.
- Entry vector (company report): the ID and password of an administrator account issued to an outsourcing contractor, the one account where MFA had "exceptionally" not been applied, leaked by unknown means and were used to get in "from outside the company". The report does not literally say "VPN"; it states that a vulnerability the VPN appliance vendor disclosed in late September 2025 showed no exploitation traces. Press (IT Leaders) describes the entry as "via VPN". Logs from the time had been deleted, and the contractor's laptop logs were erased during an OS update.
- After entry: June to 10-09, login attempts aimed at admin rights (all failed); from 07-09, EDR and security software disabled, lateral movement into logistics and internal systems, ransomware staged; several ransomware strains used, some undetectable by EDR signatures of the time. On 10-19 the ransomware launched at a preset time, encrypting servers and deleting backup files (backups in the same data center were also encrypted). On 10-22 a cloud inquiry-management account was compromised and data stolen. Leak-site publications on 10-30, 11-10 and 12-02.
- Dwell time: ~4.5 months (06-05 to 10-19).
- Impact: ASKUL, Soloel Arena and LOHACO order/shipping stopped from 10-19; web orders resumed 12-03. ~740,000 records leaked (~590,000 business customers, ~132,000 consumers, ~15,000 business partners, ~2,700 executives and staff). No contact with the attacker; no ransom paid.
- Recommendations: MFA on all remote access (company and contractors), strict admin-privilege operation, EDR on all servers with 24/365 monitoring, ransomware-resilient backups.
- Quotes:
  - "例外的に多要素認証を適用していなかった業務委託先に対して付与していた管理者アカウントの ID とパスワードが何らかの方法で漏洩し不正利用された" (第13報 p.4)
  - "業務委託先用のアカウントを使用して社外より初期侵入" (第13報 p.3 図, 2025/6/5)
  - "VPN 機器ベンダが、2025 年 9 月末頃に脆弱性を公表しておりましたが、脆弱性を悪用した侵入の痕跡は確認されませんでした。" (第13報 p.4)

Sources: [アスクル 第13報 PDF](https://pdf.irpocket.com/C0032/PDLX/O3bg/N4O3.pdf), [IT Leaders](https://it.impress.co.jp/articles/-/28741)

### 7. アサヒグループホールディングス (Asahi Group Holdings), 2025

- Attacked: intrusion about 10 days before the outage (exact date not identified); ransomware ~07:00 on 2025-09-29. Investigation results 2025-11-27; prevention and governance measures 2026-02-18.
- Entry vector (company): an external attacker entered via "network equipment located at a Group site". Asahi has not disclosed the device type, the site, or whether a vulnerability or credentials were used. Its remediation includes "full abolition of remote-access VPN devices to prevent re-entry from network equipment". Treat "VPN" as Asahi's remediation, not as its stated entry device.
- After entry: reached the main data center, exploited a password weakness to seize administrator rights, used the stolen account to explore the network and repeatedly intrude into and scout servers mainly outside business hours; on 09-29 ransomware executed simultaneously, encrypting running servers and some PCs. Data on some PCs was stolen. The backup system was paused to protect backup data; recovery was from verified backups.
- Dwell time: ~10 days.
- Impact: order and shipping systems stopped and handled manually for months; ~2 months to contain. Up to ~1.914 million personal records "exposed or may have been exposed" (1.525M customer inquiries, 114k gift recipients, 107k current and former employees, 168k family members). As of 2026-02-18, confirmed leaks were 5,117 employee records and 110,396 business-partner contacts. Results announcement delayed. Asahi did not name an attacker (Qilin claimed it).
- Recommendations (implemented or planned): abolish remote-access VPN devices and other devices with external intrusion risk, migrate to zero-trust PCs, change all passwords and strengthen authentication and privilege management, redesign backup/BCP.
- Quotes:
  - "外部の攻撃者がアサヒグループ内の拠点にあるネットワーク機器を経由し、アサヒグループのネットワークに侵入したことが判明いたしました。" (2026-02-18)
  - "ネットワーク機器からの再侵入を防ぐためのリモートアクセスVPN装置の全面廃止" (2026-02-18)

Sources: [2025-11-27 調査結果](https://www.asahigroup-holdings.com/newsroom/detail/20251127-0104.html), [2025-11-27 English](https://www.asahigroup-holdings.com/newsroom/detail/20251127-0204.html), [2026-02-18 再発防止策](https://www.asahigroup-holdings.com/newsroom/detail/20260218-0101.html)

### 8. 穴吹興産 / あなぶきグループ (Anabuki Group), 2026

- Attacked: anomaly and encryption detected by monitoring 2026-02-03. Anabuki Kosan's 4th report 2026-04-03; Anabuki Housing Service's 5th report April 2026.
- Entry vector (Anabuki Kosan): external forensics found unauthorized access to the internal network "by an attack exploiting a vulnerability in our communications equipment". Device type and CVE not disclosed. Anabuki Housing Service attributes its breach to the attack on the group company's communications equipment.
- After entry: mainly outside business hours, login attempts to multiple servers via Remote Desktop etc., administrator rights seized, intrusion expanded across the network, ransomware deployed to multiple servers and files encrypted. Personal and internal data confirmed on a dark-web leak site.
- Impact: Kosan's real-estate customers, job candidates and staff data possibly leaked; core business continued. Anabuki Housing Service (press, citing its notices): ~210,000 files exfiltrated from a file server; 7,237 Matsuyama municipal-housing residents' records leaked; a confirmed total of 207,773 is reported by a secondary source. Plan: full infrastructure replacement, cloud-native migration, zero trust and ID management.
- Quote: "当社通信機器の脆弱性を悪用した攻撃により、社内ネットワークへの不正アクセスが行われたことが判明しております。" (穴吹興産 第4報 p.2)

Sources: [穴吹興産 第4報 PDF](https://www.anabuki.ne.jp/cms_upload/news/429/20260403_higaihassei4.pdf), [穴吹ハウジングサービス 第5報](https://www.anabuki-housing.co.jp/news/content.php?news_id=525) (rate-limited during this check), [INTERNET Watch](https://internet.watch.impress.co.jp/docs/news/2102873.html)

### 9. YCC情報システム (YCC Information System), 2026

- Attacked: file-server encryption from ~06:50 on 2026-04-02. Fifth report 2026-05-20.
- Entry vector (company, investigators' presumption): credentials for a network device's administrator account were "guessed or obtained through the attacker's authentication attempts etc." and used to enter the internal network. The device type is not disclosed and VPN is not mentioned.
- After entry: file server encrypted; mail and business PCs on a separate environment unaffected. Access to client-entrusted data cannot be ruled out; no clear trace of transmission outside.
- Impact: Yamagata City alone ~500,000 records possibly exposed; Nikkei counts ~20 organisations and over 1 million records in total (press).
- Recommendations: full review of the internet-connection environment, stronger network monitoring, data-storage controls, staff training.
- Quote: "ネットワーク機器の管理者アカウントに係る認証情報が、攻撃者による認証試行等により推測または取得され" (第五報)

Sources: [YCC 第五報](https://www.yamagata-ycc.co.jp/news/20260520-1/), [INTERNET Watch](https://internet.watch.impress.co.jp/docs/news/2102758.html), [日経クロステック](https://xtech.nikkei.com/atcl/nxt/column/18/00001/11806/)

### 10. 精電舎電子工業 (Seidensha Electronics), 2026

- Attacked: intrusion 2026-04-08; encryption 2026-04-22. Disclosed 2026-05-07; investigation follow-up 2026-07-21.
- Entry vector (company): "a third party intruded into the internal network from the VPN". Credentials vs. vulnerability not stated.
- After entry: logged into the Active Directory server, where employee credentials were presumably captured; most servers and several PCs encrypted. Data on the AD server judged transferred externally.
- Dwell time: ~14 days.
- Impact and response: entire existing internal network isolated from 04-22 and the VPN device cut off; EDR on uninfected PCs; 24h external SOC monitoring.
- Quote: "2026年4月8日 第三者がVPNから社内ネットワークに侵入しました。" (2026-07-21)

Sources: [精電舎電子工業 お知らせ](https://www.sedeco.co.jp/news/detail/?itemid=111&dispmid=567), [ScanNetSecurity](https://scan.netsecurity.ne.jp/article/2026/08/07/55886.html)

### 11. 両毛システムズ (Ryomo Systems), 2026

- Attacked: 2026-08-12; anomaly detected by internal monitoring 08-14. Disclosed 08-15; third report 2026-09-25.
- Entry vector (third report, read from the Wayback Machine snapshot of 2026-10-16 because the live page was under maintenance; ScanNetSecurity quotes the same words): an external third party "misused an account on network connection equipment (VPN)". How the account was obtained and MFA status are not disclosed.
- After entry: external experts confirmed a ransomware attack; traces of unauthorized access on some servers; sales, transaction and personal data possibly leaked.
- Impact: clients (municipalities, gas utilities) announced possible exposure of data held at Ryomo (e.g. Daito Gas ~124,000; Isesaki City 3,789; secondary). SafePay claimed it (press; the company has not named an attacker).
- Quote: "8月12日に外部の第三者がネットワーク接続機器（VPN）のアカウントを悪用し、社内ネットワークに侵入し" (第3報, via ScanNetSecurity)

Sources: [両毛システムズ 第3報](https://www.ryomo.co.jp/news/202609_02.html), [ScanNetSecurity](https://scan.netsecurity.ne.jp/article/2026/10/15/56461.html)

### 12. ワシントンホテル (Washington Hotel), 2026 — UNVERIFIED

- Attacked: unauthorized access detected 22:00 on 2026-02-13. Disclosed 2026-02-14; final report 2026-09-07.
- Entry vector: **UNVERIFIED.** Secondary summaries of the final report say "external connection equipment" (外部接続機器). The final report itself was not read; device type unknown.
- After entry and impact (secondary): some servers encrypted; no clear trace of data theft; restored from backup; employee and former-employee data possibly exposed; card terminals unusable at some hotels.

Sources: [ScanNetSecurity](https://scan.netsecurity.ne.jp/article/2026/09/25/56299.html), [セキュリティ対策Lab（二次）](https://rocket-boys.co.jp/security-measures-lab/washington-hotel-incident-final-report/)

## Global

### 13. Colonial Pipeline, 2021

- Attacked: discovered 2021-05-07. CEO Joseph Blount testified to the Senate Homeland Security committee on 2021-06-08.
- Entry vector (CEO testimony): "we believe the attacker exploited a legacy virtual private network (VPN) profile that was not intended to be in use." At the hearing he said "this particular legacy VPN … only had single-factor authentication" and that the password was "complicated". He also said the company was "still trying to determine how the attackers gained the needed credentials". **UNVERIFIED:** the statement that the password had appeared in a batch of leaked passwords comes from Mandiant via press, not from Colonial.
- After entry: DarkSide ransomware on IT systems; Colonial proactively shut the pipeline.
- Impact: the largest US East Coast fuel pipeline stopped for about five days (restart began 2021-05-12). Ransom of 75 BTC (~$4.4M) paid on 05-08; the DOJ later seized 63.7 BTC (~$2.3M).
- Remediation (testimony): legacy VPN profile shut down; additional protection layers; current remote access uses MFA (RSA tokens).

Sources: [Blount written testimony (HSGAC)](https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf), [BankInfoSecurity](https://www.bankinfosecurity.com/colonial-ceo-at-senate-hearing-details-ransomware-attack-a-16836), [Washington Post](https://www.washingtonpost.com/business/2021/06/08/colonial-pipeline-ceo-blount-congress/)

### 14. Boeing Distribution Inc., 2023 (CitrixBleed)

- Attacked: late October 2023 (LockBit posted a claim on 10-27). Boeing statement 2023-11-01; joint CISA/FBI/MS-ISAC/ASD's ACSC advisory AA23-325A 2023-11-21, built partly on information Boeing shared.
- Entry vector (advisory): "Boeing observed LockBit 3.0 affiliates exploiting CVE-2023-4966, to obtain initial access to Boeing Distribution Inc." Citrix Bleed in NetScaler ADC/Gateway lets attackers bypass passwords and MFA by hijacking legitimate sessions.
- After entry (advisory TTPs): credential harvesting, lateral movement, AnyDesk and Splashtop RMM, batch and PowerShell scripts.
- Impact: Boeing reported a "cyber incident impacting elements of our parts and distribution business" that "does not affect flight safety". LockBit later published ~45 GB of data it claimed came from Boeing (press).
- Recommendations (advisory): isolate NetScaler appliances until patched, upgrade, hunt for compromise, rotate credentials.

Sources: [CISA AA23-325A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a), [TechCrunch](https://techcrunch.com/2023/11/02/boeing-cyber-incident-ransomware-gang-claims-data-theft/), [Cybersecurity Dive](https://www.cybersecuritydive.com/news/boeing-files-leaked-claim/699579/)

### 15. ICBC Financial Services, 2023 — UNVERIFIED

- Attacked: 2023-11-08 (US ET). ICBC FS said it "experienced a ransomware attack" and isolated the impacted systems.
- Entry vector: **UNVERIFIED.** ICBC has not stated a vector. The Citrix Bleed link rests on a researcher's Shodan evidence of an unpatched NetScaler and on a Treasury message to industry (reported by WSJ) citing LockBit 3.0 and "two tactics that target users of services managed by Citrix", which Treasury said it had not fully established as the access vector.
- Impact (press): disrupted US Treasury market settlement; the parent injected capital to settle ~$9 billion in trades.

Sources: [Computer Weekly (Treasury link)](https://www.computerweekly.com/news/366559532/US-government-reinforces-ICBC-hack-link-to-Citrix-Bleed), [Computer Weekly (incident)](https://www.computerweekly.com/news/366559013/Ransomware-attack-on-major-Chinese-lender-disrupts-financial-markets)

### 16-17. Ivanti Connect Secure mass exploitation and CISA ED 24-01, 2024

Campaign: CISA Emergency Directive 24-01 (2024-01-19) responded to "widespread and active exploitation" of Ivanti Connect Secure and Policy Secure (CVE-2023-46805 auth bypass, CVE-2024-21887 command injection; CVE-2024-22024 added later). Supplemental direction ordered federal civilian agencies to disconnect every instance by 2024-02-02 and to factory-reset devices before reuse.

- **US CISA (CSAT).** CISA's own Ivanti appliance in front of its Chemical Security Assessment Tool was intruded 2024-01-23 to 01-26: "a malicious actor installed an advanced webshell on the Ivanti device." Possible unauthorized access to Top-Screen surveys, Security Vulnerability Assessments, Site Security Plans, Personnel Surety Program submissions and CSAT accounts; no evidence of exfiltration. Two systems were taken offline, and the incident met the FISMA "major incident" threshold. CISA did not name the specific CVE used against it. Not ransomware.
- **MITRE (NERVE).** From January 2024 a threat actor "exploited one of our Virtual Private Networks (VPNs) through two Ivanti Connect Secure zero-day vulnerabilities, and skirted past our multi-factor authentication using session hijacking", then moved laterally into VMware infrastructure with a compromised admin account, planted backdoors and web shells, and exfiltrated data. Disclosed 2024-04-19; MITRE later attributed it to a Chinese nation-state actor. Not ransomware.

Sources: [CISA ED 24-01](https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities), [CISA CSAT Ivanti notification](https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience/chemical-security/assessment-tool-csat-ivanti-notification), [Cybersecurity Dive (CISA statement)](https://www.cybersecuritydive.com/news/cisa-attacked-ivanti-cve-exploits/709893/), [MITRE](https://www.mitre.org/news-insights/impact-story/mitre-concludes-its-internal-cyber-attack-investigation), [Help Net Security](https://www.helpnetsecurity.com/2024/04/22/mitre-breached/)

## Checked and excluded

- **KADOKAWA / ドワンゴ (2024).** As of the August 2024 announcement the route and method were "unknown"; the company "presumes" the root cause was employee account credentials stolen by phishing or similar. Not a VPN/edge-device statement. Do not list as a VPN case. Sources: [EnterpriseZine](https://enterprisezine.jp/news/detail/20172), [piyolog](https://piyolog.hatenadiary.jp/entry/2024/08/19/074417)
- **メディカ出版 (2026).** Its notices describe intrusion with legitimate account credentials whose leak route could not be identified; no VPN or device is named. Sources: [@Press](https://www.atpress.ne.jp/news/581294), [日経クロステック](https://xtech.nikkei.com/atcl/nxt/column/18/00598/010900365/)
- **トンボ飲料 (2026).** The final report names "remote desktop software operable via the internet" (installed on a server; how it got there is still under investigation). This is remote access, but not a VPN appliance. Sources: [トンボ飲料 最終報](https://www.tombow-b.jp/4029/), [日経クロステック](https://xtech.nikkei.com/atcl/nxt/column/18/00598/010900356/)
