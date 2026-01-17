const careerRoadmaps = [
    {
        id: "data-science",
        title: "Data Science",
        description: "Master the art of extracting insights from data using statistical methods and algorithms.",
        duration: "10–12 Months",
        level: "Beginner",
        icon: "analytics",
        steps: [
            {
                topic: "Python & Mathematics",
                goal: "Build a strong foundation in programming and statistics.",
                resources: {
                    youtube: [
                        { title: "Python for Data Science (FreeCodeCamp)", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
                        { title: "Statistics for Data Science", url: "https://www.youtube.com/watch?v=Vfo5le26IhY" }
                    ],
                    udemy: [
                        { title: "The Data Science Course 2024", url: "https://www.udemy.com/" },
                        { title: "Python for Data Science and Machine Learning", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Data Analysis & Visualization",
                goal: "Learn to clean, analyze, and visualize data using Pandas, Matplotlib, and Seaborn.",
                resources: {
                    youtube: [
                        { title: "Pandas Tutorial (Corey Schafer)", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA" },
                        { title: "Matplotlib & Seaborn Guide", url: "https://www.youtube.com/watch?v=oqMHkG9V_Xk" }
                    ],
                    udemy: [
                        { title: "Learning Python for Data Analysis and Visualization", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Machine Learning Basics",
                goal: "Understand core ML algorithms: Regression, Classification, and Clustering.",
                resources: {
                    youtube: [
                        { title: "Machine Learning by Andrew Ng", url: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU" }
                    ],
                    udemy: [
                        { title: "Machine Learning A-Z", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "data-analysis",
        title: "Data Analysis",
        description: "Focus on analyzing data sets to find trends and answer questions.",
        duration: "6–8 Months",
        level: "Beginner",
        icon: "insights",
        steps: [
            {
                topic: "Excel & SQL",
                goal: "Master spreadsheet manipulation and database querying.",
                resources: {
                    youtube: [
                        { title: "Excel for Data Analysis", url: "https://www.youtube.com/watch?v=O127F9H1C54" },
                        { title: "SQL Tutorial (Alex The Analyst)", url: "https://www.youtube.com/watch?v=5bF558uJ7yM" }
                    ],
                    udemy: [
                        { title: "The Complete SQL Bootcamp", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "BI Tools (Tableau/PowerBI)",
                goal: "Create interactive dashboards and reports.",
                resources: {
                    youtube: [
                        { title: "Power BI Full Course", url: "https://www.youtube.com/watch?v=AGrl-H87pRU" }
                    ],
                    udemy: [
                        { title: "Microsoft Power BI Desktop for Business Intelligence", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "machine-learning",
        title: "Machine Learning",
        description: "Teach computers to learn from data and make predictions.",
        duration: "8–10 Months",
        level: "Intermediate",
        icon: "psychology",
        steps: [
            {
                topic: "Advanced Python & Math",
                goal: "Deep dive into Linear Algebra, Calculus, and Python libraries.",
                resources: {
                    youtube: [
                        { title: "Mathematics for Machine Learning", url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDfKQSZ5vQfSV7n1TVIGY8BX" }
                    ],
                    udemy: [
                        { title: "Mathematics for Machine Learning and Data Science", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Supervised & Unsupervised Learning",
                goal: "Master various algorithms and model evaluation metrics.",
                resources: {
                    youtube: [
                        { title: "StatQuest with Josh Starmer", url: "https://www.youtube.com/user/joshstarmer" }
                    ],
                    udemy: [
                        { title: "Data Science and Machine Learning Bootcamp", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "artificial-intelligence",
        title: "Artificial Intelligence",
        description: "Explore the frontiers of AI, including Deep Learning and NLP.",
        duration: "12+ Months",
        level: "Advanced",
        icon: "smart_toy",
        steps: [
            {
                topic: "Neural Networks & Deep Learning",
                goal: "Understand how neural networks work and build them using TensorFlow/PyTorch.",
                resources: {
                    youtube: [
                        { title: "Deep Learning Specialization (Andrew Ng)", url: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6Ec-XTbcX1uRg2_u4xOEky0" }
                    ],
                    udemy: [
                        { title: "Deep Learning A-Z", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Natural Language Processing (NLP)",
                goal: "Learn to process and analyze text data.",
                resources: {
                    youtube: [
                        { title: "NLP with Hugging Face", url: "https://www.youtube.com/watch?v=00GYzNAiXXE" }
                    ],
                    udemy: [
                        { title: "NLP - Natural Language Processing with Python", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "web-development",
        title: "Web Development",
        description: "Build modern, responsive websites and web applications.",
        duration: "6–9 Months",
        level: "Beginner",
        icon: "language",
        steps: [
            {
                topic: "HTML, CSS & JavaScript",
                goal: "The building blocks of the web.",
                resources: {
                    youtube: [
                        { title: "HTML & CSS Crash Course", url: "https://www.youtube.com/watch?v=qz0aGYrrlhU" },
                        { title: "JavaScript Crash Course", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c" }
                    ],
                    udemy: [
                        { title: "The Web Developer Bootcamp", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Frontend Frameworks (React)",
                goal: "Build dynamic user interfaces.",
                resources: {
                    youtube: [
                        { title: "React JS Crash Course", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" }
                    ],
                    udemy: [
                        { title: "React - The Complete Guide", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Backend Basics",
                goal: "Node.js, Express, and Databases.",
                resources: {
                    youtube: [
                        { title: "Node.js Crash Course", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4" }
                    ],
                    udemy: [
                        { title: "The Complete Node.js Developer Course", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "app-development",
        title: "App Development",
        description: "Create mobile applications for iOS and Android.",
        duration: "8–10 Months",
        level: "Intermediate",
        icon: "smartphone",
        steps: [
            {
                topic: "Flutter or React Native",
                goal: "Cross-platform mobile development.",
                resources: {
                    youtube: [
                        { title: "Flutter Crash Course", url: "https://www.youtube.com/watch?v=x0uinJvhNxI" }
                    ],
                    udemy: [
                        { title: "Flutter & Dart - The Complete Guide", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Native Development (Optional)",
                goal: "Swift for iOS or Kotlin for Android.",
                resources: {
                    youtube: [
                        { title: "Kotlin for Android", url: "https://www.youtube.com/watch?v=EExSSotojVI" }
                    ],
                    udemy: [
                        { title: "iOS & Swift - The Complete iOS App Development Bootcamp", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "java-developer",
        title: "Java Developer",
        description: "Become an expert in Java for enterprise application development.",
        duration: "6–9 Months",
        level: "Beginner",
        icon: "coffee",
        steps: [
            {
                topic: "Java Core",
                goal: "Syntax, OOPs concepts, and Collections.",
                resources: {
                    youtube: [
                        { title: "Java Programming for Beginners (Telusko)", url: "https://www.youtube.com/watch?v=8cm1x4bC610" }
                    ],
                    udemy: [
                        { title: "Java Programming Masterclass", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Spring Framework & Spring Boot",
                goal: "Build enterprise-grade applications.",
                resources: {
                    youtube: [
                        { title: "Spring Boot Tutorial (Amigoscode)", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" }
                    ],
                    udemy: [
                        { title: "Spring Boot 3, Spring 6 & Hibernate", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "marketing",
        title: "Marketing",
        description: "Learn digital marketing strategies, SEO, and content marketing.",
        duration: "3–6 Months",
        level: "Beginner",
        icon: "campaign",
        steps: [
            {
                topic: "Digital Marketing Fundamentals",
                goal: "SEO, SEM, and Social Media Marketing.",
                resources: {
                    youtube: [
                        { title: "Digital Marketing Course (Simplilearn)", url: "https://www.youtube.com/watch?v=bixR-KIJKYM" }
                    ],
                    udemy: [
                        { title: "The Complete Digital Marketing Course", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    },
    {
        id: "graphic-designing",
        title: "Graphic Designing",
        description: "Design visual content using tools like Photoshop, Illustrator, and Canva.",
        duration: "4–6 Months",
        level: "Beginner",
        icon: "brush",
        steps: [
            {
                topic: "Design Principles & Color Theory",
                goal: "Understand layout, typography, and color.",
                resources: {
                    youtube: [
                        { title: "Graphic Design Basics (Envato)", url: "https://www.youtube.com/watch?v=dFSia1L81Es" }
                    ],
                    udemy: [
                        { title: "Graphic Design Masterclass", url: "https://www.udemy.com/" }
                    ]
                }
            },
            {
                topic: "Tools: Photoshop & Illustrator",
                goal: "Master industry-standard design software.",
                resources: {
                    youtube: [
                        { title: "Photoshop for Beginners", url: "https://www.youtube.com/watch?v=IyR_uYsRdPs" }
                    ],
                    udemy: [
                        { title: "Adobe Photoshop CC – Essentials Training Course", url: "https://www.udemy.com/" }
                    ]
                }
            }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.careerRoadmaps = careerRoadmaps;
}
