// Fig. 2-5: the route as MITRE ATT&CK techniques, with the telemetry that
// shows each one. Conceptual only: log names and event IDs, no commands.

import type { Lang } from "./paths";

export interface EventRef {
  id: string;
  /** "security": a Windows Security log event with a Microsoft reference page. */
  kind: "security" | "other";
  log: Record<Lang, string>;
}

export interface AttackRow {
  step: number;
  techniques: { id: string; name: string }[];
  telemetry: Record<Lang, string>;
  events: EventRef[];
}

const sec = (id: string): EventRef => ({ id, kind: "security", log: { en: "Security", ja: "Security" } });
const other = (id: string, en: string, ja: string): EventRef => ({ id, kind: "other", log: { en, ja } });

export const ATTACK_ROWS: AttackRow[] = [
  {
    step: 2,
    techniques: [{ id: "T1190", name: "Exploit Public-Facing Application" }],
    telemetry: {
      en: "Often no login record at all, because the flaw is reached before authentication. Look for VPN process crashes and restarts, files on the appliance that should not be there, and configuration changes nobody made. Compare with the vendor's external integrity check.",
      ja: "認証より前の欠陥を突かれるので、ログイン記録が残らないことが多い。VPN のプロセスの異常終了と再起動、機器上にあるはずのないファイル、誰も行っていない設定変更を探し、ベンダーの外部整合性検査の結果と突き合わせる。",
    },
    events: [],
  },
  {
    step: 2,
    techniques: [{ id: "T1133", name: "External Remote Services" }],
    telemetry: {
      en: "The VPN appliance authentication log: user, source address, assigned internal address, session start and end. Flag logins outside the user's usual hours, from countries or hosting providers the user never uses, and from devices seen for the first time. Send this log off the appliance; both hospitals lost theirs.",
      ja: "VPN 機器の認証ログ。ユーザー、接続元アドレス、割り当てた社内アドレス、セッションの開始と終了が残る。普段と違う時間帯、本人が使うはずのない国やホスティング事業者からの接続、初めて見る端末からの接続を検知対象にする。このログは機器の外へ転送しておく。両病院とも失っている。",
    },
    events: [],
  },
  {
    step: 2,
    techniques: [{ id: "T1078", name: "Valid Accounts" }],
    telemetry: {
      en: "On internal hosts, successful logons whose source is the VPN address pool, by accounts that are dormant, belong to a contractor, or have never used the VPN. A run of failed logons before the first success.",
      ja: "社内の機器で、VPN のアドレス帯からのログオン成功を見る。休眠アカウント、業者のアカウント、VPN を使ったことのないアカウントであれば要注意。最初の成功の前に失敗が続いていることもある。",
    },
    events: [sec("4624"), sec("4625")],
  },
  {
    step: 2,
    techniques: [{ id: "T1552.001", name: "Unsecured Credentials: Credentials In Files" }],
    telemetry: {
      en: "Not visible from Windows. This flaw class reads files on the appliance that hold credentials; CVE-2018-13379 did this at both hospitals. The sign comes later: logins with accounts whose passwords existed only on the appliance, such as local VPN users or the directory bind account.",
      ja: "Windows 側からは見えない。この種の欠陥は、認証情報を保存した機器上のファイルを読み出す。両病院の CVE-2018-13379 がこれにあたる。兆候は後から出る。VPN のローカルユーザーやディレクトリ連携用アカウントなど、パスワードが機器の中にしかないアカウントでのログインである。",
    },
    events: [],
  },
  {
    step: 2,
    techniques: [{ id: "T1539", name: "Steal Web Session Cookie" }],
    telemetry: {
      en: "A VPN session used from a second source address without a new authentication event, or one user holding two concurrent sessions from different places.",
      ja: "新たな認証の記録がないまま、VPN セッションが別の接続元から使われる。あるいは同じユーザーが別々の場所から同時に二つのセッションを持つ。",
    },
    events: [],
  },
  {
    step: 3,
    techniques: [{ id: "T1087.002", name: "Account Discovery: Domain Account" }],
    telemetry: {
      en: "One host querying every user and group in the directory within minutes. Domain controllers do not log ordinary directory reads by default; EDR or directory query logging shows it. On member servers, group membership enumeration is logged.",
      ja: "1台の機器が数分のうちにディレクトリの全ユーザーと全グループを照会する。ドメインコントローラは通常のディレクトリ照会を既定では記録しないので、EDR かディレクトリ照会の記録で見る。メンバーサーバではグループメンバーの列挙が記録される。",
    },
    events: [sec("4798"), sec("4799")],
  },
  {
    step: 4,
    techniques: [{ id: "T1003", name: "OS Credential Dumping" }],
    telemetry: {
      en: "EDR alerts on access to LSASS memory (Sysmon event 10, if Sysmon is deployed). On a domain controller, a copy of the directory database taken through a shadow copy. Both hospital reports name Mimikatz.",
      ja: "LSASS のメモリへのアクセスに対する EDR の警告（Sysmon を入れていればイベント10）。ドメインコントローラでは、シャドウコピー経由でディレクトリのデータベースが複製される。両病院の報告書とも Mimikatz の使用を挙げている。",
    },
    events: [other("10", "Sysmon", "Sysmon")],
  },
  {
    step: 4,
    techniques: [
      { id: "T1078.002", name: "Valid Accounts: Domain Accounts" },
      { id: "T1136.002", name: "Create Account: Domain Account" },
    ],
    telemetry: {
      en: "A new account (4720), an account added to a security-enabled global group such as Domain Admins (4728) or to a local Administrators group (4732), and special privileges assigned to a logon that does not normally get them (4672).",
      ja: "新しいアカウントの作成（4720）、Domain Admins などのセキュリティ グローバル グループへの追加（4728）、ローカルの Administrators への追加（4732）、普段は特権を持たないログオンへの特権の割り当て（4672）。",
    },
    events: [sec("4720"), sec("4728"), sec("4732"), sec("4672")],
  },
  {
    step: 4,
    techniques: [
      { id: "T1021.001", name: "Remote Services: Remote Desktop Protocol" },
      { id: "T1021.002", name: "Remote Services: SMB/Windows Admin Shares" },
    ],
    telemetry: {
      en: "Logon type 10 (remote interactive) on hosts that are never used that way; firewall flows to the remote desktop port from one host to many. Access to administrative shares from a workstation, and a new service in the System log when a remote-execution tool such as PsExec runs. The Osaka intruder tried remote desktop to about 70 addresses from one server.",
      ja: "普段使われない機器でのログオンタイプ10（リモート対話型）。1台から多数の機器のリモートデスクトップのポートへ向かう通信。端末からの管理共有へのアクセスと、PsExec などの遠隔実行ツールが動いたときに System ログに残るサービスの登録。大阪の事例では、1台のサーバから約70のアドレスへリモートデスクトップ接続が試みられた。",
    },
    events: [sec("4624"), sec("5140"), sec("5145"), other("7045", "System", "System")],
  },
  {
    step: 4,
    techniques: [{ id: "T1562.001", name: "Impair Defenses: Disable or Modify Tools" }],
    telemetry: {
      en: "Microsoft Defender events 5001 (real-time protection off) and 5007 (settings changed), Windows Installer event 11724 when a security product is removed, and an EDR agent that stops reporting. Clearing the Security log itself leaves event 1102 (T1070.001). The Osaka intruder uninstalled antivirus on the first hospital server.",
      ja: "Microsoft Defender のイベント5001（リアルタイム保護の無効化）と5007（設定変更）、セキュリティ製品の削除時に残る Windows Installer のイベント11724、報告が途絶えた EDR エージェント。Security ログ自体を消すとイベント1102が残る（T1070.001）。大阪の事例では、最初に入られた病院のサーバでウイルス対策ソフトがアンインストールされた。",
    },
    events: [
      other("5001", "Defender", "Defender"),
      other("5007", "Defender", "Defender"),
      other("11724", "Application", "Application"),
      sec("1102"),
    ],
  },
  {
    step: 5,
    techniques: [{ id: "T1490", name: "Inhibit System Recovery" }],
    telemetry: {
      en: "Shadow copies disappear from servers. With process-creation auditing that records the command line (4688), or Sysmon event 1, the deletion is logged together with the account that ran it. The backup software's own audit log shows console logins at night, deleted jobs and shortened retention.",
      ja: "サーバからシャドウコピーが消える。コマンドラインを含めたプロセス作成の監査（4688）か Sysmon のイベント1を有効にしていれば、削除の操作と実行したアカウントが記録される。バックアップソフト自身の監査ログには、夜間の管理画面へのログイン、ジョブの削除、保存期間の短縮が残る。",
    },
    events: [sec("4688"), other("1", "Sysmon", "Sysmon")],
  },
  {
    step: 6,
    techniques: [
      { id: "T1048", name: "Exfiltration Over Alternative Protocol" },
      { id: "T1567", name: "Exfiltration Over Web Service" },
    ],
    telemetry: {
      en: "Outbound volume per host far above its baseline, to cloud storage or file-transfer services. Archive tools running on servers (T1560.001). On the file server, one account reading thousands of files, visible with object-access or detailed share auditing. Osaka could not tell what a 7.9 MB SMB transfer contained because detailed logging was off.",
      ja: "機器ごとの外向き通信量が平常を大きく超え、クラウドストレージやファイル転送サービスへ向かう。サーバ上で圧縮ツールが動く（T1560.001）。ファイルサーバでは、1つのアカウントが数千のファイルを読む。オブジェクトアクセスか共有の詳細監査を有効にしていれば見える。大阪の事例では詳細なログ設定がなく、SMB で送られた 7.9MB の中身を特定できなかった。",
    },
    events: [sec("4663"), sec("5145")],
  },
  {
    step: 7,
    techniques: [{ id: "T1486", name: "Data Encrypted for Impact" }],
    telemetry: {
      en: "Thousands of file writes and renames per minute on file servers, a new file extension on everything (.elbie in Osaka), ransom notes in every folder or on every printer, and virtual machines shutting down on the hypervisor. By this point the signal is loud, and it is late.",
      ja: "ファイルサーバで毎分数千件の書き込みと名前の変更が起き、すべてのファイルに新しい拡張子が付く（大阪の事例では .elbie）。各フォルダやプリンターに身代金要求文書が出て、ハイパーバイザ上の仮想マシンが止まる。ここまで来ると兆候ははっきりしているが、もう遅い。",
    },
    events: [],
  },
];

export function attackUrl(id: string): string {
  const m = /^T(\d{4})(?:\.(\d{3}))?$/.exec(id);
  if (!m) throw new Error(`not an ATT&CK technique id: ${id}`);
  return m[2]
    ? `https://attack.mitre.org/techniques/T${m[1]}/${m[2]}/`
    : `https://attack.mitre.org/techniques/T${m[1]}/`;
}

const MS_AUDIT =
  "https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing";

export function eventUrl(e: EventRef): string | null {
  return e.kind === "security" ? `${MS_AUDIT}/event-${e.id}` : null;
}
