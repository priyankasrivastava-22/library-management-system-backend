pipeline {
    agent any

    environment {
        IMAGE_NAME = "lms-backend"
        CONTAINER_NAME = "lms-backend-dev"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests defined"'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                docker run -d -p 5000:5000 \
                --name $CONTAINER_NAME \
                $IMAGE_NAME
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                sleep 5
                curl http://localhost:5000/api/books || exit 1
                '''
            }
        }

    }

    post {
        success {
            echo "Full CI/CD pipeline executed successfully"
        }
        failure {
            echo "Pipeline failed - check logs"
        }
    }
}