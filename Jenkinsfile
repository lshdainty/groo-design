// 디자인 시스템 문서 사이트(design.hangroo.io). 환경이 하나라 main 을 곧장 배포한다.
pipeline {
    agent any
    environment {
        REPO_URL = "https://github.com/lshdainty/groo-design.git"
        IMAGE_NAME = "groo-design"
        SRC_DIR = "${env.POREST_BASE_DIR}/src/design"
        CONTAINER_NAME = "design-prod"
    }
    stages {
        stage('Checkout') {
            steps {
                dir("${SRC_DIR}") {
                    checkout([$class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[url: "${REPO_URL}", credentialsId: 'github-credentials']]
                    ])
                }
            }
        }
        stage('Resolve Version') {
            steps {
                dir("${SRC_DIR}") {
                    script {
                        env.APP_VERSION = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                        echo "APP_VERSION = ${env.APP_VERSION}"
                    }
                }
            }
        }
        stage('Docker Build') {
            steps {
                dir("${SRC_DIR}") {
                    sh "docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${env.APP_VERSION} ."
                }
            }
        }
        stage('Deploy') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    # 메모리 한도 — 정적 파일만 내주는 컨테이너라 64MB 면 넉넉하다(실측 10~20MB).
                    # 한도가 없으면 한 컨테이너의 폭주가 같은 서버의 DB 까지 내린다(보안 점검 INF-5).
                    docker run -d --name ${CONTAINER_NAME} \
                        --hostname ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        --memory=64m --memory-swap=64m \
                        --network ${env.PROD_NETWORK} \
                        ${IMAGE_NAME}:${env.APP_VERSION}

                    # 헬스 게이트 — HEALTHCHECK 가 healthy 가 될 때까지 대기, 못 뜨면 배포 실패
                    st=starting
                    for i in \$(seq 1 30); do
                        st=\$(docker inspect -f '{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null || echo none)
                        [ "\$st" = healthy ] && break
                        [ "\$st" = unhealthy ] && break
                        sleep 2
                    done
                    if [ "\$st" != healthy ]; then
                        echo "헬스 게이트 실패: 상태=\$st"
                        docker logs --tail 40 ${CONTAINER_NAME} || true
                        exit 1
                    fi
                """
            }
        }
    }
}
