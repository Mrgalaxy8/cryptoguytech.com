import React from 'react';

interface CourseDetailPageProps {
    onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-primary-green mb-4">{title}</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {children}
        </div>
    </section>
);

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <button
                onClick={onBack}
                className="mb-8 text-primary-green hover:text-green-400 transition-colors"
            >
                &larr; Back to Academy
            </button>

            <article className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Fundamentals of Blockchain Technology</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
                    Blockchain technology is one of the most transformative innovations of the 21st century. It powers cryptocurrencies like Bitcoin and Ethereum, but its potential extends far beyond digital money. At its core, blockchain is a secure, transparent, and decentralized way to record transactions. This document provides a beginner-friendly overview of how blockchain works, its key components, and real-world applications.
                </p>

                <Section title="1. What is Blockchain?">
                    <p>A blockchain is a distributed digital ledger that records transactions across multiple computers in a way that ensures the data cannot be altered retroactively. Each block contains a list of transactions, and once it is verified, it becomes part of a chain of blocks — hence the term "blockchain."</p>
                    <p><strong className="text-green-500 dark:text-green-400">Real-world Example:</strong> Imagine a Google Sheet shared across hundreds of users. Everyone can see the latest entries, but no one can delete or modify old data without the approval of the entire network. That's how blockchain maintains transparency and trust.</p>
                </Section>

                <Section title="2. Key Features of Blockchain">
                    <ol className="list-decimal list-inside space-y-2">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Decentralization</strong> – No single entity controls the blockchain; it's maintained by a network of nodes (computers).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Transparency</strong> – Every participant can view transactions recorded on the blockchain.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Security</strong> – Cryptography ensures transactions are secure and tamper-proof.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Immutability</strong> – Once data is written to the blockchain, it cannot be changed or deleted.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Consensus Mechanism</strong> – The network agrees on which transactions are valid before adding them to the chain.</li>
                    </ol>
                </Section>

                <Section title="3. How Blockchain Works">
                    <p>Every blockchain operates on a simple process: 1. A transaction is requested. 2. The transaction is broadcast to a network of nodes. 3. The nodes validate the transaction using consensus algorithms. 4. The validated transaction is added to a new block. 5. The new block is appended to the existing chain. 6. The transaction is complete, and records are updated across all nodes.</p>
                    <p><strong className="text-green-500 dark:text-green-400">Example:</strong> When Alice sends 1 Bitcoin to Bob, the transaction is verified by thousands of computers on the Bitcoin network. Once validated, it becomes part of the blockchain — permanently recorded and visible to anyone.</p>
                </Section>

                <Section title="4. Types of Blockchain">
                     <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Public Blockchain</strong> – Open to everyone (e.g., Bitcoin, Ethereum).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Private Blockchain</strong> – Restricted access, controlled by one organization (e.g., Hyperledger Fabric).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Consortium Blockchain</strong> – A hybrid managed by multiple organizations (e.g., Energy Web Foundation).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Hybrid Blockchain</strong> – Combines both public and private features for controlled transparency.</li>
                    </ul>
                </Section>
                
                <Section title="5. Real-world Applications of Blockchain">
                     <ol className="list-decimal list-inside space-y-2">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Cryptocurrencies</strong> – Bitcoin, Ethereum, and others use blockchain for peer-to-peer financial transactions.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Supply Chain</strong> – Companies like IBM and Maersk use blockchain to track goods from origin to delivery.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Voting Systems</strong> – Blockchain ensures transparent and tamper-proof elections.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Healthcare</strong> – Secure sharing of patient data between hospitals using blockchain networks.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Smart Contracts</strong> – Self-executing contracts on platforms like Ethereum automate agreements.</li>
                    </ol>
                </Section>

                <Section title="6. Advantages and Challenges">
                    <p><strong className="text-green-500 dark:text-green-400">Advantages:</strong> Eliminates intermediaries, reducing costs. - Increases transparency and accountability. - Enhances security through decentralization. - Provides faster and borderless transactions.</p>
                    <p><strong className="text-red-500 dark:text-red-400">Challenges:</strong> Energy consumption in Proof-of-Work systems. - Scalability limitations for large transaction volumes. - Regulatory uncertainty in many countries. - Integration with legacy systems can be complex.</p>
                </Section>

                <Section title="7. The Future of Blockchain">
                    <p>Blockchain technology continues to evolve. With innovations like Proof-of-Stake, Layer 2 scaling solutions, and integration with Artificial Intelligence (AI) and the Internet of Things (IoT), blockchain is becoming more efficient and versatile. In the near future, blockchain could power identity verification systems, decentralized finance (DeFi) platforms, and global supply chains.</p>
                </Section>

                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-right text-gray-500 italic">
                    <p>Prepared by: Your Professional Blockchain Tutor</p>
                </div>
            </article>
        </div>
    );
};
