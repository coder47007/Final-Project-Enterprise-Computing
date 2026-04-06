pipeline {
    agent any

    environment {
        // AWS variables
        AWS_ACCOUNT_ID = 'YOUR_AWS_ACCOUNT_ID' // Replace with your AWS Account ID!
        AWS_DEFAULT_REGION = 'us-east-1' // Adjust region if needed!
        ECR_REPO = "group-4-react-app" 
        IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${ECR_REPO}:latest"
        AWS_CREDENTIALS_ID = 'aws-credentials' // This maps to the Jenkins credentials ID we will create
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the React Application...'
                bat 'npm install'
                bat 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'set CI=true&& npm test'
            }
        }
        
        stage('Build My Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    dockerImage = docker.build("${IMAGE_URI}")
                }
                
                echo 'Logging into AWS ECR & Pushing...'
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                    // Logs docker CLI into AWS ECR
                    bat "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    
                    echo 'Pushing Docker image to ECR...'
                    script {
                        dockerImage.push()
                    }
                }
            }
        }
    }
}
