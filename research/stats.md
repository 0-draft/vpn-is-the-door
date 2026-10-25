# VPN is the door: primary-source statistics

Compiled 2026-10-25. Every figure below was read from the primary document or dataset named in its row, unless it is marked **UNVERIFIED**. Percentages marked "(calc)" are computed here from the primary counts and are not printed in the source. Wording quoted in quotation marks is verbatim from the source.

How the sources were read:

- NPA PDFs from 令和6年 on are 13–27MB and could not be opened with the tools available. The NPA's own 統計データ workbooks (.xlsx) on the same index page were parsed cell by cell instead. They are primary, and their sheet names carry the PDF page they back (for example `統計編P124`). Where only the workbook was read, the page number is taken from the sheet name and the PDF page itself was not opened.
- The R4 and R5 Japanese PDFs and the R7 English PDF were opened and their text extracted, so page numbers for those are confirmed.
- CISA KEV was read from CISA's official GitHub mirror (`cisagov/kev-data`), because `www.cisa.gov` was unreachable from the research sandbox.

## 1. 警察庁「サイバー空間をめぐる脅威の情勢等について」: ransomware

Index page: <https://www.npa.go.jp/publications/statistics/cybersecurity/index.html>

| Edition | Document title (verbatim) | Published | PDF | Data workbook |
| --- | --- | --- | --- | --- |
| R4 (2022) | 令和４年におけるサイバー空間をめぐる脅威の情勢等について | 令和５年３月16日 (PDF cover) | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R04_cyber_jousei.pdf> | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R04_jousei_data.xlsx> |
| R5 (2023) | 令和５年におけるサイバー空間をめぐる脅威の情勢等について | 令和６年３月14日 (PDF cover) | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R5/R05_cyber_jousei.pdf> | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R5/R05_jousei_data.xlsx> |
| R6 (2024) | 令和６年におけるサイバー空間をめぐる脅威の情勢等について | 令和７年３月13日 (search-result title of the PDF; PDF not opened, 12.98MB) | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R6/R06_cyber_jousei.pdf> | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R6/R06_jousei_data.xlsx> |
| R7 (2025) | 令和７年におけるサイバー空間をめぐる脅威の情勢等について | March 2026 (English edition cover: "March 2026") | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei.pdf> (27.1MB, not opened) | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_jousei_data.xlsx> |
| R7 English | Threats in Cyberspace in 2025 And Police Efforts | March 2026 | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei_eng.pdf> | n/a |
| R8 上半期 (2026 H1) | 令和８年上半期におけるサイバー空間をめぐる脅威の情勢等について | 令和８年９月10日 (date given in the errata) | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R8kami/R08_kami_cyber_jousei.pdf> (26.7MB, not opened) | <https://www.npa.go.jp/publications/statistics/cybersecurity/data/R8kami/R08kami_jousei_data.xlsx> |

The R8上半期 errata (<https://www.npa.go.jp/publications/statistics/cybersecurity/data/R8kami/R08_kami_cyber_jousei_seigohyou_.pdf>) corrects only p.15 【図表10：特殊詐欺の認知件数・被害額】. It does not touch the ransomware figures.

### 1.1 Infection route (感染経路) by year

Each figure comes from the victim survey, counting valid answers only (不明・未回答 excluded). The R8上半期 workbook sheet `統計編p143(3)` gives the R3–R7 series, and it matches each year's own workbook exactly.

| Year | Valid responses | VPN機器 | リモートデスクトップ | 不審メールやその添付ファイル | その他 | VPN+RDP (calc) | Source location |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R3 (2021) | 76 | 41 (53.9% calc) | 15 (19.7% calc) | 5 (6.6% calc) | 15 (19.7% calc) | 73.7% | R8上半期 xlsx `統計編p143(3)` |
| R4 (2022) | 102 | 63 (62%) | 19 (19%) | 9 (9%) | 11 (11%) | 80.4% (NPA text: 81%) | R4 PDF p.5 【図表６：感染経路】; xlsx sheet `図表6` |
| R5 (2023) | 115 | 73 (63%) | 21 (18%) | 6 (5%) | 15 (13%) | 81.7% (NPA text: 約82%) | R5 PDF p.25–26 【図表25：感染経路】; xlsx `図表25` |
| R6 (2024) | 100 | 55 (55.0% calc) | 31 (31.0% calc) | 2 (2.0% calc) | 12 (12.0% calc) | 86.0% | R6 xlsx `資料編P46(3)` |
| R7 (2025) | 92 | 61 (66.3% calc) | 19 (20.7% calc) | 2 (2.2% calc) | 10 (10.9% calc) | 87.0% | R7 xlsx `統計編P124` |
| R8上半期 (2026 H1) | 36 | 18 (50.0% calc) | 9 (25.0% calc) | no row in table | 9 (25.0% calc) | 75.0% | R8上半期 xlsx `統計編p143(1)` |
| R3–R7 combined | 485 | 293 (60.4% calc) | 105 (21.6% calc) | 24 (4.9% calc) | 63 (13.0% calc) | 82.1% | R8上半期 xlsx `統計編p143(2)` ("過去５年合算") |

The second-hand 2025 figures are **confirmed exactly**: VPN 61 of 92 = 66.3%, RDP 19 = 20.7%, email 2 = 2.2%, other 10 = 10.9%, 226 reports in total.

The R8上半期 sample is small (36). Its 50% VPN share should not be read as a trend change.

Verbatim NPA wording:

- R4 PDF p.5: 「ＶＰＮ機器からの侵入が63件で62％、リモートデスクトップからの侵入が19件で19％を占め、テレワーク等に利用される機器等のぜい弱性や強度の弱い認証情報等を利用して侵入したと考えられるものが81％と大半を占めた。」
- R5 PDF p.25: 「ＶＰＮ機器からの侵入が73件で63％、リモートデスクトップからの侵入が21件で18％を占め、テレワーク等に利用される機器等のぜい弱性や強度の弱い認証情報等を利用して侵入したと考えられるものが約82％と大半を占めた。」
- R5 PDF p.22–23: 「感染経路は、令和４年に引き続き、ぜい弱性を有するＶＰＮ機器等や強度の弱い認証情報等が設定されたリモートデスクトップサービスが多くを占めた。」
- R7 English PDF p.15: "According to a survey of affected organizations, VPN (Virtual Private Network) devices accounted for more than 60% of the intrusion routes. Attackers exploit unpatched vulnerabilities, leaked credentials, weak passwords, and misconfigurations to infiltrate an organization's network."
- R7 English PDF p.15: "Backups are often encrypted along with the original data to prevent recovery."
- R7 English PDF p.16: "VPN devices, which are major entry points for intrusions, require prompt action."
- **UNVERIFIED**: the R6 sentences reported second-hand (VPN+RDP 「8割超」 and 「ID・パスワード等が非常に安易」). The R6 PDF could not be opened. The R6 counts above (55+31 of 100 = 86%) do support "8割超".

### 1.2 Total reports, victim size, method

| Item | R4 | R5 | R6 | R7 | R8上半期 | Source |
| --- | --- | --- | --- | --- | --- | --- |
| ランサムウェア被害報告件数 | 230 | 197 | 222 | 226 | 123 | R8上半期 xlsx `統計編p139(1)`, `統計編p139(2)` |
| Half-year split | 上114 / 下116 | 上103 / 下94 | 上114 / 下108 | 上116 / 下110 | 上123 | R8上半期 xlsx `統計編p139(2)` |
| ノーウェアランサム | 統計なし | 30 | 22 | 17 | 9 | same |
| 大企業 | 63 | 71 | 61 | 64 | 31 | R8上半期 xlsx `統計編p141(1)`, `統計編p141(3)` |
| 中小企業 | 121 (53%) | 102 (52%) | 140 (63.1% calc) | 143 (63.3% calc) | 79 (64.2% calc) | same |
| 団体等 | 46 | 24 | 21 | 19 | 13 | same |
| 二重恐喝型 / 従来型 (cases where method was known) | 119 / 63 | 130 / 45 | 111 / 23 | 136 / 17 | 61 / 5 | R8上半期 xlsx `統計編p140(1)`, `統計編p140(3)` |

R8上半期 has 123 reports, the highest half-year in the series that starts at R2下 (21). The previous peak was 116 (R4下 and R7上). Source: R8上半期 xlsx `図表４`.

R7 by industry: 製造業 91 of 226 (40.3% calc). Source: R7 xlsx `統計編P123`. The R7 English PDF p.14 says "manufacturing accounts for approximately 40%".

### 1.3 Patch status of the device used as the intrusion route

Sheet title in R7: 「侵入経路とされる機器のセキュリティパッチの適用状況」.

| Year | Valid responses | 最新のセキュリティパッチを適用済み | 未適用のセキュリティパッチ有 | Unpatched share (calc) | Source |
| --- | --- | --- | --- | --- | --- |
| R4 | 100 | 35 | 65 | 65.0% | R8上半期 xlsx `統計編p153(3)` |
| R5 | 86 | 34 | 52 | 60.5% | same |
| R6 | 87 | 41 | 46 | 52.9% | same; also R6 xlsx `資料編P50(1)` |
| R7 | 71 | 31 | 40 | 56.3% | same; also R7 xlsx `統計編P134` |
| R8上半期 | 29 | 12 | 17 | 58.6% | R8上半期 xlsx `統計編p153(1)` |
| R4–R7 combined | 344 | 141 | 203 | 59.0% | R8上半期 xlsx `統計編p153(2)` ("過去４年") |

Reading: in roughly 6 of 10 cases the intrusion device was missing patches. In roughly 4 of 10 it was already fully patched. JPCERT/CC documents one mechanism for the patched cases: credentials stolen before the patch was applied are reused afterwards (see section 4).

### 1.4 Backups

| Item | R4 | R5 | R6 | R7 | R8上半期 | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Backup obtained / valid | 116 / 139 (83%) | 132 / 140 (94%) | 122 / 136 | 105 / 116 (90.5% calc) | 44 / 50 | R8上半期 xlsx `統計編p147(1)`, `統計編p147(3)` |
| Could not restore / tried | 90 / 111 (81%) | 105 / 126 (83%) | 81 / 110 (73.6% calc) | 79 / 99 (79.8% calc) | 29 / 40 (72.5% calc) | `統計編p148(1)`, `統計編p148(3)` |
| Reason: backup also encrypted (or erased) / total reasons | 62 / 86 | 72 / 104 | 54 / 74 | 48 / 72 (66.7% calc) | 14 / 29 | `統計編p149(1)`, `統計編p149(3)` |
| Reason: 運用不備 | 16 | 16 | 14 | 19 | 8 | same |

Combined R3–R7: could not restore 427 of 547 (78.1% calc). Source: R8上半期 xlsx `統計編p148(2)`.

The R7 workbook labels the reason 「バックアップも暗号化」. The R8上半期 workbook labels it 「バックアップの暗号化・消去」.

Verbatim: R4 PDF p.5–6: 「取得していたバックアップから復元を試みた111件の回答のうち、バックアップから被害直前の水準まで復旧出来なかったものは90件で81％であった。」 R5 PDF p.26: 「バックアップから被害直前の水準まで復元できなかったものは105件で83％であった。」

### 1.5 Recovery time (復旧等に要した期間)

| Year | Valid | 即時～1週間未満 | 1週間～1か月未満 | 1か月～2か月未満 | 2か月以上 | 復旧中 | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R4 | 131 | 34 | 33 | 21 | 14 | 29 | R8上半期 xlsx `統計編p144(3)` |
| R5 | 136 | 33 | 43 | 22 | 6 | 32 | same |
| R6 | 126 | 33 | 31 | 22 | 9 | 31 | same |
| R7 | 107 | 29 | 31 | 15 | 7 | 25 | same; R7 xlsx `統計編P125` |
| R8上半期 | 48 | 17 | 6 | 4 | 8 | 13 | R8上半期 xlsx `統計編p144(1)` |

R7 English PDF p.14: "only slightly more than 50% of organizations recovered in less than a month". From the counts, 60 of 107 = 56.1% (calc).

### 1.6 Investigation and recovery cost (調査・復旧費用の総額)

| Year | Valid | <100万円 | 100–500万 | 500–1,000万 | 1,000–5,000万 | 5,000万–1億 | ≥1億 | ≥1,000万 share | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R4 | 121 | 29 | 19 | 17 | 40 | 16 (5,000万円以上, not split) | (incl. left) | 56 / 121 = 46% (NPA text) | R4 PDF p.5 【図表８】; R4 xlsx `図表8` |
| R5 | 118 | 27 | 23 | 24 | 25 | 12 | 7 | 44 / 118 = 37% (NPA text) | R5 PDF p.26 【図表27】 |
| R6 | 102 | 23 | 16 | 12 | 28 | 15 | 8 | 51 / 102 = 50.0% (calc) | R6 xlsx `資料編P47(2)` |
| R7 | 89 | 16 | 18 | 9 | 32 | 9 | 5 | 46 / 89 = 51.7% (calc) | R7 xlsx `統計編P126` |
| R8上半期 | 35 | 6 | 5 | 3 | 11 | 6 | 4 | 21 / 35 = 60.0% (calc) | R8上半期 xlsx `統計編p145(1)` |

The R8上半期 workbook's back-series (`統計編p145(3)`) gives R4 as 0 for ≥1億 and 16 for 5,000万–1億, which re-buckets R4's single 「5,000万円以上」 class. R7 English PDF p.14: "More than half of the organizations surveyed incurred total costs of 10 million yen or more for recovery."

### 1.7 Other R7 survey items (R7 xlsx)

| Item | Figure | Sheet |
| --- | --- | --- |
| Business impact | 全業務停止 9, 一部の業務に影響有 97, 影響無 11 (n=117) | `統計編P131` |
| Antivirus installed / detected anything | 105 of 119 installed; detection 25 of 89 | `統計編P135`, `統計編P136` |
| Logs | 全て保全 25 of 102; reasons unusable include 犯人による削除 20, 暗号化 20 | `統計編P137`, `統計編P138` |
| Security audit | 監査無 63 of 111 | `統計編P132` |
| BCP | ＢＣＰを策定していない 47 of 111; BCP that covers cyberattack 20 | `統計編P133` |
| Top ransomware families (R7, known cases n=149) | Qilin 32, LockBit 19, Akira 17, Lynx 8, RansomHub 8 | `図表12 ⑵` |

### Sources (NPA)

- [警察庁 サイバー空間をめぐる脅威の情勢等 index](https://www.npa.go.jp/publications/statistics/cybersecurity/index.html)
- [令和４年における… PDF](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R04_cyber_jousei.pdf) / [R4 統計データ](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R04_jousei_data.xlsx)
- [令和５年における… PDF](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R5/R05_cyber_jousei.pdf) / [R5 統計データ](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R5/R05_jousei_data.xlsx)
- [令和６年における… PDF](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R6/R06_cyber_jousei.pdf) / [R6 統計データ](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R6/R06_jousei_data.xlsx)
- [令和７年における… PDF](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei.pdf) / [R7 統計データ](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_jousei_data.xlsx) / [R7 English edition](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R7/R07_cyber_jousei_eng.pdf)
- [令和８年上半期における… PDF](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R8kami/R08_kami_cyber_jousei.pdf) / [R8上半期 統計データ](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R8kami/R08kami_jousei_data.xlsx) / [R8上半期 正誤表](https://www.npa.go.jp/publications/statistics/cybersecurity/data/R8kami/R08_kami_cyber_jousei_seigohyou_.pdf)

## 2. IPA 情報セキュリティ10大脅威 (組織)

| Threat | 2025 rank | 2026 rank | 2026 track record (verbatim) |
| --- | --- | --- | --- |
| ランサム攻撃による被害 | 1 | 1 | 11年連続11回目 (初選出 2016年) |
| サプライチェーンや委託先を狙った攻撃 | 2 | 2 | 8年連続8回目 |
| AIの利用をめぐるサイバーリスク | n/a | 3 | 初選出 |
| システムの脆弱性を突いた攻撃 (2025) / システムの脆弱性を悪用した攻撃 (2026) | 3 | 4 | 6年連続9回目 |
| 機密情報等を狙った標的型攻撃 (2025) / 機密情報を狙った標的型攻撃 (2026) | 5 | 5 | 11年連続11回目 |
| 地政学的リスクに起因するサイバー攻撃 (2026: 「（情報戦を含む）」 added) | 7 | 6 | 2年連続2回目 |
| 内部不正による情報漏えい等 | 4 | 7 | 11年連続11回目 |
| リモートワーク等の環境や仕組みを狙った攻撃 | 6 | 8 | 6年連続6回目 |
| 分散型サービス妨害攻撃（DDoS攻撃） (2025) / DDoS攻撃（分散型サービス妨害攻撃） (2026) | 8 | 9 | 2年連続7回目 |
| ビジネスメール詐欺 | 9 | 10 | 9年連続9回目 |
| 不注意による情報漏えい等 | 10 | out | n/a |

Published: 2025 edition on 2025-01-30, 2026 edition on 2026-01-29 (IPA pages). The threat names were read through a page-summarising fetch. Check the exact wording against the page before printing it.

### Sources (IPA)

- [情報セキュリティ10大脅威 2025](https://www.ipa.go.jp/security/10threats/10threats2025.html)
- [情報セキュリティ10大脅威 2026](https://www.ipa.go.jp/security/10threats/10threats2026.html)

## 3. Global corroboration

### 3.1 Verizon DBIR

| Figure | 2025 DBIR | 2026 DBIR | Location |
| --- | --- | --- | --- |
| Exploitation of vulnerabilities as initial access vector | 20%, "an increase of 34%"; credential abuse "still the most common vector" | 31%, "now the most common initial access vector"; credential abuse "down to 13%" | 2025 Exec Summary p.6; 2026 Exec Summary p.9 |
| Edge devices + VPNs as a target of exploitation | "22%, and it grew almost eight-fold from the 3% found in last year's report" | **UNVERIFIED** (not in the 2026 Exec Summary; secondary blogs cite a new "Network" asset category rising 1.5% to 5%; full PDF is over 10MB and was not opened) | 2025 Exec Summary p.6 |
| Remediation | edge-device vulns: "only about 54% of those were fully remediated throughout the year, and it took a median of 32 days" | CISA KEV vulns: "Only 26% … were fully remediated by organizations in 2025, a drop from the previous year's 38%"; "median time for full resolution went up to 43 days"; "50% more critical vulnerabilities to patch" | 2025 ES p.6; 2026 ES p.9 |
| Ransomware present in breaches | 44% (up from 32%) | 48% (up from 44%) | 2025 ES p.6; 2026 ES p.10 |
| Ransomware: SMB vs large | SMB 88% vs large 39% of breaches | SMB initial access: exploitation of vulnerabilities 26%, credential abuse 13% | 2025 ES p.6; 2026 ES p.16 |
| Ransom payments | median $115,000; 64% did not pay | median $139,875 "from $150,000 in the previous year"; 69% did not pay | 2025 ES p.6; 2026 ES p.10 |
| Dataset | Figure 1 n=9,891 | "more than 31,000 … incidents, of which more than 22,000 were confirmed data breaches", 145 countries; "dataset covers Oct 2024 through Nov 2025" | 2026 ES p.5 |

Caveat: the 2026 summary gives the prior-year median ransom as $150,000, but the 2025 summary printed $115,000. Verizon's own numbers disagree, so do not headline the ransom comparison.

### 3.2 Mandiant M-Trends

| Figure | M-Trends 2025 (2024 data) | M-Trends 2026 (2025 data) | Location |
| --- | --- | --- | --- |
| Top initial infection vector | Exploits 33% ("For the fifth year in a row"); stolen credentials 16%; email phishing 14% (2023 exploits: 38%) | Exploits 32% "for the sixth consecutive year"; voice phishing 11%; email phishing 6% | 2025 report p.10; 2026 Executive Edition PDF p.3 (printed p.4) |
| Most frequently exploited vulnerabilities | CVE-2024-3400 (PAN-OS GlobalProtect), CVE-2023-46805 and CVE-2024-21887 (Ivanti Connect Secure / Policy Secure), CVE-2023-48788 (FortiClient EMS). "the most frequently exploited vulnerabilities affected security devices, which are, due to their function, typically placed at the edge of the network. Three of the four vulnerabilities were first exploited as zero-days." | **UNVERIFIED** (not in the Executive Edition) | 2025 report p.11 |
| Global median dwell time | 11 days (2014: 205 days) | 14 days ("rose to 14 days from 11 days") | 2025 p.14; 2026 EE p.3 |
| Ransomware-related intrusions | 21% of investigations; top vector brute force (26%) incl. "virtual private network (VPN) devices compromised through default credentials"; stolen credentials and exploits 21% each; prior compromise 15%; ransomware dwell 6 days | prior compromise top at 30% | 2025 p.26, p.28; 2026 EE p.3 |
| Unknown vector | 34% of 2024 intrusions | n/a | 2025 p.11 |
| Time to exploit | Mandiant TTE study: average TTE "just five days" in 2023 (63 days 2018–2019, 32 days 2021–2022); zero-day:n-day 70:30 | EE: "The mean time to exploit vulnerabilities has plummeted"; the −7 days figure in secondary write-ups is **UNVERIFIED** | Google Cloud blog 2024-10-16; 2026 EE p.10 |

### 3.3 CISA KEV per vendor

Fetched 2026-10-25 13:46 UTC from `cisagov/kev-data` (CISA's official GitHub repo). catalogVersion `2026.10.23`, dateReleased `2026-10-23T19:30:18.9209Z`, 1,756 entries. Counted with jq on `vendorProject`, `product` and `knownRansomwareCampaignUse == "Known"`.

| Vendor (`vendorProject`) | All KEV entries | Known ransomware use | VPN/firewall product lines only | …of which Known ransomware use |
| --- | --- | --- | --- | --- |
| Fortinet | 32 | 14 | 15 (product contains FortiOS / FortiProxy) | 12 |
| Ivanti (+ "Pulse Secure" 1) | 36 + 1 | 12 + 0 | 15 (Connect Secure / Policy Secure / Pulse) | 8 |
| Citrix | 27 | 7 | 21 (ADC / Gateway / NetScaler) | 4 |
| Palo Alto Networks | 16 | 6 | 13 (PAN-OS) | 6 |
| SonicWall | 19 | 13 | 15 (SonicOS / SMA) | 9 |
| Cisco | 101 | 7 | 14 (ASA / FTD; excludes 2 AnyConnect client entries) | 3 |
| Check Point | 5 | 2 | 4 (Security/Quantum Gateways, "Multiple Products") | 2 |
| **Seven VPN/firewall lines, total** | n/a | n/a | **97** | **44 (45.4% calc)** |
| Whole catalog | 1,756 | 361 (20.6% calc) | n/a | n/a |

KEV entries for the CVEs named on this site:

| CVE | Product | dateAdded | knownRansomwareCampaignUse |
| --- | --- | --- | --- |
| CVE-2018-13379 | Fortinet FortiOS SSL VPN | 2021-11-03 | Known |
| CVE-2022-40684 | Fortinet Multiple Products | 2022-10-11 | Known |
| CVE-2023-27997 | Fortinet FortiOS and FortiProxy SSL-VPN | 2023-06-13 | Known |
| CVE-2024-21762 | Fortinet FortiOS | 2024-02-09 | Known |
| CVE-2023-4966 (CitrixBleed) | Citrix NetScaler ADC and Gateway | 2023-10-18 | Known |
| CVE-2025-5777 (CitrixBleed 2) | Citrix NetScaler ADC and Gateway | 2025-07-10 | Known |
| CVE-2023-46805 | Ivanti Connect Secure and Policy Secure | 2024-01-10 | Known |
| CVE-2025-0282 | Ivanti Connect Secure, Policy Secure, and ZTA Gateways | 2025-01-08 | Known |
| CVE-2024-3400 | Palo Alto Networks PAN-OS | 2024-04-12 | Known |
| CVE-2024-40766 | SonicWall SonicOS | 2024-09-09 | Known |
| CVE-2024-53704 | SonicWall SonicOS SSLVPN | 2025-02-18 | Known |
| CVE-2024-24919 | Check Point Quantum Security Gateways | 2024-05-30 | Known |

Caveat: CISA sets `knownRansomwareCampaignUse` and only ever moves it from "Unknown" to "Known". A count of "Known" is therefore a lower bound.

### 3.4 Time from disclosure to exploitation

| Figure | Source and location |
| --- | --- |
| 884 KEVs with first-time exploitation evidence in 2025; "28.96% of KEVs showed evidence of exploitation on or before the day the CVE was published" | VulnCheck, State of Exploitation 2026, printed p.2–3 |
| 2025 exploitation timeline: <1 day 254 (29%), 1–31 days 80 (9%), 32–365 days 228 (26%) | same, printed p.3 |
| Top targeted technology in 2025: "Network Edge Device" 191 KEVs (CMS 163, open source 129) | same, printed p.5 |
| 181 exploited edge-device vulns in 2025; "42.5% … affected end-of-life or likely end-of-life devices"; "Only 23.7% … appear in CISA KEV" | VulnCheck, 2026 Exploring the Network Edge Report (web page) |
| Mandiant average TTE: 63 days (2018–19), 44 (2020–early 2021), 32 (2021–22), 5 (2023) | Google Cloud / Mandiant, "How Low Can You Go? An Analysis of 2023 Time-to-Exploit Trends" |
| CVE-2024-3400: "Within two weeks of its disclosure on April 12, 2024 … Mandiant observed more than a dozen separately tracked groups exploiting this vulnerability, including a RANSOMHUB affiliate" | M-Trends 2025 p.11 |
| **UNVERIFIED**: VulnCheck 1H-2025 figure "32.1%" | Seen only in search snippets of the VulnCheck 1H-2025 page; not opened |

### 3.5 Exposed and still-vulnerable devices (Shadowserver)

Read from Shadowserver's own Bluesky posts through the public AppView API.

| CVE | Date of scan | Count | Post |
| --- | --- | --- | --- |
| CVE-2024-21762 (FortiOS/FortiProxy) | 2024-03-06 | "nearly 150K"; the follow-up corrects the date to 2024-03-06 | at://shadowserver.bsky.social/app.bsky.feed.post/3kn4fd3k4qk2y (2024-03-07) |
| CVE-2024-21762 | ~2024-03-18 | "We still see over 133 000 vulnerable instances"; the same thread reports exploitation observed after the public analysis | post 3knxqbudjdg2r (2024-03-18) |
| CVE-2025-5777 (CitrixBleed 2) / CVE-2025-6543 | 2025-06-29 | "1289 & 2100 IPs still seen unpatched as of 2025-06-29. Top: US & DE" | post 3lssuiekprk2y (2025-06-30) |
| CVE-2025-5777 / CVE-2025-6543 | ~2025-08-11 | "(3312 seen)" for CVE-2025-5777; 4,142 for CVE-2025-6543 | post 3lw6z7psrbs2u (2025-08-12) |

Japan-specific counts: **not found** in any primary text. Shadowserver posts country breakdowns only as dashboard tree-map images, and the dashboard is JavaScript-rendered. A second-hand figure ("Japan (600)" Fortinet devices with the symlink backdoor, April 2025) is **UNVERIFIED**.

JPCERT/CC JPCERT-AT-2026-0019 relays SOCRadar's count of login data for "86,644台以上" Fortinet devices in 194 countries. It states that this includes data related to Japanese companies. This is a third-party count relayed by JPCERT, not a JPCERT measurement.

### Sources (global)

- [Verizon 2025 DBIR Executive Summary](https://www.verizon.com/business/resources/reports/2025-dbir-executive-summary.pdf)
- [Verizon 2026 DBIR Executive Summary](https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf)
- [Verizon DBIR landing page](https://www.verizon.com/business/resources/reports/dbir/)
- [Verizon news release, 2025 DBIR](https://www.verizon.com/about/news/2025-data-breach-investigations-report)
- [Mandiant M-Trends 2025 report PDF](https://services.google.com/fh/files/misc/m-trends-2025-en.pdf)
- [M-Trends 2025 blog](https://cloud.google.com/blog/topics/threat-intelligence/m-trends-2025)
- [Mandiant M-Trends 2026 Executive Edition](https://services.google.com/fh/files/misc/m-trends-2026-executive-edition-en.pdf)
- [How Low Can You Go? An Analysis of 2023 Time-to-Exploit Trends](https://cloud.google.com/blog/topics/threat-intelligence/time-to-exploit-trends-2023)
- [CISA KEV JSON (official GitHub mirror)](https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json) and [canonical cisa.gov feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)
- [VulnCheck State of Exploitation 2026](https://wwv.vulncheck.com/hubfs/Research/2026-StateofExploitation.pdf?hsLang=en)
- [VulnCheck 2026 Exploring the Network Edge Report](https://wwv.vulncheck.com/2026-network-edge-device-report)
- [Shadowserver post, CVE-2024-21762, 2024-03-07](https://bsky.app/profile/shadowserver.bsky.social/post/3kn4fd3k4qk2y)
- [Shadowserver post, CVE-2024-21762, 2024-03-18](https://bsky.app/profile/shadowserver.bsky.social/post/3knxqbudjdg2r)
- [Shadowserver post, CVE-2025-5777, 2025-06-30](https://bsky.app/profile/shadowserver.bsky.social/post/3lssuiekprk2y)
- [Shadowserver post, CVE-2025-5777, 2025-08-12](https://bsky.app/profile/shadowserver.bsky.social/post/3lw6z7psrbs2u)
- [BleepingComputer, Over 3,000 NetScaler devices left unpatched (locator only)](https://www.bleepingcomputer.com/news/security/over-3-000-netscaler-devices-left-unpatched-against-actively-exploited-citrixbleed-2-flaw/)

## 4. Japanese government guidance on VPN devices

| Issuer | Title (verbatim) | ID / date | What it says (verbatim where quoted) |
| --- | --- | --- | --- |
| JPCERT/CC | Fortinet製FortiOSの境域外書き込みの脆弱性（CVE-2024-21762）に関する注意喚起 | JPCERT-AT-2024-0004, 2024-02-09 (updated 2024-02-29) | Upgrade to fixed versions. Workaround: 「SSL VPN機能を無効にすることで本脆弱性の回避が可能です。」 |
| JPCERT/CC | Incident Handling Report, July 1, 2024 - September 30, 2024 (§4.1 "Coordination involving cases of SSL-VPN vulnerabilities being exploited to steal credentials") | p.14 | "CVE-2023-27997 and CVE-2024-21762 are presumed to be among the exploited vulnerabilities. In some of the cases, the products already had a fix (patch) applied … but the attacker used credentials they had stolen before the fix was applied to gain access to the network." It advises checking for intrusion before updating firmware and "to change the passwords of the accounts that were being used." |
| JPCERT/CC | Ivanti Connect Secureなどにおける脆弱性（CVE-2025-0282）に関する注意喚起 | JPCERT-AT-2025-0001, 2025-01-09 (updated 2025-02-13) | 「JPCERT/CCでは、本脆弱性公開前の2024年12月下旬から本脆弱性が悪用された被害を国内で複数確認しています。」 Apply the fix and run Ivanti's Integrity Checker Tool. |
| JPCERT/CC | Fortinet製品に関連する認証情報の漏えいに関する注意喚起 | JPCERT-AT-2026-0019, 2026-06-23 | Covers the "FortiBleed" credential leak. Steps: check for config exports and unknown admin accounts, rotate credentials, move to PBKDF2 firmware, 「多要素認証の有効化などの対策を実施してください。」 |
| JPCERT/CC | Weekly Report 2025-07-09号 (CitrixBleed 2) and 四半期レポート FY2025 Q2 | 2025-07-09; 2025-10-16 | **Read through search summary only, not opened**: the quarterly report reportedly says JPCERT sent individual notices to likely-affected Japanese organizations about CVE-2025-5777. |
| NISC (内閣サイバーセキュリティセンター; now 国家サイバー統括室) | ランサムウエアによるサイバー攻撃に関する注意喚起について | 2021-04-30 | For internet-facing devices, 「セキュリティパッチを迅速に適用する」. It lists exploited VPN flaws: 「Fortinet 製 Virtual Private Network(VPN)装置の脆弱性(CVE-2018-13379)」 and 「Ivanti 製 VPN 装置「Pulse Connect Secure」の脆弱性(CVE-2021-22893、CVE-2020-8260、CVE-2020-8243、CVE-2019-11510)」, plus Citrix CVE-2019-19781 and SonicWall SMA 100 CVE-2021-20016. |
| NISC | ランサムウェアによるサイバー攻撃について（注意喚起） | 2020-11-26 | **UNVERIFIED** (seen only via the Tokyo Metropolitan Government summary page). Reportedly urges prompt patching of VPN devices and MFA. |
| IPA | VPN機器等に対するORB（Operational Relay Box）化を伴うネットワーク貫通型攻撃のおそれについて | 2025-10-31 | Countermeasures include 「迅速なパッチ適用・機器の更新」 and 「サポートが終了している古い機器については更新または廃棄を検討する」. |
| IPA | 【注意喚起】インターネット境界に設置された装置に対するサイバー攻撃について～ネットワーク貫通型攻撃に注意しましょう～ | 2023-08-01 | **UNVERIFIED URL** (described in secondary coverage only; IPA page not located) |

### Sources (guidance)

- [JPCERT-AT-2024-0004](https://www.jpcert.or.jp/at/2024/at240004.html)
- [JPCERT/CC Incident Handling Report 2024 Q2 (EN)](https://www.jpcert.or.jp/english/doc/IR_Report2024Q2_en.pdf)
- [JPCERT-AT-2025-0001](https://www.jpcert.or.jp/at/2025/at250001.html)
- [JPCERT-AT-2026-0019](https://www.jpcert.or.jp/at/2026/at260019.html)
- [JPCERT/CC Weekly Report 2025-07-09](https://www.jpcert.or.jp/wr/2025/wr250709.html) / [JPCERT/CC 四半期レポート FY2025 Q2](https://www.jpcert.or.jp/qr/2025/QR_FY2025-Q2.pdf) (not opened)
- [NISC ランサムウエアによるサイバー攻撃に関する注意喚起について (2021-04-30)](https://www.cyber.go.jp/pdf/policy/infra/ransomware20210430.pdf)
- [東京都 summary of NISC 2020-11-26 alert (locator only)](https://www.cybersecurity.metro.tokyo.lg.jp/security/cyberthreat/297/)
- [IPA VPN機器等に対するORB化を伴うネットワーク貫通型攻撃のおそれについて](https://www.ipa.go.jp/security/security-alert/2025/alert20251031_vpn.html)

## Numbers safe to headline

1. EN: In 2025, 61 of 92 Japanese ransomware victims that identified the route (66.3%) were breached through a VPN device. JP: 2025年(令和7年)、侵入経路が判明したランサムウェア被害92件のうち61件(66.3%)がVPN機器からの侵入。Source: 警察庁 令和7年 統計データ `統計編P124`.
2. EN: VPN and remote desktop together made up 87% of 2025 intrusion routes (80 of 92). Suspicious email accounted for just 2 cases (2.2%). JP: VPN機器とリモートデスクトップで87%(92件中80件)。不審メールは2件(2.2%)のみ。Source: same.
3. EN: Over five years (2021–2025), VPN devices were the route in 293 of 485 cases (60.4%), and email in 24 (4.9%). JP: 過去5年(令和3〜7年)合算で、VPN機器293件/485件(60.4%)、メール24件(4.9%)。Source: 警察庁 令和8年上半期 統計データ `統計編p143(2)`.
4. EN: Japan logged 226 ransomware reports in 2025 and 123 in H1 2026, the highest half-year on record. JP: ランサムウェア被害報告は2025年226件、2026年上半期123件(半期として過去最多)。Source: 警察庁 令和8年上半期 統計データ `統計編p139(1)`, `統計編p139(2)`.
5. EN: In 59% of cases (203 of 344, 2022–2025), the device used to break in had unapplied security patches. JP: 侵入経路とされる機器の59%(令和4〜7年、344件中203件)に未適用のセキュリティパッチがあった。Source: 警察庁 令和8年上半期 統計データ `統計編p153(2)`.
6. EN: Patching alone is not enough. JPCERT/CC found intrusions into already-patched SSL-VPN devices using credentials stolen before the patch. JP: パッチだけでは不十分。パッチ適用済みのSSL-VPN機器に、適用前に窃取された認証情報で侵入された事例をJPCERT/CCが確認。Source: JPCERT/CC Incident Handling Report 2024 Q2, p.14.
7. EN: In 2025, 79 of 99 victims (80%) could not restore from their backups, and in 48 cases the backups had been encrypted too. JP: 2025年、バックアップから復元を試みた99件中79件(80%)が復元できず、うち48件はバックアップも暗号化されていた。Source: 警察庁 令和7年 統計データ `統計編P129`, `統計編P130`.
8. EN: Over half of 2025 victims (46 of 89) spent ¥10 million or more on investigation and recovery. JP: 2025年の被害組織の半数超(89件中46件)が調査・復旧に1,000万円以上を要した。Source: 警察庁 令和7年 統計データ `統計編P126`; English edition p.14.
9. EN: SMEs were 63% of 2025 ransomware victims (143 of 226). JP: 2025年のランサムウェア被害の63%(226件中143件)が中小企業。Source: 警察庁 令和7年 統計データ `統計編P122`.
10. EN: Exploiting vulnerabilities is now the top way breaches start worldwide (31%), and only 26% of CISA-KEV vulnerabilities were fully remediated, with a median of 43 days. JP: 世界の侵害の初期侵入で脆弱性悪用が1位(31%)。KEV掲載脆弱性の完全修正は26%にとどまり、中央値43日。Source: Verizon 2026 DBIR Executive Summary p.9.
11. EN: Edge devices and VPNs were 22% of vulnerability-exploitation targets in breaches, up nearly eight-fold from 3%. JP: 脆弱性悪用の標的のうちエッジ機器・VPNが22%(前年3%から約8倍)。Source: Verizon 2025 DBIR Executive Summary p.6.
12. EN: Of the 97 CISA KEV entries for seven major VPN/firewall product lines, 44 (45%) are flagged for known ransomware use, more than double the catalog-wide 21%. JP: 主要VPN/ファイアウォール7製品系列のKEV登録97件中44件(45%)がランサムウェアでの悪用既知。カタログ全体(21%)の2倍超。Source: CISA KEV catalog 2026.10.23 (own count, fetched 2026-10-25).

Supporting lines (safe, lower priority): ランサム攻撃による被害 has been IPA 10大脅威 (組織) #1 for 11 years in a row (2026). Exploits have been Mandiant's top initial infection vector for six consecutive years (32%, M-Trends 2026). 28.96% of 2025 KEVs were exploited on or before CVE publication day (VulnCheck 2026). Shadowserver saw ~150,000 FortiOS devices vulnerable to CVE-2024-21762 a month after disclosure.
