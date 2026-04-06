pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the React Application...'
                // Install NodeJS module and Build
                bat 'npm install'
                bat 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Run tests in CI mode
                bat 'set CI=true&& npm test'
            }
        }
    }
}
