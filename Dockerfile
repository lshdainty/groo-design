# 문서 사이트(site/) 정적 빌드. site 가 빌드 때 ../DESIGN*.md · ../specs 를 읽으므로
# 빌드 컨텍스트는 레포 루트다.
FROM node:22.23.2-alpine AS builder

WORKDIR /repo
COPY site/package.json site/package-lock.json ./site/
RUN cd site && npm ci

COPY . .
RUN cd site && npm run build

# 실행 단계 — 비루트(uid 101) nginx. 엣지 nginx 의 프록시 대상은 :8080 이다.
# nginx 는 안정판(짝수) 최신 패치로 고정한다. 올릴 때는 nginx.org 보안 권고(security_advisories)와
# 대조한다 — 1.30.6 은 2026-11 기준 공개 권고 전부에서 '취약하지 않음'(보안 점검 INF-3).
FROM nginxinc/nginx-unprivileged:1.30.6-alpine AS runtime

COPY site/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/site/out /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
