import { Bank, CheckCircle, WarningCircle } from "@phosphor-icons/react/ssr";
import { depositAccounts } from "@/lib/site-data";

type DepositAccountGuideProps = {
  compact?: boolean;
  headingLevel?: "h2" | "h3";
  layout?: "stacked" | "horizontal";
  wideFirstAccount?: boolean;
};

export function DepositAccountGuide({ compact = false, headingLevel = "h2", layout = "stacked", wideFirstAccount = false }: DepositAccountGuideProps) {
  const HeadingTag = headingLevel;
  const isHorizontal = layout === "horizontal";
  const accountGridColumns = wideFirstAccount ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" : "lg:grid-cols-2";

  return (
    <section className={`border border-lake/16 bg-white ${compact ? "p-5 sm:p-6" : "p-6 shadow-[0_18px_34px_-26px_rgba(75,85,99,0.62)] sm:p-8"}`}>
      <div className={isHorizontal ? "grid gap-5 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] lg:items-start" : undefined}>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-sun/24 bg-sun/12 text-sun">
            <Bank aria-hidden="true" className="h-5 w-5" weight="bold" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase text-sun">Deposit account</p>
            <HeadingTag className={`${compact ? "mt-1 text-lg" : "mt-2 text-2xl"} font-bold leading-tight`}>이용 종목에 맞는 계좌로 입금해 주세요</HeadingTag>
            <p className={`${compact ? "mt-2 text-xs" : "mt-3 text-sm"} leading-6 text-ink-muted`}>수상레저와 ATV 계좌가 다릅니다. 예약글을 남기기 전에 선택한 종목을 기준으로 확인해 주세요.</p>
          </div>
        </div>

        <div className={`grid gap-3 ${isHorizontal ? "" : "mt-5"} ${compact ? "" : accountGridColumns}`}>
          {depositAccounts.map((account) => {
            const isAtv = account.key === "atv";

            return (
              <article key={account.key} className={`grid h-full grid-rows-[auto_1fr_auto] border px-4 py-4 ${isAtv ? "border-sun/35 bg-sun/10" : "border-lake/18 bg-foam"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-foreground">{account.title}</h3>
                  <span className={`text-xs font-bold ${isAtv ? "text-sunset" : "text-lake"}`}>{account.target}</span>
                </div>
                <p className="mt-2 flex gap-2 text-xs leading-6 text-ink-muted">
                  <CheckCircle aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${isAtv ? "text-sun" : "text-lake"}`} weight="bold" />
                  <span>{account.guidance}</span>
                </p>
                <dl className="mt-4 grid border-t border-foreground/10 pt-2 text-sm">
                  <div className="grid min-h-10 grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 border-b border-foreground/10 py-2">
                    <dt className="font-bold text-foreground/58">예금주</dt>
                    <dd className="font-extrabold text-foreground">{account.owner}</dd>
                  </div>
                  <div className="grid min-h-10 grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 border-b border-foreground/10 py-2">
                    <dt className="font-bold text-foreground/58">은행</dt>
                    <dd className="font-extrabold text-foreground">{account.bank}</dd>
                  </div>
                  <div className="grid min-h-10 grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 py-2">
                    <dt className="font-bold text-foreground/58">계좌번호</dt>
                    <dd className={`numeric break-all pr-2 font-extrabold text-foreground sm:break-normal sm:pr-3 sm:whitespace-nowrap ${isAtv ? "text-sm lg:pr-4" : "text-base"}`}>{account.accountNumber}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </div>

      <p className="mt-4 flex gap-2 border border-sunset/20 bg-sun/8 px-3 py-3 text-xs font-bold leading-6 text-foreground">
        <WarningCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sunset" weight="bold" />
        다른 계좌로 입금하면 예약 확인이 늦어질 수 있습니다. 입금자명은 예약글의 입금자명과 같게 남겨 주세요.
      </p>
    </section>
  );
}
