@Library('shared_library') _

pipeline {
    agent {
        label 'development'
    }

    environment {
        TAG                   = "latest"
        DOCKER_IMAGE_NAME     = "myntraa"
        DOCKERHUB_CREDENTIALS = "dockerHubCreds"
        SONAR_TOKEN           = "sonarqube"
        SONAR_INSTALLATION    = "sonarqube"
        OWASP_INSTALLATION    = "owasp"
        EMAIL                 = "vivekjhariya241@gmail.com"
    }

    stages {

        // 1. Install Java
        stage('Install Java') {
            steps {
                script {
                    jenkinsPluginsInstallation()
                }
            }
        }

        // 2. Install Docker
        stage('Install Docker') {
            steps {
                script {
                    dockerInstall()
                }
            }
        }

        // 3. Install / Start SonarQube
        stage('SonarQube Installation') {
            steps {
                script {
                    sonarQubeInstallation()
                }
            }
        }

        // 4. Install Trivy
        stage('Trivy Installation') {
            steps {
                script {
                    trivyInstallation()
                }
            }
        }

        // 5. Clone Project Repository
        stage('Git Clone') {
            steps {
                gitClone(
                    url: 'https://github.com/vivekjhariya/myntraa.git',   
                    branch: 'main'
                )
            }
        }

        // 6. Trivy File System Scan
        stage('Trivy FS Scan') {
            steps {
                trivyFileSystemScan(
                    path: '.',
                    severity: 'CRITICAL,HIGH',
                    exitCode: 1
                )
            }
        }

        // 7. OWASP Dependency Check
        stage('OWASP Dependency Check') {
            steps {
                owaspDependencyScan(
                    odcInstallation: "${OWASP_INSTALLATION}",
                    failOnCVSS: 7,
                    scanPath: '.',
                    nvdApiKeyId: 'nvd-api-key'
                    
                )
            }
        }

        // 8. SonarQube Analysis
        stage('SonarQube Analysis') {
            steps {
                sonarQubeQualityAnalysis(
                    sonarQubeTokenName: "${SONAR_TOKEN}",
                    sonarQubeProjectKey: 'myntraa',
                    sonarQubeProjectName: 'Myntraa Project',
                    sonarQubeInstallationName: "${SONAR_INSTALLATION}",
                    extraProperties: '-Dsonar.sources=src -Dsonar.exclusions=**/*.spec.ts,**/*.test.ts'
                )
            }
        }

        // 9. SonarQube Quality Gate
        stage('SonarQube Quality Gate') {
            steps {
                sonarQubeQualityGate(
                    timeout: 5,
                    abortPipeline: true
                )
            }
        }

        // 10. Docker Build
        stage('Docker Build') {
            steps {
                script {
                    dockerBuild(
                        imageName: "${DOCKER_IMAGE_NAME}"
                    )
                }
            }
        }

        // 11. Trivy Image Scan
        stage('Trivy Image Scan') {
            steps {
                trivyImageScan(
                    image: "${env.IMAGE_TAG}",          // dockerBuild se set hota hai
                    severity: 'CRITICAL,HIGH',
                    exitCode: 1
                )
            }
        }

        // 12. Push Image to DockerHub
        stage('Docker Push') {
            steps {
                dockerPush(
                    credentialsId: "${DOCKERHUB_CREDENTIALS}",
                    imageName: "${DOCKER_IMAGE_NAME}",
                    pushLatest: true
                )
            }
        }
        // 13. adding the credentials for mysql database enviroment
        stage('Prepare Env File') {
           steps {
              mysqlCredentials(
                 jwtCredId: 'jwt-secret',
                 rootPassCredId: 'mysql-root-password',
                 userPassCredId: 'mysql-password',
                 dbName: 'myntraa_db',
                dbUser: 'myntraa',
                appPort: '3001',
               envFile: '.env'
            )
        }
     }
      // 14. Deploy using Docker Compose
        stage('Deploy') {
            steps {
                dockerDeploy(
                    composeFile: 'docker-compose.yml',
                    envFile: '.env',
                    pullImage: true
                )
            }
        }

        // 15. Cleanup Old Images
        stage('Docker Cleanup') {
            steps {
                dockerCleanup(
                    imageName: "${DOCKER_IMAGE_NAME}",
                    keepImages: 3
                )
            }
        }
    }

    // 16. Email Notification
    post {
        success {
            emailNotify("SUCCESS", "${EMAIL}")
        }
        failure {
            emailNotify("FAILED", "${EMAIL}")
        }
        unstable {
            emailNotify("UNSTABLE", "${EMAIL}")
        }
    }
}
