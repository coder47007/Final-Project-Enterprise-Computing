pipeline {
    agent any

    environment {
        // AWS variables
        AWS_ACCOUNT_ID = 'YOUR_AWS_ACCOUNT_ID' // Replace with your AWS Account ID
        AWS_DEFAULT_REGION = 'us-east-1' // Replace if you are using a different region
        ECR_REPO = "group-4-react-app" // Your ECR repository name
        ECS_CLUSTER = "group-4-cluster" // Your ECS cluster name
        ECS_SERVICE = "group-4-service" // Your ECS service name
        IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${ECR_REPO}:${env.BUILD_ID}"
        AWS_CREDENTIALS_ID = 'aws-credentials' // ID of credentials added in Jenkins UI
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the React Application...'
                // Install NodeJS module and Build
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Run tests in CI mode
                sh 'CI=true npm test'
            }
        }

        stage('Build My Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    dockerImage = docker.build("${IMAGE_URI}")
                }
                
                echo 'Logging into AWS ECR...'
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    
                    echo 'Pushing Docker image to ECR...'
                    dockerImage.push()
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                echo 'Deploying to AWS ECS...'
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                    // Update task definition with new image 
                    sh """
                    sed -i "s|<IMAGE_URI>|${IMAGE_URI}|g" task-definition.json
                    """
                    
                    // Register the new task definition
                    sh """
                    aws ecs register-task-definition --cli-input-json file://task-definition.json > task-def-response.json
                    """
                    
                    // Retrieve task definition family and revision
                    sh """
                    REVISION=\$(cat task-def-response.json | jq .taskDefinition.revision)
                    FAMILY=\$(cat task-def-response.json | jq -r .taskDefinition.family)
                    
                    // Update the ECS service with the new task definition
                    aws ecs update-service --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE} --task-definition \$FAMILY:\$REVISION
                    """
                }
            }
        }
    }
}
