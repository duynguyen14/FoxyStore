# FoxyStore
Built a full-stack e-commerce website with an AI-based recommendation system that suggests products to users based on their behavior.


## Feature
- User registration and authentication with JWT and Oauth2
- Product listing, cart management
- Product checkout online via vnPay
- Admin dashboard for products, users and orders managment
- Modern and responsive UI with ReactJS and Tailwindcss
- AI based product recommendation system

## AI Recommendation Engine

Built with a collaborative filtering algorithm that learns from user-product interaction history and generates personalized product suggestions.

## Technologies

### Frontend
- ReactJS
- Redux
- Tailwindcss

### Backend
- Spring boot
- SPring data JPA
- Spring security
- JWT
- MySQL

### AI Service
- Python
- Pandas, numpy,
- FastAPI

### Docker
- DockerFile, docker-compose

## Project Structure
E commercial App/
├── Back/            # Spring Boot backend
├── Font/            # ReactJS frontend
├── Service AI/      # Python FastAPI recommendation service
├── README.md
└── docker-compose.yml

## How to run

### 1.Clone the repo 
- git clone https://github.com/duynguyen14/FoxyStore.git
- cd FoxyStore

### 2.Run service AI
- cd Suggest API
- unvicron main:app --reload

### 3.Run Backend
- cd Back
- ./mvnw spring-boot:run

### 4.Run Frontend
- cd Font
- npm install
- npm run dev

# Note
- you can use docker-compose up to run all services together if you installed Docker

# Author
- Duy Nguyễn
- Profile https://github.com/duynguyen14