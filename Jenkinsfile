pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = '518647659327'
        AWS_DEFAULT_REGION = 'us-east-2'
        IMAGE_NAME = 'group-4-react-app'
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_NAME}"
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the React App...'
                bat 'npm install --force'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing the React App...'
                bat 'set CI=true && npm test'
            }
        }
        stage('Build My Docker Image') {
            steps {
                echo 'Building and pushing Docker image to AWS ECR...'
                withCredentials([[
                    $class: 'UsernamePasswordMultiBinding',
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    bat "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    bat "docker build -t ${IMAGE_NAME} ."
                    bat "docker tag ${IMAGE_NAME}:latest ${REPOSITORY_URI}:latest"
                    bat "docker push ${REPOSITORY_URI}:latest"
                }
            }
        }
        stage('Deploy to AWS') {
            steps {
                echo 'Deploying to AWS ECS Fargate...'
                withCredentials([[
                    $class: 'UsernamePasswordMultiBinding',
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    bat "aws ecs register-task-definition --cli-input-json file://task-definition.json --region ${AWS_DEFAULT_REGION}"
                    bat "aws ecs update-service --cluster group-4-cluster --service group-4-service --force-new-deployment --region ${AWS_DEFAULT_REGION}"
                }
            }
        }
    }
}
