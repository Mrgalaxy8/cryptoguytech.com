import React from 'react';

interface EthereumCoursePageProps {
    onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-primary-green mb-4">{title}</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
            {children}
        </div>
    </section>
);

export const EthereumCoursePage: React.FC<EthereumCoursePageProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <button
                onClick={onBack}
                className="mb-8 text-primary-green hover:text-green-400 transition-colors"
            >
                &larr; Back to Academy
            </button>

            <article className="bg-dark-card p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-black text-white mb-6">Ethereum and Web3: Unlocking the Future of Decentralized Applications</h1>

                <Section title="What Is Ethereum?">
                    <p>Ethereum is a decentralized blockchain platform that enables developers to build and deploy smart contracts and decentralized applications (dApps). Unlike Bitcoin, which focuses on peer-to-peer payments, Ethereum is designed for programmability.</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-white">Launched:</strong> July 2015 by Vitalik Buterin and others.</li>
                        <li><strong className="font-semibold text-white">Native Currency:</strong> Ether (ETH), used for transactions and gas fees.</li>
                        <li><strong className="font-semibold text-white">Consensus Mechanism:</strong> Transitioned from Proof of Work (PoW) to Proof of Stake (PoS) via Ethereum 2.0.</li>
                        <li><strong className="font-semibold text-white">Smart Contracts:</strong> Self-executing code stored on the blockchain.</li>
                    </ul>
                </Section>

                <Section title="What Is Web3?">
                    <p>Web3 represents the next evolution of the internet, where users control their data, identity, and assets through decentralized technologies.</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-white">Web1:</strong> Static websites, read-only.</li>
                        <li><strong className="font-semibold text-white">Web2:</strong> Interactive platforms, but centralized (e.g., Facebook, Google).</li>
                        <li><strong className="font-semibold text-white">Web3:</strong> Decentralized apps, user-owned data, powered by blockchains like Ethereum.</li>
                    </ul>
                    <h3 className="text-xl font-bold text-white mt-4 mb-2">Key Web3 Principles:</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Decentralization</li>
                        <li>Token-based economics</li>
                        <li>Trustless interactions</li>
                        <li>Open-source development</li>
                    </ul>
                </Section>

                <Section title="Smart Contracts Explained">
                    <p>Smart contracts are self-executing programs that run on the Ethereum blockchain. They automate transactions and logic without intermediaries.</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-white">Written In:</strong> Solidity (Ethereum’s programming language).</li>
                        <li><strong className="font-semibold text-white">Immutable:</strong> Once deployed, cannot be changed.</li>
                        <li><strong className="font-semibold text-white">Transparent:</strong> Anyone can inspect the code.</li>
                        <li><strong className="font-semibold text-white">Use Cases:</strong> Token creation (ERC-20, ERC-721), voting systems, escrow services, automated payments.</li>
                    </ul>
                    <p className="mt-4 p-4 border-l-4 border-primary-green bg-dark-bg rounded-r-lg">
                        <strong className="text-green-400">Example:</strong> A smart contract for a crowdfunding campaign automatically releases funds to the creator if a funding target is met by a certain date, or refunds all contributors if it is not.
                    </p>
                </Section>

                <Section title="What Are dApps?">
                    <p>Decentralized Applications (dApps) are apps built on blockchain networks like Ethereum. They use smart contracts for backend logic and often integrate with wallets like MetaMask.</p>
                     <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-white">Frontend:</strong> Built with traditional web tools (React, HTML, CSS).</li>
                        <li><strong className="font-semibold text-white">Backend:</strong> Smart contracts on Ethereum.</li>
                        <li><strong className="font-semibold text-white">Storage:</strong> Can use decentralized storage (IPFS, Arweave).</li>
                    </ul>
                    <h3 className="text-xl font-bold text-white mt-4 mb-2">Popular dApps:</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-white">Uniswap:</strong> Decentralized exchange.</li>
                        <li><strong className="font-semibold text-white">Aave:</strong> Lending and borrowing.</li>
                        <li><strong className="font-semibold text-white">OpenSea:</strong> NFT marketplace.</li>
                        <li><strong className="font-semibold text-white">Decentraland:</strong> Virtual world.</li>
                    </ul>
                </Section>

                <Section title="Benefits and Challenges">
                    <h3 className="text-xl font-bold text-green-400 mt-4 mb-2">Benefits:</h3>
                     <ul className="list-disc list-inside space-y-2">
                        <li>Censorship resistance</li>
                        <li>User ownership of assets</li>
                        <li>Global accessibility</li>
                        <li>Programmable money</li>
                    </ul>
                    <h3 className="text-xl font-bold text-red-400 mt-4 mb-2">Challenges:</h3>
                     <ul className="list-disc list-inside space-y-2">
                        <li>Scalability</li>
                        <li>High gas fees</li>
                        <li>UX complexity</li>
                        <li>Regulatory uncertainty</li>
                    </ul>
                </Section>

                <Section title="Final Thoughts">
                    <p>Ethereum and Web3 are revolutionizing how we build and interact with digital systems. By understanding smart contracts and dApps, you gain the tools to create transparent, secure, and user-centric applications. This is the foundation for building the next generation of digital services.</p>
                </Section>

                <div className="mt-12 pt-6 border-t border-gray-700 text-right text-gray-500 italic">
                    <p>Prepared by: Your Professional Blockchain Tutor</p>
                </div>
            </article>
        </div>
    );
};