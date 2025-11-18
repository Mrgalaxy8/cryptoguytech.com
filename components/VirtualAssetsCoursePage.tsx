import React from 'react';

interface VirtualAssetsCoursePageProps {
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

export const VirtualAssetsCoursePage: React.FC<VirtualAssetsCoursePageProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <button
                onClick={onBack}
                className="mb-8 text-primary-green hover:text-green-400 transition-colors"
            >
                &larr; Back to Academy
            </button>

            <article className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Understanding Cryptocurrencies, Tokens, and DeFi</h1>
                
                <Section title="What Are Cryptocurrencies?">
                    <p>Cryptocurrencies are digital assets secured by cryptography and powered by blockchain technology. They enable peer-to-peer transactions without centralized intermediaries.</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Blockchain:</strong> A distributed ledger that records transactions across a network.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Cryptography:</strong> Ensures data integrity, privacy, and security.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Decentralization:</strong> No single authority controls the network.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Examples:</strong> Bitcoin (BTC), Ethereum (ETH), Solana (SOL).</li>
                    </ul>
                </Section>

                <Section title="How Cryptocurrencies Are Created">
                    <p>There are two main ways cryptocurrencies are created:</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-2">1. Native Coins</h3>
                    <p>These are built on their own blockchain (e.g., Bitcoin on Bitcoin, ETH on Ethereum) and require consensus mechanisms like:</p>
                     <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Proof of Work (PoW):</strong> Miners solve cryptographic puzzles (Bitcoin).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Proof of Stake (PoS):</strong> Validators stake coins to secure the network (Ethereum 2.0).</li>
                    </ul>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-2">2. Tokens</h3>
                    <p>Tokens are created on existing blockchains using smart contracts. Popular standards include:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">ERC-20:</strong> Fungible tokens (e.g., USDT, UNI).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">ERC-721 / ERC-1155:</strong> Non-fungible tokens (NFTs).</li>
                    </ul>
                </Section>

                <Section title="Coin vs Token: Key Differences">
                    <p><strong className="font-semibold text-gray-800 dark:text-white">Coin:</strong> A coin operates on its own native blockchain (like Bitcoin or Ethereum). It's primarily used as a currency, for paying transaction (gas) fees, or for staking. Creation requires building a whole new blockchain.</p>
                    <p><strong className="font-semibold text-gray-800 dark:text-white">Token:</strong> A token is built on an existing blockchain (like Uniswap's UNI token on Ethereum). It's created via smart contracts and typically represents a utility, a governance right, or a digital asset (NFT). Its transfer cost is paid in the native coin of the blockchain it resides on.</p>
                </Section>

                <Section title="Usability of Cryptocurrencies">
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Digital Payments:</strong> Fast, borderless transactions.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Store of Value:</strong> Bitcoin as "digital gold."</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Smart Contracts:</strong> Automate agreements and logic.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">NFTs:</strong> Unique digital assets for art, gaming, and identity.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">DAOs:</strong> Decentralized governance structures.</li>
                    </ul>
                </Section>

                <Section title="What Is DeFi (Decentralized Finance)?">
                    <p>DeFi refers to financial services built on blockchain that eliminate traditional intermediaries.</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-2">Core Components:</h3>
                     <ul className="list-disc list-inside space-y-2">
                        <li><strong className="font-semibold text-gray-800 dark:text-white">DEXs (Decentralized Exchanges):</strong> Peer-to-peer trading (Uniswap, PancakeSwap).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Lending/Borrowing Platforms:</strong> Earn interest or borrow crypto (Aave, Compound).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Yield Farming:</strong> Provide liquidity to protocols and earn rewards.</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Stablecoins:</strong> Tokens pegged to a stable asset like the US Dollar (USDC, DAI).</li>
                        <li><strong className="font-semibold text-gray-800 dark:text-white">Synthetic Assets:</strong> Tokens that mirror the value of real-world assets (Synthetix).</li>
                    </ul>
                </Section>
                
                <Section title="Benefits and Risks of DeFi">
                     <h3 className="text-xl font-bold text-green-500 dark:text-green-400 mt-4 mb-2">Benefits:</h3>
                     <ul className="list-disc list-inside space-y-2">
                        <li>Open access to anyone with an internet connection and a wallet.</li>
                        <li>Transparent operations governed by smart contracts.</li>
                        <li>Programmable and composable financial logic.</li>
                    </ul>
                    <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mt-4 mb-2">Risks:</h3>
                     <ul className="list-disc list-inside space-y-2">
                        <li>Smart contract vulnerabilities and bugs can lead to loss of funds.</li>
                        <li>Impermanent loss in liquidity pools.</li>
                        <li>Regulatory uncertainty.</li>
                        <li>Rug pulls and scams.</li>
                    </ul>
                </Section>

                <Section title="Final Thoughts">
                    <p>Understanding the difference between coins and tokens is essential for navigating the crypto ecosystem. DeFi offers powerful tools for financial inclusion, but users must be educated and cautious. This guide lays the foundation for deeper exploration into blockchain-based finance.</p>
                </Section>
                
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-right text-gray-500 italic">
                    <p>Prepared by: Your Professional Blockchain Tutor</p>
                </div>
            </article>
        </div>
    );
};
