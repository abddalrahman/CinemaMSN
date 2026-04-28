📝 CinemaMSN

A comprehensive cinematic ecosystem designed for enthusiasts who seek more than just a movie list. CinemaMSN provides deep insights, real-time updates, and an interactive community experience, bridging the gap between global cinematic data and end-user engagement.

    ⚠️ Note: This project is a full-scale, production-ready application built to demonstrate advanced proficiency in Full-Stack development, Database Management, and System Security.

🧰 Technologies Used

    Framework: Next.js (App Router - Server & Client Components)

    Cloud Storage: Cloudinary SDK (Media Management & Global CDN)

    Database: PostgreSQL (pg library)

    Security: JWT (JSON Web Tokens), bcryptjs, and Cookies

    Validation: Zod (Strict Schema Validation)

    Styling: Bootstrap 5 (Mobile-first design)

    Mailing: Nodemailer (OTP & Token Recovery)

    Interactive UI: Swiper.js, React-Toastify, React-Icons

⚙️ Technical Deep Dive
🏗️ Architectural Excellence

    Clean Architecture: Followed a strict separation of concerns. Logic is decoupled into dedicated layers: Helper Functions, API Handlers, and a specialized Data Access Layer for PostgreSQL queries to ensure scalability.

    RESTful API Ecosystem: Engineered approximately 100 documented endpoints. Each API is built using standard HTTP methods (GET, POST, PUT, DELETE) and includes a standardized documentation header for maintainability.

    Storage Synchronization: Each API is architected to maintain strict sync between PostgreSQL and Cloudinary; deleting any database record triggers an automated Cloud Cleanup to prevent orphaned media assets.

🔐 Advanced Security & Auth

    Robust Authentication: A hybrid system using HTTP-only Cookies and JWT for stateless, secure session management.

    Strict Data Integrity: Implemented Zod for rigorous end-to-end schema validation on both Client-side (UX) and Server-side (Security).

    Secure Recovery Flow:

    	Account Activation: 6-digit OTP system integrated via Nodemailer.

    	Password Reset: A sophisticated token-based recovery system that validates unique identifiers against encrypted database payloads.

    Data Protection: All sensitive user data is hashed using bcryptjs before persistence.

🖥️ Full-Stack Capabilities

    Admin Dashboard: A comprehensive management suite allowing full CRUD operations over Content, Celebrities, News, Reviews, and Messages.

    Hybrid Media Management: Integrated Cloudinary for handling high-resolution posters, trailers, and news images, leveraging Dynamic Transformations to optimize image delivery on the fly.

    Role-Based Access Control (RBAC): Integrated a "Protected Admin" status with exclusive permissions to modify user roles and platform settings.

    Complex UI Logic: Created a smart community system for reporting and interacting with comments. This includes an advanced "Spoiler" logic that distinguishes between user-flagged and author-flagged content with distinct visual treatments.

📁 Key Features

    Comprehensive Databases: Instant access to detailed filmographies and biographies.

    User Engagement: Personalized watchlists, rating systems, and private messaging with administration.

    Smart Rankings: Dynamic "Top 100" lists for movies, series, and actors based on real-time user statistics.

    Performance: Minimal custom CSS and optimized Next.js rendering patterns for lightning-fast load times.

🕰️ Project Timeline

    Start Date: 1-1-2026

    Duration: ~240hours

    Type: Advanced Full-Stack Portfolio Project

📌 Notes

While the project features an original design and custom layout, it intentionally incorporates industry-standard conventions found in major cinematic platforms like IMDb. This ensures a seamless and intuitive user experience by following familiar visual patterns for content presentation. Beyond the aesthetics, the entire core engine—including the database architecture, security middleware, and the RESTful API ecosystem—is handcrafted from the ground up, providing a unique and high-performance technical foundation.

🔗 Live Preview

View the project live here:
