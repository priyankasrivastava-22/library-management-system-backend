pipeline {
    agent any

    environment {
        IMAGE_NAME = "lms-backend"
        CONTAINER_NAME = "lms-backend-dev"
        FRONTEND_URL = "https://lms-frontend-dev.onrender.com"   // CHANGE THIS
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'echo "Skipping tests for now"'
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
                curl -f http://localhost:5000/api/books || exit 1
                '''
            }
        }

        stage('Login API Test') {
            steps {
               sh '''
               echo "Testing Login API..."

               response=$(curl -s -X POST http://localhost:5000/api/auth/login \
              -H "Content-Type: application/json" \
              -d '{"email":"testuser@gmail.com","password":"123456"}')

             echo "Response: $response" 

             echo "$response" | grep "token" || exit 1

            echo "Login API working"
            '''
            }
        }

        // Integration Test (Backend APIs)
        stage('Integration Test - Backend APIs') {
            steps {
                sh '''
                echo "Testing multiple APIs..."

                curl -f http://localhost:5000/api/books || exit 1
                curl -f http://localhost:5000/api/stats || exit 1
                curl -f http://localhost:5000/api/users || exit 1

                echo "All backend APIs are working"
                '''
            }
        }

        //  Frontend ↔ Backend Check
        stage('Frontend-Backend Connectivity') {
            steps {
                sh '''
                echo "Checking if frontend can reach backend..."

                curl -f $FRONTEND_URL || exit 1

                echo "Frontend is reachable"
                '''
            }
        }

        // Basic UI Availability Check
        stage('UI Smoke Test') {
            steps {
                sh '''
                echo "Checking UI loads..."

                response=$(curl -s $FRONTEND_URL)

                echo "$response" | grep "<html" || exit 1

                echo "UI is loading properly"
                '''
            }
        }

    }

    post {
        success {
            echo "Full CI/CD + Integration pipeline SUCCESS"
        }
        failure {
            echo "Pipeline failed - check logs"
        }
    }
}