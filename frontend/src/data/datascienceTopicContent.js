// Data Science Roadmap Topic Content

export const datascienceTopicContent = {
    "python-basics": {
        id: "python-basics",
        title: "Python Programming",
        definition: "Python is the most popular language for data science due to its simple syntax and powerful libraries like NumPy, Pandas, and Scikit-learn.",
        importance: "Python is the foundation of data science. You'll use it for everything from data cleaning to building ML models.",
        usage: "Writing scripts, data manipulation, building models, and creating visualizations.",
        keyConcepts: [
            { id: "syntax", title: "Python Syntax", description: "Variables, functions, classes" },
            { id: "data-structures", title: "Data Structures", description: "Lists, dicts, sets, tuples" },
            { id: "numpy", title: "NumPy", description: "Numerical computing library" },
            { id: "jupyter", title: "Jupyter Notebooks", description: "Interactive coding environment" }
        ],
        resources: {
            videos: [{ title: "Python for Data Science", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", type: "Video" }],
            articles: [{ title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Article" }]
        },
        studyPath: { prerequisites: ["Basic computer skills"], nextTopics: ["Math & Statistics"] },
        aiPrompts: ["Python basics for data science", "NumPy array operations"]
    },

    "math-stats": {
        id: "math-stats",
        title: "Math & Statistics",
        definition: "The mathematical foundations of data science including linear algebra, probability, and statistical analysis.",
        importance: "Math is the language of machine learning. Understanding statistics helps you interpret data correctly.",
        usage: "Understanding distributions, hypothesis testing, regression analysis, and algorithm foundations.",
        keyConcepts: [
            { id: "linear-algebra", title: "Linear Algebra", description: "Vectors, matrices, operations" },
            { id: "probability", title: "Probability", description: "Distributions, Bayes theorem" },
            { id: "statistics", title: "Descriptive Statistics", description: "Mean, median, std deviation" },
            { id: "hypothesis", title: "Hypothesis Testing", description: "P-values, confidence intervals" }
        ],
        resources: {
            videos: [{ title: "Statistics for Data Science", url: "https://www.youtube.com/watch?v=xxpc-HPKN28", type: "Video" }],
            articles: [{ title: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability", type: "Article" }]
        },
        studyPath: { prerequisites: ["Python Programming"], nextTopics: ["Data Analysis (Pandas)"] },
        aiPrompts: ["Explain p-values simply", "Linear algebra for ML"]
    },

    "data-analysis": {
        id: "data-analysis",
        title: "Data Analysis (Pandas)",
        definition: "Using Pandas and other tools to clean, transform, and analyze datasets to extract insights.",
        importance: "80% of a data scientist's time is spent on data preparation. Pandas mastery is essential.",
        usage: "Loading datasets, cleaning data, feature engineering, exploratory data analysis.",
        keyConcepts: [
            { id: "dataframes", title: "DataFrames", description: "Core Pandas data structure" },
            { id: "cleaning", title: "Data Cleaning", description: "Handling missing values, outliers" },
            { id: "eda", title: "Exploratory Analysis", description: "Understanding your data" },
            { id: "feature-eng", title: "Feature Engineering", description: "Creating useful features" }
        ],
        resources: {
            videos: [{ title: "Pandas Tutorial", url: "https://www.youtube.com/watch?v=vmEHCJofslg", type: "Video" }],
            articles: [{ title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/", type: "Article" }]
        },
        studyPath: { prerequisites: ["Math & Statistics"], nextTopics: ["Data Visualization"] },
        aiPrompts: ["Common Pandas operations", "How to clean messy data?"]
    },

    "visualization": {
        id: "visualization",
        title: "Data Visualization",
        definition: "Creating charts, graphs, and dashboards to communicate insights from data effectively.",
        importance: "Visualization makes data understandable. It's how you tell stories with data to stakeholders.",
        usage: "Creating plots, dashboards, presenting findings, exploratory analysis.",
        keyConcepts: [
            { id: "matplotlib", title: "Matplotlib", description: "Basic plotting library" },
            { id: "seaborn", title: "Seaborn", description: "Statistical visualizations" },
            { id: "plotly", title: "Plotly", description: "Interactive charts" },
            { id: "dashboards", title: "Dashboards", description: "Streamlit, Tableau" }
        ],
        resources: {
            videos: [{ title: "Data Visualization with Python", url: "https://www.youtube.com/watch?v=a9UrKTVEeZA", type: "Video" }],
            articles: [{ title: "Seaborn Tutorial", url: "https://seaborn.pydata.org/tutorial.html", type: "Article" }]
        },
        studyPath: { prerequisites: ["Data Analysis (Pandas)"], nextTopics: ["Machine Learning Basics"] },
        aiPrompts: ["Best chart for comparing categories?", "Matplotlib vs Plotly?"]
    },

    "ml-basics": {
        id: "ml-basics",
        title: "Machine Learning Basics",
        definition: "Building models that learn from data to make predictions. Includes supervised learning, unsupervised learning, and model evaluation.",
        importance: "ML gives computers the ability to learn. It's used in recommendations, fraud detection, and much more.",
        usage: "Classification, regression, clustering, model selection, and evaluation.",
        keyConcepts: [
            { id: "supervised", title: "Supervised Learning", description: "Regression, classification" },
            { id: "unsupervised", title: "Unsupervised Learning", description: "Clustering, dimensionality reduction" },
            { id: "sklearn", title: "Scikit-learn", description: "ML library for Python" },
            { id: "evaluation", title: "Model Evaluation", description: "Metrics, cross-validation" }
        ],
        resources: {
            videos: [{ title: "ML Course by Andrew Ng", url: "https://www.youtube.com/watch?v=jGwO_UgTS7I", type: "Video" }],
            articles: [{ title: "Scikit-learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/", type: "Article" }]
        },
        studyPath: { prerequisites: ["Data Visualization"], nextTopics: ["Deep Learning"] },
        aiPrompts: ["Explain supervised vs unsupervised", "How to choose ML algorithm?"]
    },

    "deep-learning": {
        id: "deep-learning",
        title: "Deep Learning",
        definition: "Neural networks with multiple layers that can learn complex patterns. Used for images, text, and sequences.",
        importance: "Deep learning powers cutting-edge AI: ChatGPT, image recognition, self-driving cars.",
        usage: "Image classification, NLP, generative AI, computer vision.",
        keyConcepts: [
            { id: "neural-nets", title: "Neural Networks", description: "Layers, activation functions" },
            { id: "tensorflow", title: "TensorFlow / PyTorch", description: "Deep learning frameworks" },
            { id: "cnn", title: "CNNs", description: "Convolutional networks for images" },
            { id: "transformers", title: "Transformers", description: "Attention-based models (GPT, BERT)" }
        ],
        resources: {
            videos: [{ title: "Deep Learning Basics", url: "https://www.youtube.com/watch?v=aircAruvnKk", type: "Video" }],
            articles: [{ title: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/", type: "Article" }]
        },
        studyPath: { prerequisites: ["Machine Learning Basics"], nextTopics: ["MLOps & Deployment"] },
        aiPrompts: ["How do neural networks learn?", "TensorFlow vs PyTorch?"]
    },

    "mlops": {
        id: "mlops",
        title: "MLOps & Deployment",
        definition: "Taking ML models from experiments to production. Includes model serving, monitoring, and lifecycle management.",
        importance: "A model in a notebook isn't useful. MLOps makes ML work in the real world.",
        usage: "Model serving, API deployment, monitoring, experiment tracking.",
        keyConcepts: [
            { id: "mlflow", title: "MLflow", description: "Experiment tracking" },
            { id: "docker", title: "Docker", description: "Containerizing models" },
            { id: "fastapi", title: "FastAPI", description: "Model serving as APIs" },
            { id: "cloud", title: "Cloud ML", description: "AWS SageMaker, GCP Vertex" }
        ],
        resources: {
            videos: [{ title: "MLOps Explained", url: "https://www.youtube.com/watch?v=7hY4lhDKB3k", type: "Video" }],
            articles: [{ title: "MLOps Guide", url: "https://ml-ops.org/", type: "Article" }]
        },
        studyPath: { prerequisites: ["Deep Learning"], nextTopics: [] },
        aiPrompts: ["What is MLOps?", "How to deploy an ML model?"]
    }
};

export default datascienceTopicContent;
