'use client';
// 마무리 묶음의 플레이그라운드 · 코드 미리보기 — 스펙대로 그린 컨트롤(finish-view — 각 YAML)을 실제로 눌러 보고, 고른 값에 맞춰 코드가 바뀐다.
// 코드는 각 스펙 md 의 "코드" 절과 같은 API 다. 칸 이름 · 설명 · 오류는 Field(field.yaml — text-field-view)가 둘레에서 그린다.
// 예시 이름 · 값은 지어낸 것이다(회사 · 가게 이름을 쓰지 않는다).
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BRANDS, MODES, PlayFrame, Seg } from './select-playground';
import type { TfFieldLook } from './text-field-shared';
import { TfFieldView } from './text-field-view';
import { ButtonView } from './button-view';
import type { ButtonLook } from './button-look';
import { FONT, FT_HOME, FT_PLACEHOLDER, HR_ROLES, HR_ROLES_SAVED, QP_PRESETS, icv, type AvEditLook, type FtLook, type QpLook, type QpPreset, type QpSizeProp, type ViewMode } from './finish-shared';
export { QP_PRESETS, type QpPreset };
import { AvatarEditView, Fit, FooterView, QpView, type FtBlocks } from './finish-view';
import { SelectBoxGroupView } from './select-box-view';
import { DialogSurface } from './overlay-view';
import type { DialogLook } from './overlay-shared';
import type { SbLook } from './select-box-shared';
import type { AvatarLook } from './display-shared';

type Brand = 'desk' | 'hr';

// ── 공용 ──────────────────────────────────────────────────
// 화면 읽기에 들린 글 · 요청 기록 — 마지막 것이 위
export function Readout({ items, empty }: { items: string[]; empty: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[44px] flex-col items-center gap-0.5 text-center text-[12px] leading-5 text-fd-muted-foreground">
      {items.length ? items.map((t, i) => <span key={`${i}${t}`} className={i === 0 ? 'font-semibold text-fd-foreground' : undefined}>{t}</span>) : <span>{empty}</span>}
    </div>
  );
}
// 코드 미리보기 판 — 흰 면 위에 그린다(코드는 md 의 코드 블록이 아래에 있다)
export function DemoFrame({ children, w = 420, bg, caption }: { children: ReactNode; w?: number; bg: string; caption?: string }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto flex w-full flex-col gap-4 rounded-xl p-6" style={{ maxWidth: w, background: bg, fontFamily: FONT }}>
          {children}
        </div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}

// ── Quantity Picker ───────────────────────────────────────
// Field + Quantity Picker — 라벨은 묶음 이름(span id), 컨트롤 묶음(role=group)이 aria-labelledby 로 가리킨다
export function QpField({
  look,
  field,
  mode = 'auto',
  preset,
  value,
  onValueChange,
  size,
  layout,
  invalid = false,
  disabled = false,
  readOnly = false,
  indicator,
  description = true,
  frozen,
  states,
  loading,
  removable,
  removeLabel,
  onRemove,
  showHit,
  width,
}: {
  look: QpLook;
  field: TfFieldLook;
  mode?: ViewMode;
  preset: QpPreset;
  value?: number;
  onValueChange?: (v: number) => void;
  size?: QpSizeProp;
  layout?: 'hug' | 'fill';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  indicator?: 'required' | 'optional';
  description?: boolean;
  frozen?: boolean;
  states?: Parameters<typeof QpView>[0]['states'];
  loading?: 'decrement' | 'increment' | 'both';
  removable?: boolean;
  removeLabel?: string;
  onRemove?: () => void;
  showHit?: boolean;
  width?: number | string;
}) {
  return (
    <TfFieldView look={field} mode={mode} group label={preset.label} indicator={indicator} description={description ? preset.description : undefined} invalid={invalid} errorMessage={preset.error} width={width}>
      {(ctl) => (
        <QpView
          look={look}
          mode={mode}
          size={size}
          layout={layout}
          value={value ?? preset.value}
          onValueChange={onValueChange}
          min={preset.min}
          max={preset.max}
          unit={preset.unit}
          labelledBy={ctl.labelId}
          describedBy={ctl.describedBy}
          invalid={ctl.invalid}
          disabled={disabled}
          readOnly={readOnly}
          name={preset.name}
          frozen={frozen}
          states={states}
          loading={loading}
          removable={removable}
          removeLabel={removeLabel}
          onRemove={onRemove}
          showHit={showHit}
        />
      )}
    </TfFieldView>
  );
}

const QP_SIZE_OPTS = [
  ['responsive', '반응형(기본)'],
  ['large', 'large 52'],
  ['medium', 'medium 40'],
  ['small', 'small 36'],
] as const;
export function QpPlayground({ looks, fields }: { looks: Record<Brand, QpLook>; fields: Record<Brand, TfFieldLook> }) {
  const [size, setSize] = useState<QpSizeProp>('responsive');
  const [layout, setLayout] = useState<'hug' | 'fill'>('hug');
  const [range, setRange] = useState<'approvals' | 'maxGrant' | 'hours' | 'count'>('approvals');
  const [start, setStart] = useState<'min' | 'mid' | 'max'>('mid');
  const [removable, setRemovable] = useState<'no' | 'yes'>('no');
  const [loading, setLoading] = useState<'none' | 'decrement' | 'increment'>('none');
  const [invalid, setInvalid] = useState<'no' | 'yes'>('no');
  const [disabled, setDisabled] = useState<'no' | 'yes'>('no');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('hr');
  const p = QP_PRESETS[range];
  const startValue = start === 'min' ? p.min : start === 'max' ? p.max : Math.min(p.max, p.min + 2);
  const [value, setValue] = useState(startValue);
  const [heard, setHeard] = useState<string[]>([]);
  const [removed, setRemoved] = useState(false);
  useEffect(() => {
    setValue(startValue);
    setHeard([]);
    setRemoved(false);
  }, [startValue, range]);
  const look = looks[brand];
  const change = (v: number) => {
    setValue(v);
    setHeard((h) => [`"${v}${p.unit}"`, ...h].slice(0, 3));
  };
  const rm = removable === 'yes';
  const code = useMemo(() => {
    const attrs = [
      ...(size !== 'responsive' ? [`size="${size}"`] : []),
      ...(layout === 'fill' ? ['layout="fill"'] : []),
      `min={${p.min}}`,
      `max={${p.max}}`,
      'value={value}',
      'onValueChange={setValue}',
      ...(p.unit ? [`getValueText={(v) => \`\${v}${p.unit}\`}`] : []),
      ...(loading !== 'none' ? [`loading={{ ${loading}: true }}`] : []),
      ...(rm ? ['removable', 'onRemove={removeItem}', 'removeAriaLabel="점심 도시락 지우기"'] : []),
      ...(p.name ? [`name="${p.name}"`] : []),
    ];
    const field = [`label="${p.label}"`, ...(p.description ? [`description="${p.description}"`] : []), ...(invalid === 'yes' ? ['invalid', `errorMessage="${p.error ?? '범위를 벗어났어요.'}"`] : []), ...(disabled === 'yes' ? ['disabled'] : [])];
    return [
      'import { Field } from "@/components/ui/field"',
      'import { QuantityPicker } from "@/components/ui/quantity-picker"',
      '',
      `<Field ${field.join(' ')}>`,
      '  <QuantityPicker',
      ...attrs.map((a) => `    ${a}`),
      '  />',
      '</Field>',
    ].join('\n');
  }, [size, layout, p, loading, rm, invalid, disabled]);
  const stage = (
    <div className="flex flex-col gap-4" style={{ fontFamily: FONT }}>
      {removed ? (
        <div className="flex flex-col items-center gap-2 text-center text-[13px] text-fd-muted-foreground">
          <span>onRemove — 항목을 지웠어요(값은 그대로 {value}).</span>
          <button type="button" className="rounded-md border border-fd-border px-2 py-1 text-[12px]" onClick={() => setRemoved(false)}>
            되돌리기
          </button>
        </div>
      ) : (
        <QpField
          key={`${range}${brand}`}
          look={look}
          field={fields[brand]}
          mode={mode}
          preset={{ ...p, error: p.error ?? '범위를 벗어났어요.' }}
          value={value}
          onValueChange={change}
          size={size}
          layout={layout}
          invalid={invalid === 'yes'}
          disabled={disabled === 'yes'}
          loading={loading === 'none' ? undefined : loading}
          removable={rm}
          removeLabel="점심 도시락 지우기"
          onRemove={() => setRemoved(true)}
        />
      )}
      <Readout items={heard} empty="− · + 를 눌러 보세요 — 바뀐 값을 단위와 함께 한 번 읽어요." />
    </div>
  );
  return (
      <PlayFrame
        surface={icv(look.surface.default, mode)}
        code={code}
        stage={stage}
        controls={
          <>
            <Seg label="크기 size" value={size} options={QP_SIZE_OPTS} onChange={setSize} />
            <Seg
              label="폭 layout"
              value={layout}
              options={[
                ['hug', 'hug — 가장 긴 값의 폭'],
                ['fill', 'fill — 남은 폭'],
              ]}
              onChange={setLayout}
            />
            <Seg
              label="범위 · 단위"
              value={range}
              options={[
                ['approvals', '0 ~ 3 회'],
                ['maxGrant', '1 ~ 99 회'],
                ['hours', '0 ~ 24 h'],
                ['count', '1 ~ 9 개'],
              ]}
              onChange={setRange}
            />
            <Seg
              label="시작 값(끝)"
              value={start}
              options={[
                ['min', '최소'],
                ['mid', '범위 안'],
                ['max', '최대'],
              ]}
              onChange={setStart}
            />
            <Seg
              label="지우기 removable"
              value={removable}
              options={[
                ['no', '없음'],
                ['yes', '최소에서 휴지통'],
              ]}
              onChange={setRemovable}
            />
            <Seg
              label="로딩 loading"
              value={loading}
              options={[
                ['none', '없음'],
                ['decrement', '줄이기'],
                ['increment', '늘리기'],
              ]}
              onChange={setLoading}
            />
            <Seg
              label="오류 invalid"
              value={invalid}
              options={[
                ['no', '아니요'],
                ['yes', '오류'],
              ]}
              onChange={setInvalid}
            />
            <Seg
              label="막힘 disabled"
              value={disabled}
              options={[
                ['no', '아니요'],
                ['yes', '막힘'],
              ]}
              onChange={setDisabled}
            />
            <div className="flex flex-wrap gap-5">
              <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
              <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
            </div>
          </>
        }
      />
  );
}

// 폼 — 승인 필요 횟수(0 ~ 고를 수 있는 승인자 수 3)
export function ExQpBasicDemo({ look, field }: { look: QpLook; field: TfFieldLook }) {
  const [approvals, setApprovals] = useState(0);
  const [heard, setHeard] = useState<string[]>([]);
  return (
    <DemoFrame bg={icv(look.surface.default, 'auto')}>
      <QpField
        look={look}
        field={field}
        preset={QP_PRESETS.approvals}
        value={approvals}
        onValueChange={(v) => {
          setApprovals(v);
          setHeard((h) => [`"${v}회"`, ...h].slice(0, 3));
        }}
      />
      <div className="flex flex-col items-center gap-1 border-t border-fd-border pt-3">
        <span className="text-[12px] text-fd-muted-foreground">
          폼에 내는 값 approvalCount = <b className="text-fd-foreground">{approvals}</b>(단위 없는 정수)
        </span>
        <Readout items={heard} empty="0 에서 − 가 막히고, 3 에서 + 가 막혀요 — 초점은 그 버튼에 남아요." />
      </div>
    </DemoFrame>
  );
}

// 표 칸 — HR 업무 보고, 줄 수정 중 소요시간 small 36
export function ExQpTableDemo({ look, saveLook, mode = 'auto' }: { look: QpLook; saveLook: ButtonLook; mode?: ViewMode }) {
  const [hours, setHours] = useState(8);
  const c = (n: string) => `var(--p-${n})`;
  const th: CSSProperties = { paddingLeft: 16, paddingRight: 16, height: 48, textAlign: 'left', fontSize: 14, fontWeight: 500, color: c('fg-neutral-subtle'), whiteSpace: 'nowrap', borderBottom: `1px solid ${c('stroke-neutral-subtle')}` };
  const td: CSSProperties = { paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, verticalAlign: 'middle', whiteSpace: 'nowrap', borderBottom: `1px solid ${c('stroke-neutral-subtle')}`, fontSize: 14, lineHeight: '19px' };
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="overflow-x-auto rounded-xl" style={{ background: icv(look.surface.default, mode), fontFamily: FONT }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 620, color: c('fg-neutral') }}>
            <thead>
              <tr>
                <th style={th}>No</th>
                <th style={th}>일자</th>
                <th style={th}>업무 구분</th>
                <th style={{ ...th, minWidth: 100 }}>소요시간</th>
                <th style={th}>내용</th>
                <th style={{ ...th, position: 'relative' }}>
                  <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>동작</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>11</td>
                <td style={td}>2026-10-14</td>
                <td style={td}>개발</td>
                <td style={{ ...td, fontWeight: 500 }}>6h</td>
                <td style={{ ...td, whiteSpace: 'normal', color: c('fg-neutral-subtle') }}>근태 화면 표 정렬 고침</td>
                <td style={td} />
              </tr>
              <tr style={{ background: c('bg-layer-default-pressed') }}>
                <td style={td}>12</td>
                <td style={td}>2026-10-15</td>
                <td style={td}>개발</td>
                <td style={td}>
                  <QpView look={look} mode={mode} size="small" min={0} max={24} value={hours} onValueChange={setHours} unit="h" ariaLabel="소요시간" />
                </td>
                <td style={{ ...td, whiteSpace: 'normal', minWidth: 180 }}>결재 화면 오류 수정 · 개발 서버 배포 확인</td>
                <td style={td}>
                  <ButtonView look={saveLook} mode={mode} label="저장" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

// 지우기 · 로딩 — 서버에 바로 반영하는 수량. 누른 쪽만 기다리고, 최소(1)에서 줄이기가 휴지통이 된다
export function ExQpServerDemo({ look, mode = 'auto' }: { look: QpLook; mode?: ViewMode }) {
  const itemName = '점심 도시락';
  const [count, setCount] = useState(2);
  const [pending, setPending] = useState<'decrement' | 'increment' | null>(null);
  const [gone, setGone] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const change = (next: number) => {
    const side = next > count ? 'increment' : 'decrement';
    setPending(side);
    setLog((l) => [`요청 — ${itemName} ${next}개`, ...l].slice(0, 3));
    timer.current = window.setTimeout(() => {
      setCount(next);
      setPending(null);
    }, 900);
  };
  const c = (n: string) => `var(--p-${n})`;
  return (
    <DemoFrame bg={icv(look.surface.default, mode)}>
      {gone ? (
        <div className="flex flex-col items-center gap-2 text-center text-[13px] text-fd-muted-foreground">
          <span>onRemove — 지웠어요({itemName}). 초점은 다음 항목(없으면 목록 머리)으로 옮겨요.</span>
          <button type="button" className="rounded-md border border-fd-border px-2 py-1 text-[12px]" onClick={() => (setGone(false), setCount(1))}>
            되돌리기
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3" style={{ minHeight: 56 }}>
          <span className="flex min-w-0 flex-col">
            <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500, color: c('fg-neutral') }}>{itemName}</span>
            <span style={{ fontSize: 13, lineHeight: '18px', color: c('fg-neutral-subtle') }}>6,500원</span>
          </span>
          <QpView
            look={look}
            mode={mode}
            size="medium"
            min={1}
            max={9}
            value={count}
            onValueChange={change}
            unit="개"
            loading={pending ?? undefined}
            removable
            removeLabel={`${itemName} 지우기`}
            onRemove={() => setGone(true)}
            ariaLabel="수량"
          />
        </div>
      )}
      <div className="border-t border-fd-border pt-3">
        <Readout items={log} empty="+ 를 누르면 그 버튼만 원을 보이며 응답을 기다려요 — 다른 쪽은 그대로 눌려요. 1 에서 − 는 휴지통이에요." />
      </div>
    </DemoFrame>
  );
}

// ── 넓은 그림의 플레이그라운드 판 — 무대가 칸 폭 전체(바닥 · 첨부 줄처럼 1280 을 줄여 그리는 그림) ──
export function WidePlayFrame({ surface, stage, controls, code }: { surface: string; stage: ReactNode; controls: ReactNode; code: string }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex min-h-[220px] items-center justify-center px-4 py-8" style={{ background: surface }}>
        <div className="w-full">{stage}</div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────
type FtBlockKey = 'brand' | 'sitemap' | 'divider' | 'policy' | 'text' | 'copyright' | 'business' | 'contact' | 'social';
const FT_BLOCK_OPTS: [FtBlockKey, string][] = [
  ['brand', '브랜드'],
  ['sitemap', '사이트맵'],
  ['divider', '선'],
  ['policy', '정책 링크'],
  ['text', '안내 글'],
  ['business', '사업자 정보(자리)'],
  ['contact', '연락처(자리)'],
  ['copyright', '저작권'],
  ['social', '소셜(자리)'],
];
export function FooterPlayground({ look, year }: { look: FtLook; year: number }) {
  const [on, setOn] = useState<Record<FtBlockKey, boolean>>({ brand: true, sitemap: true, divider: true, policy: true, text: true, copyright: true, business: false, contact: false, social: false });
  const [width, setWidth] = useState<'1280' | '768' | '390'>('1280');
  const [mode, setMode] = useState<ViewMode>('auto');
  const w = Number(width);
  const blocks: FtBlocks = {
    brand: on.brand ? FT_HOME.brand : undefined,
    columns: on.sitemap ? FT_HOME.columns : undefined,
    divider: on.divider && (on.brand || on.sitemap),
    policy: on.policy ? FT_HOME.policy : undefined,
    text: on.text ? FT_HOME.text : undefined,
    business: on.business ? FT_PLACEHOLDER.business : undefined,
    contact: on.contact ? FT_PLACEHOLDER.contact : undefined,
    copyright: on.copyright ? { owner: 'POREST', year } : undefined,
    social: on.social ? 2 : undefined,
  };
  const code = useMemo(() => {
    const L: string[] = [];
    const used = new Set<string>(['Footer']);
    const nav = on.brand || on.sitemap;
    if (nav) {
      used.add('FooterNav');
      L.push('  <FooterNav>');
      if (on.brand) {
        used.add('FooterBrand');
        L.push(`    <FooterBrand name="POREST" description="${FT_HOME.brand.description}" />`);
      }
      if (on.sitemap) {
        used.add('FooterSitemap').add('FooterColumn').add('FooterLink');
        L.push('    <FooterSitemap>');
        for (const c of FT_HOME.columns) {
          L.push(`      <FooterColumn title="${c.title}">`);
          for (const l of c.links) L.push(`        <FooterLink href="${l.href}">${l.label}</FooterLink>`);
          L.push('      </FooterColumn>');
        }
        L.push('    </FooterSitemap>');
      }
      L.push('  </FooterNav>');
    }
    if (blocks.divider) {
      used.add('FooterDivider');
      L.push('  <FooterDivider />');
    }
    const info = on.policy || on.text || on.copyright || on.business || on.contact || on.social;
    if (info) {
      used.add('FooterInfo');
      L.push('  <FooterInfo>');
      if (on.policy) {
        used.add('FooterLinks').add('FooterLink');
        L.push('    <FooterLinks>', '      <FooterLink href="https://sso.porest.cloud/privacy" external>개인정보 처리방침</FooterLink>', '    </FooterLinks>');
      }
      if (on.text) {
        used.add('FooterText');
        L.push(`    <FooterText>${FT_HOME.text[0]}</FooterText>`);
      }
      if (on.business || on.contact) L.push('    {/* 사업자 정보 · 연락처 — 값이 생기면 FooterText 로. 지어내지 않는다 */}');
      if (on.copyright || on.social) {
        used.add('FooterBottom');
        L.push('    <FooterBottom>');
        if (on.copyright) {
          used.add('FooterCopyright');
          L.push('      <FooterCopyright owner="POREST" />');
        }
        if (on.social) L.push('      {/* 소셜 — 값이 생기면 FooterSocial(Button ghost · large · iconOnly + 이름) */}');
        L.push('    </FooterBottom>');
      }
      L.push('  </FooterInfo>');
    }
    const names = [...used].sort();
    return [`import { ${names.join(', ')} } from "@/components/ui/footer"`, '', '<Footer>', ...L, '</Footer>'].join('\n');
  }, [on, blocks.divider]);
  return (
    <WidePlayFrame
      surface={icv(look.surface, mode)}
      code={code}
      stage={
        <div className="mx-auto w-full" style={{ maxWidth: w }}>
          <Fit w={w}>
            <FooterView look={look} mode={mode} width={w} blocks={blocks} />
          </Fit>
          <p className="m-0 pt-2 text-center text-[12px] text-fd-muted-foreground">
            {w}px 로 그렸다{w < 1280 ? ` — 1280 미만: 좌우 ${look.root.padXNarrow}, 소셜은 저작권 아래` : ` — 좌우 ${look.root.padXWide}, 틀 최대 ${look.root.maxW}`}. 링크에 올리고 Tab 으로 옮겨 보세요.
          </p>
        </div>
      }
      controls={
        <>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[12px] font-medium text-fd-muted-foreground">블록(위 → 아래 순서 그대로)</span>
            <div className="flex flex-wrap gap-1">
              {FT_BLOCK_OPTS.map(([k, t]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on[k]}
                  onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))}
                  className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors ${on[k] ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Seg
            label="폭"
            value={width}
            options={[
              ['1280', '1280'],
              ['768', '768'],
              ['390', '390'],
            ]}
            onChange={setWidth}
          />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
    />
  );
}

// ── Select Box — HR 역할: 여럿 고르고 "저장" 한 번(바뀐 것이 없으면 막힘). 폰 · 데스크톱 같은 모양 ──
export function RolesLive({ look, field, save, mode = 'auto' }: { look: SbLook; field: TfFieldLook; save: ButtonLook; mode?: ViewMode }) {
  const [saved, setSaved] = useState<string[]>(HR_ROLES_SAVED);
  const [picked, setPicked] = useState<string[]>(HR_ROLES_SAVED);
  const [done, setDone] = useState('');
  const [epoch, setEpoch] = useState(0);
  const added = picked.filter((c) => !saved.includes(c)).length;
  const removed = saved.filter((c) => !picked.includes(c)).length;
  const dirty = added + removed > 0;
  const c = (n: string) => `var(--p-${n})`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: FONT }}>
      <TfFieldView look={field} mode={mode} group label="역할" description="여럿 고를 수 있어요. 저장을 눌러야 바뀌어요.">
        {(ctl) => (
          <SelectBoxGroupView
            key={epoch}
            look={look}
            mode={mode}
            kind="check"
            boxes={HR_ROLES.map((r) => ({ value: r.code, title: r.name, description: r.description, checked: saved.includes(r.code) }))}
            ariaLabelledby={ctl.labelId}
            onChecksChange={(ch) => {
              const next = Object.keys(ch).filter((k) => ch[k]);
              // 저장 뒤 다시 그린 묶음의 처음 알림은 바뀐 것이 아니다 — 저장 글을 남긴다
              setPicked((cur) => {
                if (cur.length !== next.length || cur.some((c) => !next.includes(c))) setDone('');
                return next;
              });
            }}
          />
        )}
      </TfFieldView>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <span role="status" aria-live="polite" style={{ fontSize: 14, lineHeight: '19px', color: c('fg-neutral-subtle') }}>
          {done || (dirty ? `더함 ${added} · 뺌 ${removed} — 아직 저장 안 됨` : '바뀐 것 없음')}
        </span>
        <ButtonView
          look={save}
          mode={mode}
          label="저장"
          state={dirty ? 'live' : 'disabled'}
          onClick={() => {
            setSaved(picked);
            setEpoch((e) => e + 1);
            setDone('역할을 저장했어요.');
          }}
        />
      </div>
    </div>
  );
}

// ── Avatar — 사진 바꾸기: 고르기 창 · 5MB · 올리는 중(딤 + 값 있는 원) · 실패는 그 자리 오류 글 ──
export function PhotoEditLive({ avatar, edit, field, name, photo, mode = 'auto', dialog, footer, children }: { avatar: AvatarLook; edit: AvEditLook; field: TfFieldLook; name: string; photo?: number; mode?: ViewMode; dialog?: DialogLook; footer?: ReactNode; children?: ReactNode }) {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [has, setHas] = useState(photo !== undefined);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [fail, setFail] = useState<'ok' | 'fail'>('ok');
  const ref = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const url = useRef<string | undefined>(undefined);
  useEffect(
    () => () => {
      window.clearInterval(timer.current);
      if (url.current) URL.revokeObjectURL(url.current);
    },
    [],
  );
  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('사진 파일만 올릴 수 있어요.');
    if (file.size > 5 * 1024 * 1024) return setError('5MB 넘는 사진은 올릴 수 없어요.');
    setError(null);
    let p = 0;
    setProgress(0);
    const willFail = fail === 'fail';
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      p = Math.min(1, p + 0.1);
      if (willFail && p >= 0.5) {
        window.clearInterval(timer.current);
        setProgress(undefined);
        setError('사진을 올리지 못했어요. 다시 해주세요.');
        return;
      }
      setProgress(p);
      if (p >= 1) {
        window.clearInterval(timer.current);
        if (url.current) URL.revokeObjectURL(url.current);
        url.current = URL.createObjectURL(file);
        setSrc(url.current);
        setHas(true);
        setProgress(undefined);
      }
    }, 150);
  };
  const e = field.error;
  const editor = (
    <AvatarEditView
      avatar={avatar}
      edit={edit}
      mode={mode}
      name={name}
      photo={has && !src ? photo : undefined}
      src={has ? src : undefined}
      progress={progress}
      error={error ?? undefined}
      errorStyle={{ color: icv(e.color, mode), text: { fontFamily: e.text.fontFamily, fontSize: e.text.fontSize, lineHeight: e.text.lineHeight, fontWeight: e.text.fontWeight }, icon: e.icon, iconGap: e.iconGap }}
      onChange={() => ref.current?.click()}
      onRemove={() => {
        setHas(false);
        setSrc(undefined);
        setError(null);
      }}
    />
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      {dialog ? (
        <DialogSurface look={dialog} mode={mode} title="사용자 수정" width="100%" footer={footer} style={{ maxWidth: dialog.sizes.medium }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {editor}
            {children}
          </div>
        </DialogSurface>
      ) : (
        editor
      )}
      <input ref={ref} type="file" accept="image/*" hidden onChange={(ev) => (pick(ev.target.files?.[0]), (ev.target.value = ''))} />
      <Seg
        label="다음 올리기"
        value={fail}
        options={[
          ['ok', '성공'],
          ['fail', '실패 — 오류 글'],
        ]}
        onChange={setFail}
      />
    </div>
  );
}
