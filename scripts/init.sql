-- Run this in the Supabase SQL Editor.
create table if not exists content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into content (key, value) values
('about', '{
  "bio": [
    "I''m a software engineer based in Singapore with a passion for building products that are both performant and delightful to use.",
    "I specialize in full-stack development with React, Next.js, and Node.js, with a focus on clean architecture and great user experiences."
  ],
  "passions": [
    { "title": "Open Source", "description": "I contribute to open-source projects and believe in building software that benefits the community." },
    { "title": "AI & Emerging Tech", "description": "From LLMs to agentic systems, I love exploring the cutting edge." },
    { "title": "Continuous Learning", "description": "I''m always reading, building, and levelling up." }
  ],
  "hobbies": ["Music Production", "Gaming", "Travel"]
}'::jsonb),
('experience', '{
  "entries": [
    {
      "role": "Senior Software Engineer",
      "company": "Tech Corp",
      "period": "Jan 2024 — Present",
      "description": "Leading development of customer-facing web applications.",
      "highlights": [
        "Architected and built a real-time analytics dashboard serving 10k+ users",
        "Led migration from legacy codebase to Next.js, reducing load times by 60%",
        "Mentored 3 junior engineers through structured code reviews and pairing"
      ]
    },
    {
      "role": "Full-Stack Developer",
      "company": "StartupXYZ",
      "period": "Jun 2022 — Dec 2023",
      "description": "Built core product features across the full stack.",
      "highlights": [
        "Developed AI-powered chat assistant using LangChain and RAG pipelines",
        "Designed and implemented RESTful APIs handling 1M+ requests/day",
        "Reduced infrastructure costs by 40% through optimized database queries"
      ]
    },
    {
      "role": "Software Engineer",
      "company": "Digital Agency Co",
      "period": "Mar 2021 — May 2022",
      "description": "Delivered client projects with modern web technologies.",
      "highlights": [
        "Built 5+ production React applications for enterprise clients",
        "Introduced TypeScript across the team, reducing runtime errors by 50%",
        "Implemented CI/CD pipelines improving deployment frequency by 3x"
      ]
    },
    {
      "role": "Junior Developer",
      "company": "WebWorks",
      "period": "Aug 2020 — Feb 2021",
      "description": "Started career building and maintaining client websites.",
      "highlights": [
        "Developed responsive landing pages and email templates",
        "Collaborated with designers to implement pixel-perfect UIs",
        "Wrote unit tests achieving 85% code coverage"
      ]
    }
  ],
  "education": [
    { "degree": "B.S. Computer Science", "school": "National University of Singapore", "period": "2016 — 2020" }
  ]
}'::jsonb),
('projects', '{
  "entries": [
    {
      "title": "E-Commerce Chat Helper",
      "description": "AI-powered shopping assistant with real-time product recommendations.",
      "longDescription": "A full-featured conversational AI assistant for e-commerce platforms using RAG architecture with vector embeddings.",
      "tags": ["Next.js", "LangChain", "RAG", "Pinecone", "TypeScript"],
      "links": [{ "label": "GitHub", "href": "#" }, { "label": "Live Demo", "href": "#" }],
      "category": "AI"
    },
    {
      "title": "Financial Dashboard",
      "description": "Real-time analytics dashboard with interactive data visualization.",
      "longDescription": "A comprehensive financial monitoring platform with live market data, customizable widgets, and interactive charts.",
      "tags": ["React", "D3.js", "WebSocket", "Node.js", "PostgreSQL"],
      "links": [{ "label": "GitHub", "href": "#" }, { "label": "Live Demo", "href": "#" }],
      "category": "Full-Stack"
    },
    {
      "title": "F1 RAG System",
      "description": "Retrieval-augmented generation system for Formula 1 race data.",
      "longDescription": "A specialized RAG pipeline that ingests and indexes Formula 1 race data, team strategies, and historical results.",
      "tags": ["Python", "LangChain", "ChromaDB", "Streamlit", "FastAPI"],
      "links": [{ "label": "GitHub", "href": "#" }, { "label": "Case Study", "href": "#" }],
      "category": "AI"
    },
    {
      "title": "ThinkBoard",
      "description": "Collaborative Kanban board with real-time team sync.",
      "longDescription": "A MERN-stack project management tool with drag-and-drop Kanban boards and real-time collaboration.",
      "tags": ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
      "links": [{ "label": "GitHub", "href": "#" }, { "label": "Live Demo", "href": "#" }],
      "category": "Full-Stack"
    },
    {
      "title": "CI/CD Pipeline Tool",
      "description": "Automated deployment pipeline with monitoring and alerts.",
      "longDescription": "A DevOps tool that automates build, test, and deployment workflows with real-time build logs.",
      "tags": ["Docker", "GitHub Actions", "AWS", "Terraform", "Node.js"],
      "links": [{ "label": "GitHub", "href": "#" }, { "label": "Docs", "href": "#" }],
      "category": "DevOps"
    },
    {
      "title": "IBF Scraper",
      "description": "Automated data extraction and analysis platform.",
      "longDescription": "A web scraping infrastructure that collects, processes, and analyzes structured data from multiple sources.",
      "tags": ["Python", "Scrapy", "PostgreSQL", "Docker", "Airflow"],
      "links": [{ "label": "GitHub", "href": "#" }],
      "category": "Data"
    }
  ]
}'::jsonb)
on conflict (key) do nothing;
