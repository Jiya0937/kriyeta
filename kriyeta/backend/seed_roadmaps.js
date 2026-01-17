const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap');
const connectDB = require('./db');

// Connect to DB
connectDB();

const roadmaps = [
    // --- EXISTING (From previous static) ---
    {
        id: "data-science",
        domain: "Data Science",
        description: "Master the art of extracting insights from data using statistical methods and algorithms.",
        duration: "10–12 Months",
        level: "Beginner",
        icon: "analytics",
        steps: [
            {
                title: "Python & Mathematics",
                topics: ["Programming Basics", "Statistics", "Linear Algebra"],
                resources: [
                    { platform: "YouTube", title: "Python for Data Science (FreeCodeCamp)", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
                    { platform: "Udemy", title: "The Data Science Course 2024", url: "https://www.udemy.com/" }
                ]
            },
            {
                title: "Data Analysis",
                topics: ["Pandas", "Matplotlib", "Seaborn"],
                resources: [{ platform: "YouTube", title: "Pandas Tutorial", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA" }]
            }
        ]
    },
    {
        id: "web-development",
        domain: "Web Development",
        description: "Build modern, responsive websites and web applications.",
        duration: "6–9 Months",
        level: "Beginner",
        icon: "language",
        steps: [
            {
                title: "Frontend Basics",
                topics: ["HTML5", "CSS3", "JavaScript ES6"],
                resources: [{ platform: "YouTube", title: "HTML & CSS Crash Course", url: "https://youtube.com/..." }]
            },
            {
                title: "Frameworks",
                topics: ["React", "Tailwind CSS"],
                resources: [{ platform: "Udemy", title: "The Web Developer Bootcamp", url: "https://udemy.com/..." }]
            }
        ]
    },

    // --- NEW REQUESTED (DSA, Core, Advanced) ---

    // 1. DSA in C++
    {
        id: "dsa-cpp",
        domain: "DSA in C++",
        description: "Master problem solving and data structures using C++",
        duration: "4–6 Months",
        level: "Beginner to Advanced",
        icon: "code",
        steps: [
            {
                title: "Foundations",
                topics: ["Variables", "Loops", "Functions", "STL Basics"],
                resources: [
                    { platform: "YouTube", title: "C++ Full Course", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "DSA in C++ Bootcamp", url: "https://udemy.com/..." }
                ]
            },
            {
                title: "Data Structures",
                topics: ["Arrays", "Strings", "Linked List", "Stack", "Queue", "Trees", "Graphs"],
                resources: [
                    { platform: "YouTube", title: "Striver DSA Sheet", url: "https://youtube.com/..." },
                    { platform: "YouTube", title: "Love Babbar C++ DSA", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "Algorithms",
                topics: ["Recursion", "Backtracking", "Dynamic Programming", "Greedy"],
                resources: [
                    { platform: "Udemy", title: "Abdul Bari – DSA", url: "https://udemy.com/" },
                    { platform: "Udemy", title: "Coding Blocks C++ DSA", url: "https://udemy.com/" }
                ]
            }
        ]
    },

    // 2. DSA in Java
    {
        id: "dsa-java",
        domain: "DSA in Java",
        description: "Learn Data Structures and Algorithms using Java.",
        duration: "4–6 Months",
        level: "Intermediate",
        icon: "coffee",
        steps: [
            {
                title: "Java Core",
                topics: ["Java Basics", "OOP", "Collections Framework"],
                resources: [
                    { platform: "YouTube", title: "Kunal Kushwaha Java DSA", url: "https://youtube.com/..." },
                    { platform: "YouTube", title: "Apna College Java", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "Advanced DSA",
                topics: ["Trees & Graphs", "DP & Greedy", "Recursion"],
                resources: [
                    { platform: "Udemy", title: "Java DSA Masterclass", url: "https://udemy.com/..." }
                ]
            }
        ]
    },

    // 3. DSA in Python
    {
        id: "dsa-python",
        domain: "DSA in Python",
        description: "Master algorithms with Python's simplicity.",
        duration: "3–5 Months",
        level: "Beginner",
        icon: "terminal",
        steps: [
            {
                title: "Python Basics",
                topics: ["Lists", "Tuples", "Dicts", "Recursion"],
                resources: [
                    { platform: "YouTube", title: "FreeCodeCamp Python DSA", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "Algorithms",
                topics: ["Searching", "Sorting", "LeetCode Practice"],
                resources: [
                    { platform: "YouTube", title: "NeetCode Python", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "Python Algorithms Course", url: "https://udemy.com/..." }
                ]
            }
        ]
    },

    // 4. Linux Fundamentals
    {
        id: "linux-fundamentals",
        domain: "Linux Fundamentals",
        description: "Essential Linux skills for developers and DevOps.",
        duration: "1–2 Months",
        level: "Beginner",
        icon: "settings_system_daydream",
        steps: [
            {
                title: "Core Concepts",
                topics: ["File System", "Permissions", "Bash Scripting", "Process Management"],
                resources: [
                    { platform: "YouTube", title: "Linux Foundation", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "Linux Administration Bootcamp", url: "https://udemy.com/..." }
                ]
            },
            {
                title: "Networking",
                topics: ["Networking Basics", "SSH", "Firewalls"],
                resources: [
                    { platform: "YouTube", title: "FreeCodeCamp Linux", url: "https://youtube.com/..." }
                ]
            }
        ]
    },

    // 5. Git & GitHub
    {
        id: "git-github",
        domain: "Git & GitHub",
        description: "Version control and collaboration mastery.",
        duration: "2 Weeks",
        level: "Essential",
        icon: "call_merge",
        steps: [
            {
                title: "Git Basics",
                topics: ["Init", "Commit", "Branching", "Merge", "Rebase"],
                resources: [
                    { platform: "YouTube", title: "Kunal Kushwaha Git", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "GitHub Collaboration",
                topics: ["Pull Requests", "Code Review", "GitHub Actions (Intro)"],
                resources: [
                    { platform: "YouTube", title: "Traversy Media Git", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "Git & GitHub Complete Guide", url: "https://udemy.com/..." }
                ]
            }
        ]
    },

    // 6. Cloud Computing
    {
        id: "cloud-computing",
        domain: "Cloud Computing",
        description: "Deploy and manage applications in the cloud.",
        duration: "4–6 Months",
        level: "Intermediate",
        icon: "cloud",
        steps: [
            {
                title: "Cloud Basics",
                topics: ["AWS/Azure/GCP Overview", "EC2", "S3", "IAM"],
                resources: [
                    { platform: "YouTube", title: "AWS FreeCodeCamp", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "AWS Certified Cloud Practitioner", url: "https://udemy.com/..." }
                ]
            },
            {
                title: "Deployment",
                topics: ["CI/CD", "Containers", "Serverless"],
                resources: [
                    { platform: "YouTube", title: "TechWorld with Nana", url: "https://youtube.com/..." }
                ]
            }
        ]
    },

    // 7. Blockchain
    {
        id: "blockchain",
        domain: "Blockchain Technology",
        description: "Decentralized application development.",
        duration: "6–9 Months",
        level: "Advanced",
        icon: "token",
        steps: [
            {
                title: "Foundations",
                topics: ["Blockchain Basics", "Smart Contracts", "Web3"],
                resources: [
                    { platform: "YouTube", title: "Whiteboard Crypto", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "Development",
                topics: ["Solidity", "Ethereum", "DApps"],
                resources: [
                    { platform: "YouTube", title: "Patrick Collins", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "Blockchain Developer Bootcamp", url: "https://udemy.com/..." }
                ]
            }
        ]
    },

    // 8. Generative AI
    {
        id: "generative-ai",
        domain: "Generative AI",
        description: "Build the future with LLMs and AI models.",
        duration: "3–6 Months",
        level: "Advanced",
        icon: "psychology_alt",
        steps: [
            {
                title: "LLM Fundamentals",
                topics: ["Prompt Engineering", "OpenAI APIs", "Transformers"],
                resources: [
                    { platform: "YouTube", title: "FreeCodeCamp GenAI", url: "https://youtube.com/..." },
                    { platform: "YouTube", title: "AI Explained", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "Applied GenAI",
                topics: ["LangChain", "RAG", "Vector Databases"],
                resources: [
                    { platform: "Udemy", title: "Generative AI Masterclass", url: "https://udemy.com/..." }
                ]
            }
        ]
    },

    // 9. Chatbot Development
    {
        id: "chatbot-dev",
        domain: "Chatbot Development",
        description: "Create intelligent conversational agents.",
        duration: "3–4 Months",
        level: "Intermediate",
        icon: "chat",
        steps: [
            {
                title: "Bot Basics",
                topics: ["Rule-based Bots", "NLP Basics", "Flow Design"],
                resources: [
                    { platform: "YouTube", title: "Rasa Tutorials", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "Advanced Bots",
                topics: ["Dialogflow", "Rasa", "GPT-based Bots"],
                resources: [
                    { platform: "YouTube", title: "Chatbot with Python", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "Build Chatbots with AI", url: "https://udemy.com/..." }
                ]
            }
        ]
    },

    // 10. Robotics
    {
        id: "robotics",
        domain: "Robotics",
        description: "Programming for physical world interaction.",
        duration: "6–12 Months",
        level: "Advanced",
        icon: "precision_manufacturing",
        steps: [
            {
                title: "Foundations",
                topics: ["Python for Robotics", "OpenCV", "Sensor Integration"],
                resources: [
                    { platform: "YouTube", title: "Robotics Back-End", url: "https://youtube.com/..." }
                ]
            },
            {
                title: "ROS & Simulation",
                topics: ["ROS2 Nodes", "Gazebo Simulation", "Navigation"],
                resources: [
                    { platform: "YouTube", title: "The Construct ROS", url: "https://youtube.com/..." },
                    { platform: "Udemy", title: "ROS2 & Robotics Bootcamp", url: "https://udemy.com/..." }
                ]
            }
        ]
    }

];

const seedDB = async () => {
    try {
        await Roadmap.deleteMany({}); // Clear existing to avoid duplicates during dev
        await Roadmap.insertMany(roadmaps);
        console.log('✅ Roadmap Database Seeded Successfully!');
    } catch (err) {
        console.error('❌ Error seeding roadmaps:', err);
    } finally {
        mongoose.disconnect();
    }
};

seedDB();
