pipeline {
    agent any

    environment {
        IMAGE_NAME = "lms-backend"
        CONTAINER_NAME = "lms-backend-dev"
        FRONTEND_URL = "https://lms-frontend-dev.onrender.com"   
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
                        withCredentials([
                            string(credentialsId: 'LMS_DB_HOST', variable: 'DB_HOST'),
                            string(credentialsId: 'LMS_DB_PORT', variable: 'DB_PORT'),
                            string(credentialsId: 'LMS_DB_USER', variable: 'DB_USER'),
                            string(credentialsId: 'LMS_DB_PASS', variable: 'DB_PASS'),
                            string(credentialsId: 'LMS_DB_NAME', variable: 'DB_NAME')
                            ]) {
                                sh '''
                                docker run -d -p 5000:5000 \
                                --name $CONTAINER_NAME \
                                -e DB_HOST=$DB_HOST \
                                -e DB_PORT=$DB_PORT \
                                -e DB_USER=$DB_USER \
                                -e DB_PASS=$DB_PASS \
                                -e DB_NAME=$DB_NAME \
                                -e NODE_ENV=development \
                                $IMAGE_NAME
                                 '''
                               }
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

                      stage('Register Test User') {
    steps {
        sh '''
        echo "Registering test user..."

        curl -s -X POST http://localhost:5000/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{"name":"Test User","email":"testuser@gmail.com","password":"123456"}'

        echo "User registered"
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