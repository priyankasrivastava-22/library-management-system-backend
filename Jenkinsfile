pipeline {
    agent any

    environment {
        IMAGE_NAME = "lms-backend"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Verify Image') {
            steps {
                sh 'docker images'
            }
        }

    }

    post {
        success {
            echo "Backend build pipeline completed successfully"
        }
        failure {
            echo "Build failed"
        }
    }
}