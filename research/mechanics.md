# Mechanics: why the VPN door is so dangerous, and what happens after it opens

Research notes for the "mechanics" section of the explainer. Compiled 2026-10-25. Conceptual only: no exploit code, no attacker-usable commands, no step-by-step instructions. Quotes are verbatim from the cited source; Japanese quotes are copied from the PDF text layer (line breaks joined, footnote markers dropped). Page cites for the Japanese reports give both the PDF page and the printed page number.

Evidence labels used below:

- **read**: I read the primary source directly.
- **search**: the wording came from a search-engine excerpt or a secondary write-up of the primary source, because the primary could not be fetched (403 or timeout). Treat these as lower confidence and re-check before publishing a verbatim quote.

## 0. Key points in brief

- A VPN appliance is the one box every outsider can reach before logging in, and once it falls it hands out "inside" network access plus the credentials stored on it. CISA/NSA put it plainly: "Because remote access VPN servers are entry points into protected networks, they are targets for adversaries." ([NSA/CISA VPN CSI][nsa-vpn], search)
- Both Japanese hospital reports follow the same pattern. A Fortinet SSL-VPN was left unpatched for CVE-2018-13379. Its admin credentials were already circulating in a public leak. Shared local-admin passwords and no lockout let the intruder move sideways. Encryption reached the backup server too. The firmware was upgraded after the incident without preserving logs, which destroyed the evidence ([半田病院 本編][handa-main], [大阪急性期 調査報告書][osaka], read).
- Speed: in 2025 data, Sophos measured a median of 3.40 hours from first attacker activity to the first attempt on Active Directory ([Sophos AAR 2026][sophos26], read). Arctic Wolf saw Akira go from a SonicWall SSL-VPN login to encryption "in under four hours", sometimes with a staging interval of 55 minutes ([Arctic Wolf][arcticwolf], read).
- Patching closes the hole but does not evict an intruder who is already in. Stolen credentials stay valid. Fortinet's symlink, Ivanti SPAWN and PHASEJAM all survived upgrades, and Ivanti's own integrity checker was fooled. The real fix is patch, reset every credential, hunt, and factory-reset or rebuild if compromise is suspected ([CISA AA24-060B][ivanti-cisa], [Mandiant][mandiant-ivanti], [Fortinet PSIRT][fortinet-psirt], read).

## 1. Why VPN appliances are structurally exposed

| # | Factor | What it means (plain) | Evidence (verbatim, source) |
| --- | --- | --- | --- |
| 1 | Always on the internet | Anyone, anywhere, can knock on it 24/7; you cannot hide it and still use it | CCCS: targeting edge devices "has now become a tactic of choice for many cyber threat actors, including state-sponsored actors." ([CCCS news][cccs-news], read). Handa: no source-IP restriction, so "インターネット上のすべてのシステムからの接続が可能であった。" ([半田 技術編][handa-tech] PDF p.13 / printed p.11, read) |
| 2 | Reachable before authentication | The login page itself is attack surface; a bug there needs no password | CVE-2025-0282: "allows a remote unauthenticated attacker to achieve remote code execution." ([CVE record][cve-0282], read). CVE-2018-13379 lets an attacker download system files and obtain admin ID/password: "システム管理者の ID、パスワードを入手でき、インターネットから閉域網内に侵入が可能となる脆弱性。" ([半田 技術編][handa-tech] PDF p.11 / printed p.9, read) |
| 3 | Sits on the trust boundary and grants "inside" access | Passing the VPN puts you on the internal network as a trusted user | NCSC: "These systems often sit at trust boundaries and are increasingly targeted by sophisticated threat actors." ([NCSC blog 2026-07-29][ncsc-blog], read). GTIG: these devices are "designed to connect widespread systems and devices with high permissions required to manage the products" ([GTIG 2024 zero-day review][gtig], read) |
| 4 | One bug is enough (old memory-unsafe code) | No exploit chain needed; a single flaw can give full control | GTIG: "exploit chains are not generally required to exploit these systems, giving extensive power to individual vulnerabilities that can single-handedly achieve remote code execution or privilege escalation." ([GTIG][gtig], read). CISA/FBI list CVE-2025-0282 (Ivanti Connect Secure) and CVE-2023-6549 (Citrix NetScaler) as buffer-overflow examples and say "Threat actors frequently exploit these vulnerabilities to gain initial access to an organization's network and then move laterally to the wider network." ([CISA/FBI Secure by Design Alert][bo-alert], read) |
| 5 | Exploits land with root-level control | Whoever gets in can control the whole box and plant persistence | CISA on Ivanti: "a cyber threat actor may be able to gain root-level persistence despite issuing factory resets." ([CISA AA24-060B][ivanti-cisa], read). Note: "runs as root" as a general claim about all VPN appliances is my inference; the sources document root-level outcomes, not the internal privilege design of every product |
| 6 | Credentials and secrets live on the box | Breaking the box can reveal VPN user passwords, LDAP/AD bind accounts and session data | NSA/CISA list "Arbitrary reads of sensitive data (e.g., configurations, credentials, keys) from the device" ([NSA/CISA VPN CSI][nsa-vpn], search). CISA: "assume that user and service account credentials stored within the affected Ivanti VPN appliances are likely compromised." and "researchers were able to exfiltrate domain administrator cleartext credentials." ([CISA AA24-060B][ivanti-cisa], read). Mandiant: "The database cache may contain information associated with VPN sessions, session cookies, API keys, certificates, and credential material." ([Mandiant][mandiant-ivanti], read) |
| 7 | Closed firmware, no EDR | You cannot install your usual security agent on it, so nobody is watching | GTIG: "Endpoint detection and response (EDR) tools are not usually equipped to work on these products, limiting available capabilities to monitor them." ([GTIG][gtig], read). Volexity: these systems "cannot run traditional security software." ([Volexity][volexity], read). Microsoft: of attacks that reached the ransom stage, "over 90% used unmanaged devices as their initial access point or for remote encryption" ([Microsoft MDDR 2024 insights][msft], read) |
| 8 | Weak logging | When something happens there is often no record of it | Volexity: "Its logs had been wiped and logging had been disabled." ([Volexity][volexity], read). Sophos: logs were missing in 47% of 2024 cases (66% of IR cases) ([Sophos AAR 2025][sophos25], read). Osaka: "ログは syslog も含めて残っていない。" ([大阪急性期][osaka] p.37, read) |
| 9 | Integrity is hard to verify | Even the vendor's own "is this box clean?" tool can be fooled | CISA: "CISA identified that Ivanti's internal and previous external ICT failed to detect compromise." ([CISA AA24-060B][ivanti-cisa], read). Mandiant: "SPAWNANT is careful to circumvent the ICT by recalculating the SHA256 hash for any maliciously modified files." ([Mandiant][mandiant-ivanti], read). NCSC: "defenders must rely on improvised techniques, reverse engineering, or even zero-day vulnerabilities" and "In effect, they can have fewer tools available to them than the attacker." ([NCSC blog][ncsc-blog], read) |
| 10 | Patch/reboot friction | Patching means downtime for everyone working remotely, so it slips | Verizon DBIR 2025 (via SecurityWeek/Tenable): only "about 54%" of 17 sampled edge-device KEV vulnerabilities were fully remediated during the year, with a median time-to-remediate of 32 days, while the median time from CVE publication to mass exploitation was zero days ([SecurityWeek][dbir-sw], [Tenable][tenable], search). NPA (Japan): 52% of organizations using VPN appliances had not applied the latest patch ([警察庁 リーフレット 令和8年1月][npa-leaflet], read) |
| 11 | End-of-life devices | Old boxes stop getting fixes but keep running | CISA/FBI/NCSC: "Nation-state threat actors can exploit these devices as entry points to access modern, supported environments" ([EOS edge fact sheet, 2026-02-05][eos-fs], read). Osaka: the intrusion appliance was found to be running FortiOS-era firmware "5.4.2" before the emergency upgrade ([大阪急性期][osaka] p.37, read) |
| 12 | Shared admin and local accounts; stale passwords | One leaked password opens many doors; old passwords outlive upgrades | SonicWall: "local user passwords were carried over during the migration and not reset." ([SonicWall notice 2025-08-04][sonicwall], read). Osaka: "サーバー B と他サーバーの ID・パスワードが共通だったため、認証情報の窃取は容易であった。" ([大阪急性期][osaka] p.12, read). CCCS: default passwords "can be easily discovered and exploited by threat actors" ([CCCS ITSM.80.101][cccs-edge], read) |
| 13 | Executive misconception: "we have a VPN / closed network, so we're safe" | The VPN is treated as the security, so nothing behind it is hardened | Handa: "未だに続く閉域網の安全神話、閉域網によるセキュリティ対策の思考停止と言えるであろう。" ([半田 本編][handa-main] PDF p.25 / printed p.22, read). Osaka: "「医療機関内部のシステムは外部とはつながっていない閉域網だから安心」という認識に基づいて、セキュリティを考えない傾向にあり" ([大阪急性期][osaka] p.18, read). CCCS: organizations are "encouraged to move from overreliance on boundary protections like edge devices" ([CCCS][cccs-edge], read) |
| 14 | Unclear ownership (vendor/customer split) | Nobody thinks patching the box is their job | Handa: vulnerability info "実際には、脆弱性情報は販売店から半田病院にはもたらされていなかった。" ([半田 技術編][handa-tech] PDF p.17 / printed p.15, read). Osaka core cause: the responsibility boundary between hospital and vendors "契約を含む事前の取り決めがなく不明瞭であった" ([大阪急性期][osaka] p.14, read) |

Scale indicators. These are secondary to the mechanics; the "top entry point" ranking section owns them.

- Coalition (2024 claims data): "most ransomware claims in 2024 started with threat actors compromising perimeter security appliances" (58%) ([Coalition][coalition], read).
- Sophos (2024): External Remote Services (T1133) was the initial access technique in 71% of cases ([Sophos AAR 2025][sophos25], read).
- NPA Japan: VPN appliances were 62.2% of known ransomware intrusion routes (excerpt from the 令和7年上半期 report), and 39.8% of organizations authenticate remote access with ID/password only ([警察庁 リーフレット][npa-leaflet], read).

## 2. The post-compromise chain

### 2.1 Backbone narrative: 大阪急性期・総合医療センター (2022-10-31), with 半田病院 (2021-10-31) as a cross-check

The Osaka report is the backbone because it documents a supply-chain path through a vendor's VPN. That is the typical "someone else's door" story. All pages refer to [大阪急性期 調査報告書 (2023-03-28)][osaka]; PDF and printed page numbers are the same.

1. **The door.** The catering vendor (E社) had a remote-maintenance SSL-VPN appliance ("ファイアウォール Z"). It carried CVE-2018-13379, and its global IP, ID and password appeared on a publicly posted list. The committee concludes: "公開されたリストにある ID、パスワードを使用して侵入されたと考えるのが合理的である。" (p.45). Its firmware had never been updated (p.18). The report anonymizes the product. CVE-2018-13379 is a FortiOS SSL-VPN flaw ([JPCERT/CC 2020-11-27][jpcert-2020]), so it was a FortiGate by inference.
2. **Foothold in the vendor network.** The attacker used a dictionary tool over RDP against vendor PCs. Their Built-In Administrator password was shared and weak, and it "攻撃ツールのパスワードリストに存在していた" (p.45).
3. **Credential theft, then the trusted link.** The vendor server A logged in to hospital server B with B's Built-In Administrator credentials. That password "パスワード解析ツール（Mimikatz）で解析された" (p.45). The hospital firewall allowed always-on RDP from the vendor (p.46). The report later found this RDP access "実際には不要で利用されていなかった" (p.39).
4. **Into the hospital, AV removed.** The attacker entered server B over RDP and "ウイルス対策ソフトをアンインストールした" (p.12).
5. **Discovery.** The attacker harvested reachable info for "240 程度の IP アドレス" and attempted RDP to "約 70 程度の IP アドレス" from server B (p.47).
6. **Lateral movement on shared passwords.** "病院のサーバーの Built-In Administrator のパスワードが共通であったため、横展開（水平展開）が容易となり" (p.46). PsExec was found on a client (p.47). The EMR servers had no AV, so the attacker "わざわざウイルス対策をアンインストールしなくても簡単に攻撃ツールを設置し、暗号化ツールを実行できた" (p.19).
7. **Encryption, including backup gear.** Most servers, including the EMR servers, were encrypted with "Elbie" ransomware (p.11). The on-site LTO backup device was also encrypted (p.40). Recovery used offline, off-site LTO tapes. Data could only be restored consistently up to 2022-10-27 (p.38). The critical-care systems' backups were "オンラインのみであったため活用できなかった" (p.38).
8. **Evidence destroyed by the fix.** The vendor upgraded the VPN firmware on the evening of 10-31 "バックアップを取らずに" and the VPN syslog was lost, so the committee could not determine whether the attack was a single event (p.46). Firewall logs showed RDP traffic back to April 2022 and failed logons before 10-31 (p.39).
9. **Impact.** Core systems came back on day 43 (2022-12-12) and all clinical systems on day 73 (2023-01-11) (p.11). No significant exfiltration was observed: "情報漏洩の可能性は極めて低い" (p.12). So this case was encryption-only, not double extortion.

Cross-check, Handa (LockBit 2.0, 2021-10-31) ([半田 本編][handa-main], [半田 技術編][handa-tech]):

- **Entry.** FortiGate 60E, CVE-2018-13379 unpatched since installation. Leaked admin credentials were confirmed in the 87,000-device dump. Handa's IP, ID and password were in it: "その漏洩データに、半田病院のグローバル IP アドレス、ID、パスワードが含まれていた事を確認している。" (技術編 PDF p.12 / printed p.10).
- **Logon and lateral movement.** The likely logon path was brute force against a 5-character minimum password with no lockout and an unrenamed Administrator account (技術編 PDF p.16 / printed p.14). The shared Built-In Administrator account allowed credential dumping with Mimikatz, followed by PsExec and RDP (技術編 PDF p.16-17 / printed p.14-15). 40 devices were affected (本編 PDF p.25 / printed p.22).
- **Timing.** RDP activity was recorded at "10 月 30 日 23 時 57 分" (本編 PDF p.24 / printed p.21). Printers began printing the ransom note before dawn on 10-31 (本編 PDF p.9 / printed p.6). The ransom note was opened at 3:04 on 10-31 (本編 PDF p.24 / printed p.21).
- **Backups.** The backup server was among the encrypted systems (本編 PDF p.23 / printed p.20). Backups kept offline up to 2018 were unaffected and helped recovery (本編 PDF p.25 / printed p.22).
- **Evidence.** The VPN logs could not be analyzed because vendor A updated the firmware "ログ保存などを鑑みずに" (本編 PDF p.19 / printed p.16). The technical report says: "ログや証跡がないことから、侵入経路や水平展開の手法は不明である。" (技術編 PDF p.16 / printed p.14).
- **Recovery.** Normal care resumed on 2022-01-04 (本編 PDF p.9 / printed p.6).

### 2.2 Stage table

The ATT&CK IDs are the technique pages on [MITRE ATT&CK][attack]. In the "Evidence" column, the advisories are the CISA #StopRansomware entries for [Akira AA24-109A][akira], [LockBit AA23-165A][lockbit] and [Royal/BlackSuit AA23-061A][blacksuit].

| # | Stage | ATT&CK | For a non-engineer | For an engineer | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Initial access via the VPN | T1190 Exploit Public-Facing Application; T1133 External Remote Services; T1078 Valid Accounts; T1110 Brute Force; T1199 Trusted Relationship (vendor path) | The attacker either breaks the lock (bug) or uses a copied key (leaked password) | Pre-auth bug on the portal, or a login with harvested, sprayed or brokered creds. No MFA, or MFA weakened. Vendor tunnels count as your perimeter | Akira: access "through a virtual private network (VPN) service without multifactor authentication (MFA) configured" and "gain access to VPN products such as SonicWall, by stealing login credentials or exploiting vulnerabilities" ([AA24-109A][akira]). LockBit lists CVE-2018-13379 among exploited CVEs ([AA23-165A][lockbit]). BlackSuit: brokers "harvesting virtual private network (VPN) credentials from stealer logs" ([AA23-061A][blacksuit]). Qilin: PRODAFT assesses initial access via FortiGate CVE-2024-21762 and CVE-2024-55591 ([BleepingComputer][qilin-bc], search) |
| 2 | Credential harvesting from the appliance | T1552.001 Credentials In Files; T1556 Modify Authentication Process; T1539 Steal Web Session Cookie; T1505.003 Web Shell | The box holds the keys to the building; the thief copies them | Config files with local user creds; LDAP/AD bind service account; cached sessions, cookies, certs. The login flow is patched to log every successful password | Mandiant DRYHOOK modifies an auth component "in order to harvest successful authentications" ([Mandiant][mandiant-ivanti]). Volexity: login JavaScript modified "to POST user credentials to an attacker-controlled domain" ([Volexity][volexity]). CISA: stored user and service creds "likely compromised" ([AA24-060B][ivanti-cisa]) |
| 3 | Discovery (AD and network) | T1087.002 Domain Account; T1482 Domain Trust Discovery; T1018 Remote System Discovery; T1046 Network Service Discovery | They map the building: who is boss, where the safes are | Scan subnets, enumerate DCs, trusts and privileged groups using built-in tooling | Akira uses AdFind, and nltest for DC and trust discovery ([AA24-109A][akira]). Arctic Wolf: "typically initiating internal scanning within five minutes of logging in" ([Arctic Wolf][arcticwolf]). Osaka: about 240 IPs harvested ([大阪急性期][osaka] p.47) |
| 4 | Privilege escalation to domain admin | T1003.001 LSASS Memory; T1003.003 NTDS; T1078.002 Domain Accounts; T1136.002 Create Domain Account | They get the master key that opens every door | Dump LSASS and SAM, reuse shared local admin, steal NTDS.dit, create new privileged accounts | Akira: "ultimately compromising a highly privileged domain administrator's account" ([AA24-109A][akira]). Volexity: the attacker "extracted the Active Directory database ntds.dit file" ([Volexity][volexity]). Sophos: median 3.40 h to first AD attempt (2025) ([Sophos 2026][sophos26]) |
| 5 | Lateral movement | T1021.001 RDP; T1021.002 SMB/Admin Shares; T1569.002 Service Execution (PsExec-style); T1570 Lateral Tool Transfer | They walk from room to room using the master key | RDP and SMB with stolen or shared creds; remote service execution; legitimate RMM tools | BlackSuit: "used RDP and PsExec as well but also use SMB to move laterally" ([AA23-061A][blacksuit]). Volexity: "Lateral movement using compromised credentials to connect to internal systems via RDP, SMB, and SSH" ([Volexity][volexity]). Handa and Osaka both report PsExec and shared Built-In Administrator ([半田 技術編][handa-tech] PDF p.16-17, [大阪急性期][osaka] p.46-47) |
| 6 | Defense evasion | T1562.001 Disable or Modify Tools; T1070.001 Clear Windows Event Logs; T1484.001 Group Policy Modification | They switch off the alarms and wipe the cameras | Uninstall or kill AV/EDR (incl. BYOVD), clear logs, push changes via GPO. On the appliance: tamper with logging and integrity tools | Akira: "uninstalling endpoint detection and response (EDR) systems" and BYOVD ([AA24-109A][akira]). LockBit: "LockBit executable clears the Windows Event Logs files." ([AA23-165A][lockbit]). Mandiant: removal of "internal ICT failures" log entries ([Mandiant][mandiant-ivanti]) |
| 7 | Backup and recovery destruction | T1490 Inhibit System Recovery (plus T1486 against backup servers) | They burn the spare copies so you have to pay | Delete VSS shadow copies; steal backup-server creds; encrypt online backup targets | LockBit: "LockBit 3.0 deletes volume shadow copies residing on disk." ([AA23-165A][lockbit]). Arctic Wolf: "the sqlcmd utility was used to access Veeam Backup & Replication credentials" ([Arctic Wolf][arcticwolf]). Handa backup server encrypted; Osaka on-site LTO device encrypted ([半田 本編][handa-main] PDF p.23, [大阪急性期][osaka] p.40) |
| 8 | Data exfiltration (double extortion) | T1560.001 Archive via Utility; T1048 Exfiltration Over Alternative Protocol; T1567.002 Exfiltration to Cloud Storage; T1657 Financial Theft | They take copies of your files to threaten a leak | Stage and compress, then push out to cloud storage or SFTP. A leak-site threat follows if the ransom is unpaid | Akira: "exfiltrated data in just over two hours from initial access" and runs "a double-extortion model" ([AA24-109A][akira]). Sophos: median 72.98 h from initial access to exfiltration (2024) ([Sophos 2025][sophos25]) |
| 9 | Encryption (impact) | T1486 Data Encrypted for Impact | Everything locks; the ransom note prints | Mass encryption, often out of hours, including hypervisors (ESXi, Nutanix AHV) | Akira targeted ESXi and, in June 2025, Nutanix AHV ([AA24-109A][akira]). Sophos: 88.10% of ransomware deployments out of business hours ([Sophos 2026][sophos26]). Handa tech report cites a Splunk test where LockBit's median encryption time for about 98,561 files was 5 min 50 s ([半田 技術編][handa-tech] PDF p.6 / printed p.4) |

### 2.3 Typical time between stages

| Interval | Value | Source |
| --- | --- | --- |
| VPN login to internal scanning | "within five minutes" (Akira, SonicWall) | [Arctic Wolf][arcticwolf], read |
| Initial access to AD attempt | median 3.40 h (2025 data); 11 h (2024 data) | [Sophos 2026][sophos26], [Sophos 2025][sophos25], read |
| Initial access to exfiltration | "just over two hours" (Akira case); median 72.98 h (2024), about 78.83 h (2025) | [AA24-109A][akira], [Sophos 2025][sophos25], [Sophos 2026][sophos26], read |
| Initial access to encryption | "under four hours" in almost all Akira/SonicWall intrusions; as short as 55 min | [Arctic Wolf][arcticwolf], read |
| Ransomware dwell time (median) | 4 days IR / 3 days MDR (2024) | [Sophos 2025][sophos25], read |
| Exfiltration to detection | 2.7 h (2024) | [Sophos 2025][sophos25], read |
| Initial-access hand-off to a second group | 22 seconds median (M-Trends 2026) | [M-Trends 2026][mtrends26], search, unverified against the PDF |
| Handa: first RDP evidence to ransom note | about 3 h (23:57 to 03:04) | [半田 本編][handa-main] PDF p.24, read |
| Osaka: first RDP from vendor link to encryption | logs went back to April 2022, so possibly months | [大阪急性期][osaka] p.39, read |

What this means for the reader: the window between "door opened" and "everything encrypted" ranges from under an hour to a few days in the measured data. Monthly patch cycles and weekday-only monitoring do not fit inside it.

## 3. Why patching alone is not enough

1. **Credentials were stolen before the patch.** JPCERT/CC (2020-11-27) recommends a password change even after updating: "既に対応済みでも、アカウントのパスワード変更を実施することが推奨されます" ([JPCERT/CC][jpcert-2020], read). Arctic Wolf (2025) says "patching alone is not enough. In such situations, credentials must be reset wherever possible" ([Arctic Wolf][arcticwolf], read). SonicWall traced the 2025 Akira wave to CVE-2024-40766 and to passwords "carried over during the migration and not reset" ([SonicWall][sonicwall], read). Handa's leaked credentials were in a public dump, and nobody changed them ([半田 技術編][handa-tech] PDF p.12, read).
2. **Persistence survives upgrades.**
   - Fortinet (2025-04-10): a symbolic link planted earlier let the attacker "maintain read-only access to files on the device's file system", including configs, after the original holes were fixed ([Fortinet PSIRT][fortinet-psirt], read). CISA (2025-04-11) adds a credential reset to the upgrade and config review ([CISA alert][cisa-forti], read).
   - Ivanti (Mandiant, 2025-01-09): PHASEJAM blocks the real upgrade while "giving the appearance of a successful upgrade", and "SPAWNANT and its supporting components can persist across system upgrades." ([Mandiant][mandiant-ivanti], read).
   - CISA (2024-02-29) warns of possible "root-level persistence despite issuing factory resets." ([AA24-060B][ivanti-cisa], read).
   - One unconfirmed lead: a CVE-2025-68686 bypass of the Fortinet symlink fix, reportedly KEV-listed in July 2026, appears in a single non-vendor blog only. I did not verify it, so leave it out unless confirmed via Fortinet PSIRT or the KEV catalog.
3. **The integrity checker can lie.** Ivanti's ICT "failed to detect compromise" ([AA24-060B][ivanti-cisa], read), and the actor recalculated manifest hashes to pass it. Mandiant also says "The ICT does not scan for malware or other Indicators of Compromise." ([Mandiant][mandiant-ivanti], read).
4. **Compromise before the patch exists.** CVE-2025-0282 was exploited as a zero-day ([Mandiant][mandiant-ivanti], read). Verizon found that the median time from CVE publication to mass exploitation for edge devices was zero days ([SecurityWeek][dbir-sw], search). CISA BOD 26-04 (2026-06-10) now pairs its tightest three-day tier with a requirement to "carry out a forensic triage of the asset to assess whether the system is compromised." ([BOD 26-04][bod2604], read).
5. **Patching can destroy the evidence.** In both hospitals, upgrading the firmware wiped the VPN logs needed to scope the breach ([大阪急性期][osaka] p.46, [半田 本編][handa-main] PDF p.19 / printed p.16, read). Rule: take a forensic copy, or at least export the config and logs, before upgrading a suspected-compromised box.

**What "patch + reset all credentials + hunt + factory reset" means in practice** (synthesized from [CISA AA24-060B][ivanti-cisa], [JPCERT/CC][jpcert-2020], [Fortinet PSIRT][fortinet-psirt], [Mandiant][mandiant-ivanti]):

| Step | What it means | Why |
| --- | --- | --- |
| Preserve | Export logs and config, snapshot if possible, before touching the box | Osaka and Handa lost the evidence |
| Patch or replace | Move to a fixed version from the vendor's clean image; if EOL, replace | Closes the hole and may remove known implants |
| Factory reset or rebuild when compromise is suspected | Wipe and reinstall rather than trust an in-place upgrade; restore config only after review | Implants that survive upgrades; Fortinet says "Treat all configuration as potentially compromised" |
| Reset every credential the box touched | Local VPN users, admin accounts, the LDAP/AD bind service account, RADIUS secrets, certificates and keys, API tokens; revoke active sessions | CISA: "Reset all credentials that may have been exposed during the compromise, including user and service accounts." |
| Hunt behind the box | Check everything reachable through the VPN: new accounts, backdoors, lateral movement, DC access | JPCERT/CC: "ドメインコントローラの探索試行や侵害がないか確認する"; CISA: if compromise is suspected, "assume that threat actors hold full administrative access." |
| Verify externally | Use the vendor's external integrity tool plus independent monitoring, not the on-box check alone | Mandiant/Ivanti: run the ICT "in conjunction with other security monitoring tools" |

## 4. Defenses ranked by impact

The ranking is my judgment. It weighs how often a control would have broken the documented chains above (Handa, Osaka, Akira/SonicWall, Ivanti, Fortinet) against what it costs. Each item cites the guidance behind it.

### 4.1 Executives (budget and governance)

1. **Own every door.** Keep an asset inventory of every internet-facing device, including vendor-installed remote-maintenance boxes. Give each a named owner and a contract clause that makes vendors notify you of vulnerabilities and patch them. Osaka's root cause was the unclear responsibility split, and asset inventory had not been done ([大阪急性期][osaka] p.14). Handa never received the vendor's vulnerability notices ([半田 技術編][handa-tech] PDF p.17). See also CISA/FBI/NCSC: "Maintain an inventory of all edge devices and their respective support timelines." ([EOS fact sheet][eos-fs]).
2. **Set a patch SLA measured in hours to days for internet-facing exploited bugs, with a compromise check attached.** CISA's federal benchmark is three days plus forensic triage for the top tier ([BOD 26-04][bod2604]). Today's reality is a median of 32 days ([SecurityWeek][dbir-sw]). Budget for a standby unit or HA pair so a reboot doesn't need executive sign-off.
3. **Require MFA on all remote access, phishing-resistant for admins.** MFA was missing in 63% of breached organizations in Sophos's 2024 data ([Sophos 2025][sophos25]). Akira walked into VPNs without MFA ([AA24-109A][akira]). 39.8% of Japanese organizations use ID/password only ([NPA][npa-leaflet]).
4. **Replace end-of-life edge devices on a funded schedule.** An EOS device gets no more patches ([EOS fact sheet][eos-fs]). Osaka's entry box was on 5.4.2 firmware ([大阪急性期][osaka] p.37).
5. **Keep offline or immutable backups, and test the restore.** Handa recovered from offline backups kept to 2018 ([半田 本編][handa-main] PDF p.25). Osaka's online-only critical-care backups were unusable and the on-site tape device was encrypted ([大阪急性期][osaka] p.38, p.40). CISA: "Maintain offline backups of data and regularly test and maintain backup and restoration processes" ([AA24-109A][akira]).
6. **Sign an incident-response retainer and fund log retention.** The rule is to preserve before you patch. Both hospitals lost their VPN logs to a hasty firmware upgrade ([大阪急性期][osaka] p.46; [半田 本編][handa-main] PDF p.19). Mandiant's M-Trends 2026 reports that 90-day retention leaves organizations blind to long-dwell edge intrusions ([M-Trends 2026][mtrends26], search).
7. **Plan to stop treating the VPN as "the security".** Adopt a ZTNA/zero-trust roadmap. CCCS: move away "from overreliance on boundary protections like edge devices" ([CCCS][cccs-edge]). The honest caveat is in 4.3.

### 4.2 Engineers

1. **Take management interfaces off the internet, and restrict who can reach the portal.** Management goes on a separate network or behind a separate policy enforcement point. CISA BOD 23-02 gives 14 days to remove or front exposed management interfaces ([BOD 23-02][bod2302], search). CCCS: "network management interfaces (NMIs) should not be directly exposed to the Internet." ([CCCS][cccs-edge]). Handa had no source-IP restriction at all ([半田 技術編][handa-tech] PDF p.13).
2. **After any VPN KEV: patch, reset every credential, revoke sessions, hunt, rebuild if in doubt.** The procedure is in section 3. This step is what breaks the "stolen-before-patch" pattern ([Arctic Wolf][arcticwolf], [SonicWall][sonicwall], [JPCERT/CC][jpcert-2020]).
3. **Use phishing-resistant MFA plus certificate-based device posture.** CCCS: "Use strong, phishing-resistant multi-factor authentication (MFA) for all administrative access to devices." ([CCCS][cccs-edge]). OTP-protected SonicWall accounts were still logged into during the 2025 Akira wave ([Arctic Wolf][arcticwolf]), so OTP alone is not the finish line. Requiring a device certificate means a stolen password alone is not enough. Note: the device-cert recommendation is my inference from the threat model; NPA counts 電子証明書 as an authentication method in use (27.5%) ([NPA][npa-leaflet]).
4. **Segment behind the VPN.** VPN users and vendors land in a restricted zone, not the flat LAN. No always-on RDP. Use unique local admin passwords and account lockout. Osaka's own fix list covers this: unique passwords per server, lockout enabled, users not admins, AV on EMR servers ([大阪急性期][osaka] p.19). GTIG recommends "zero-trust fundamentals such as least-privilege access and network segmentation." ([GTIG][gtig]).
5. **Ship logs off the box to a SIEM, keep them long, and alert on admin activity.** CCCS: "Enable centralized (off-device) logging and configure log levels to be as detailed as possible." and "Alert on successful administrative log-ons, configuration changes and hardware changes." ([CCCS][cccs-edge]).
6. **Check integrity from outside.** Use the vendor's external checker, compare the running config against a known-good baseline, and watch for unexpected files and processes. Do not rely on the on-box ICT alone ([Mandiant][mandiant-ivanti], [AA24-060B][ivanti-cisa]).
7. **Monitor KEV and vendor PSIRTs automatically.** CISA: "Organizations should use the KEV catalog as an input to their vulnerability management prioritization framework." ([KEV catalog][kev]).
8. **Run EDR on every server, including the "fragile" ones, and protect backup credentials.** Handa and Osaka ran EMR servers without AV ([半田 技術編][handa-tech] PDF p.12; [大阪急性期][osaka] p.19). Akira and Arctic Wolf cases target Veeam credentials ([AA24-109A][akira], [Arctic Wolf][arcticwolf]).
9. **Migrate to ZTNA or an identity-aware proxy, with eyes open** (see 4.3).

### 4.3 Honest caveat: ZTNA is also edge software

- Ivanti Neurons for ZTA gateways were in scope for the same pre-auth RCE as Ivanti Connect Secure. CVE-2025-0282 affects "Ivanti Neurons for ZTA gateways before version 22.7R2.3" ([CVE record][cve-0282], read).
- What ZTNA really changes: per-application access instead of network-level access, no inbound listener on your premises (vendor-hosted models), and identity plus device checks on every request. That shrinks the blast radius after a stolen credential. It does not remove the need to patch, log and reset credentials. That last point is my synthesis; CCCS and GTIG both frame zero trust as reducing reliance on the perimeter, not as eliminating it ([CCCS][cccs-edge], [GTIG][gtig]).
- NSA/CISA (2021) also advise: "Avoid selecting non-standard VPN solutions, including a class of products referred to as Secure Sockets Layer/Transport Layer Security (SSL/TLS) VPNs." ([NSA/CISA VPN CSI][nsa-vpn], search; the PDF returned 403 to my fetcher, so verify the wording before quoting).

## 5. Glossary

The full EN/JA entries are in `glossary.json` (same directory). Summary:

| Term (EN) | 用語 (JA) | Beginner definition | Expert note |
| --- | --- | --- | --- |
| VPN | VPN（仮想プライベートネットワーク） | An encrypted tunnel that lets you use the office network from outside | The concentrator is internet-facing and grants network-level access; that combination is the risk |
| SSL-VPN | SSL-VPN | A VPN you reach through a web browser-style (HTTPS) portal | The portal is a large web app on the appliance, reachable pre-auth; NSA/CISA advised avoiding non-standard SSL/TLS VPNs |
| Edge device | エッジデバイス（境界機器） | A device at the border between your network and the internet | Firewalls, VPN gateways, routers, load balancers; CISA BOD 26-02 targets EOS ones |
| Pre-authentication | 認証前（プリオース） | Something an attacker can do before logging in | Pre-auth RCE on the portal = no credentials needed at all |
| CVE | CVE（共通脆弱性識別子） | An ID number for a publicly known security flaw | An identifier only; says nothing about whether it is exploited |
| CVSS | CVSS（共通脆弱性評価システム） | A 0-10 severity score for a flaw | Severity is not risk; BOD 26-04 dropped CVSS-based prioritization for US agencies |
| KEV | KEV（既知の悪用された脆弱性カタログ） | CISA's list of flaws known to be exploited in the wild | Best single "patch this now" signal; entries can carry a forensic-triage flag |
| Zero-day | ゼロデイ | A flaw attackers use before a fix exists | CVE-2025-0282 was exploited as a zero-day |
| N-day | Nデイ | A known flaw with a fix available that is still unpatched | Most VPN ransomware entries (CVE-2018-13379 at Handa/Osaka) were n-days |
| Patch | パッチ（修正プログラム） | A vendor update that fixes a flaw | Fixes the bug, does not evict an intruder or un-steal credentials |
| MFA | 多要素認証 | Logging in with a second proof besides a password | OTP/push can be phished or bypassed; prefer FIDO2/certificate-based |
| Session token | セッショントークン | A ticket that keeps you logged in after you sign in | Stolen tokens and cookies skip MFA; revoke sessions after compromise |
| Active Directory | Active Directory（AD） | The Windows directory that manages users and computers | VPNs often bind to AD; owning AD = owning the Windows estate |
| Domain admin | ドメイン管理者 | An account that can control every Windows machine in the organization | Main goal of stage 4; usually obtained via credential dumping or reuse |
| Lateral movement | 横展開（水平展開） | Hopping from one compromised machine to others | RDP/SMB/remote service execution with stolen or shared credentials |
| Ransomware | ランサムウェア | Malware that locks your data and demands payment | Human-operated, RaaS affiliate model; encryption is the last step |
| Double extortion | 二重恐喝 | Stealing data and threatening to leak it, on top of encryption | Backups do not solve the leak threat |
| ZTNA | ZTNA（ゼロトラストネットワークアクセス） | Access to specific apps after checking user and device every time | Shrinks blast radius but is itself edge software with CVEs |
| EDR | EDR（エンドポイント検知・対応） | Security software that watches computers for attacker behavior | Usually cannot run on VPN appliances, and attackers try to disable it |
| Dwell time | 滞留時間（ドウェルタイム） | How long attackers are inside before being found | Sophos ransomware median 3-4 days; Mandiant global median 14 days (2025) |

## 6. Confidence and gaps

- **High confidence.** The hospital narratives (read directly from the PDFs), the CISA advisories (AA24-109A, AA23-165A, AA23-061A, AA24-060B), Mandiant, Volexity, Fortinet PSIRT, the CISA Fortinet alert, GTIG, the CCCS guidance, the NCSC blog, Sophos 2025/2026, Arctic Wolf, the SonicWall notice, the JPCERT/CC 2020 notice, the EOS fact sheet, the Secure by Design alert, the BOD 26-04 page and the NPA leaflet.
- **Medium (search-sourced).** The NSA/CISA VPN CSI wording (PDF 403), the BOD 23-02 details, the Verizon DBIR numbers (via SecurityWeek and Tenable, not the DBIR itself), the M-Trends 2026 figures (exec PDF had no text layer), and Qilin initial access via PRODAFT (reported by BleepingComputer; PRODAFT's own alert not read).
- **Qilin.** No CISA #StopRansomware advisory for Qilin was found as of late August 2026, per secondary trackers. CIS/MS-ISAC and HHS HC3 have profiles. Do not cite a "CISA Qilin advisory" unless one is found ([CIS Qilin Q2 2025][cis-qilin], search).
- **Not fetched.** The ASD practitioner guidance (timed out twice), the NCSC forensics specification, the NISC 2020 alert PDF and the JPCERT/CC 2019 alert. The site can link them, but this file does not quote them.
- **Inferences, flagged inline.** "Runs as root" as a general design claim, the Osaka appliance being a FortiGate, device-certificate posture as an engineer priority, and the overall defense ranking.

## Sources

Japanese incident reports (primary, read):

- [徳島県つるぎ町立半田病院 有識者会議調査報告書 本編 (2022-06)][handa-main]
- [同 技術編 (2022-06-07)][handa-tech]
- [大阪急性期・総合医療センター 調査報告書 (2023-03-28)][osaka]

Government and CERT guidance:

- [CISA #StopRansomware: Akira AA24-109A (updated 2025-11-13)][akira]
- [CISA alert on the Akira update (2025-11-13)][akira-alert]
- [CISA: Understanding Ransomware Threat Actors: LockBit AA23-165A][lockbit]
- [CISA #StopRansomware: Royal/BlackSuit AA23-061A (updated 2024-08-07)][blacksuit]
- [CISA AA24-060B: Ivanti Connect Secure exploitation (2024-02-29)][ivanti-cisa]
- [NSA/CISA: Selecting and Hardening Remote Access VPN Solutions (2021-09-28)][nsa-vpn]
- [CISA alert on the VPN CSI (2021-09-28)][cisa-vpn-alert]
- [CCCS: Security considerations for edge devices ITSM.80.101 (2025-02)][cccs-edge]
- [CCCS: Five Eyes edge-device series announcement][cccs-news]
- [CISA: Guidance and Strategies to Protect Network Edge Devices (2025-02-04)][cisa-edge]
- [NCSC: Making forensic observability the norm for network devices (2026-07-29)][ncsc-blog]
- [CISA/FBI/NCSC: Reducing the Attack Surface for End-of-Support Edge Devices (2026-02-05)][eos-fs]
- [CISA BOD 26-02 (2026-02-05)][bod2602]
- [CISA BOD 23-02 (2023-06-13)][bod2302]
- [CISA BOD 26-04 (2026-06-10)][bod2604]
- [CISA KEV catalog][kev]
- [CISA/FBI Secure by Design Alert: Eliminating Buffer Overflow Vulnerabilities (2025-02-12)][bo-alert]
- [CISA alert: Fortinet post-exploitation technique (2025-04-11)][cisa-forti]
- [JPCERT/CC: CVE-2018-13379 affected-host information (2020-11-27)][jpcert-2020]
- [警察庁 サイバー攻撃の被害に係るアンケート調査結果及び対策 (令和8年1月)][npa-leaflet]

Vendor and researcher write-ups:

- [Fortinet PSIRT: Analysis of Threat Actor Activity (2025-04-10)][fortinet-psirt]
- [Mandiant: Ivanti Connect Secure CVE-2025-0282 (2025-01-09)][mandiant-ivanti]
- [CVE-2025-0282 record][cve-0282]
- [Volexity: Ivanti Connect Secure zero-days (2024-01-10)][volexity]
- [GTIG: 2024 zero-day review][gtig]
- [Sophos Active Adversary Report 2025][sophos25]
- [Sophos Active Adversary Report 2026][sophos26]
- [Arctic Wolf: Akira SonicWall campaign][arcticwolf]
- [SonicWall notice: Gen 7 SSLVPN threat activity (2025-08-04)][sonicwall]
- [Microsoft: 10 essential insights from MDDR 2024][msft]
- [Coalition Cyber Threat Index 2025][coalition]
- [MITRE ATT&CK Enterprise][attack]

Search-sourced secondary reporting:

- [SecurityWeek: Verizon DBIR edge patch delays][dbir-sw]
- [Tenable: DBIR edge-device data][tenable]
- [Mandiant M-Trends 2026 executive edition][mtrends26]
- [BleepingComputer: Fortinet flaws exploited in Qilin attacks][qilin-bc]
- [CIS: Qilin top ransomware threat to SLTTs Q2 2025][cis-qilin]

[handa-main]: https://www.handa-hospital.jp/topics/2022/0616/report_01.pdf
[handa-tech]: https://www.handa-hospital.jp/topics/2022/0616/report_02.pdf
[osaka]: https://www.gh.opho.jp/pdf/report_v01.pdf
[akira]: https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-109a
[akira-alert]: https://www.cisa.gov/news-events/alerts/2025/11/13/cisa-and-partners-release-advisory-update-akira-ransomware
[lockbit]: https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a
[blacksuit]: https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a
[ivanti-cisa]: https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060b
[nsa-vpn]: https://media.defense.gov/2021/Sep/28/2002863184/-1/-1/0/CSI_SELECTING-HARDENING-REMOTE-ACCESS-VPNS-20210928.PDF
[cisa-vpn-alert]: https://www.cisa.gov/news-events/alerts/2021/09/28/cisa-and-nsa-release-guidance-selecting-and-hardening-vpns
[cccs-edge]: https://www.cyber.gc.ca/en/guidance/security-considerations-edge-devices-itsm80101
[cccs-news]: https://www.cyber.gc.ca/en/news-events/five-eyes-publish-series-sound-alarm-cyber-security-threats-edge-devices
[cisa-edge]: https://www.cisa.gov/resources-tools/resources/guidance-and-strategies-protect-network-edge-devices
[ncsc-blog]: https://www.ncsc.gov.uk/blogs/making-forensic-observability-the-norm-for-network-devices
[eos-fs]: https://www.cisa.gov/sites/default/files/2026-02/joint-fact-sheet-reducing-the-attack-surface-of-end-of-support-edge-devices-508c.pdf
[bod2602]: https://www.cisa.gov/news-events/directives/bod-26-02-mitigating-risk-end-support-edge-devices
[bod2302]: https://www.cisa.gov/news-events/directives/binding-operational-directive-23-02
[bod2604]: https://www.cisa.gov/news-events/directives/bod-26-04-prioritizing-security-updates-based-risk
[kev]: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
[bo-alert]: https://www.cisa.gov/sites/default/files/2025-02/secure-by-design-alert-eliminating-buffer-overflow-vulnerabilities-508c.pdf
[cisa-forti]: https://www.cisa.gov/news-events/alerts/2025/04/11/fortinet-releases-advisory-new-post-exploitation-technique-known-vulnerabilities
[jpcert-2020]: https://www.jpcert.or.jp/newsflash/2020112701.html
[npa-leaflet]: https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf
[fortinet-psirt]: https://www.fortinet.com/blog/psirt-blogs/analysis-of-threat-actor-activity
[mandiant-ivanti]: https://cloud.google.com/blog/topics/threat-intelligence/ivanti-connect-secure-vpn-zero-day
[cve-0282]: https://www.cve.org/CVERecord?id=CVE-2025-0282
[volexity]: https://www.volexity.com/blog/2024/01/10/active-exploitation-of-two-zero-day-vulnerabilities-in-ivanti-connect-secure-vpn/
[gtig]: https://cloud.google.com/blog/topics/threat-intelligence/2024-zero-day-trends/
[sophos25]: https://www.sophos.com/en-us/blog/2025-sophos-active-adversary-report
[sophos26]: https://www.sophos.com/en-us/blog/2026-sophos-active-adversary-report
[arcticwolf]: https://arcticwolf.com/resources/blog/smash-and-grab-aggressive-akira-campaign-targets-sonicwall-vpns/
[sonicwall]: https://www.sonicwall.com/support/notices/gen-7-and-newer-sonicwall-firewalls-sslvpn-recent-threat-activity/250804095336430
[msft]: https://www.microsoft.com/en-us/security/security-insider/threat-landscape/10-essential-insights-from-the-microsoft-digital-defense-report-2024
[coalition]: https://www.coalitioninc.com/announcements/cyber-threat-index-2025
[attack]: https://attack.mitre.org/techniques/enterprise/
[dbir-sw]: https://www.securityweek.com/verizon-dbir-flags-major-patch-delays-on-vpns-edge-appliances/
[tenable]: https://www.tenable.com/blog/cybersecurity-snapshot-verizon-dbir-zeroday-vulnerability-exploits-surge-vpn-edge-device-04-25-2025
[mtrends26]: https://cloud.google.com/security/resources/m-trends-executive-edition
[qilin-bc]: https://www.bleepingcomputer.com/news/security/critical-fortinet-flaws-now-exploited-in-qilin-ransomware-attacks/
[cis-qilin]: https://www.cisecurity.org/insights/blog/qilin-top-ransomware-threat-to-sltts-in-q2-2025
