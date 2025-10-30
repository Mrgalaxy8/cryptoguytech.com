import React from 'react';

interface BitcoinCoursePageProps {
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

export const BitcoinCoursePage: React.FC<BitcoinCoursePageProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <button
                onClick={onBack}
                className="mb-8 text-primary-green hover:text-green-400 transition-colors"
            >
                &larr; Back to Academy
            </button>

            <article className="bg-dark-card p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-black text-white mb-6">Fundamentals and Basics of Bitcoin</h1>
                <p className="text-gray-400 mb-10 text-lg">
                    Bitcoin is the first decentralized digital currency that operates without a central authority or intermediaries. It was introduced in 2008 by the pseudonymous Satoshi Nakamoto through a whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System." Bitcoin's core innovation is the blockchain—a secure, distributed ledger that records all transactions transparently across a network.
                </p>

                <Section title="1. Creation and Concept">
                    <p>Bitcoin emerged after the 2008 global financial crisis, which exposed weaknesses in centralized banking. Nakamoto aimed to create a digital currency that allowed peer-to-peer transactions without intermediaries. In January 2009, the Bitcoin network launched, and the first transaction occurred between Nakamoto and Hal Finney.</p>
                    <p><strong className="text-green-400">Real-Life Explanation:</strong> Think of the 2008 crisis where banks failed, and people lost trust in the traditional financial system. Bitcoin was born from this distrust, offering a way to transact directly with others without needing a bank to approve or process the payment. The very first transaction was a simple test, but it proved that the system worked.</p>
                </Section>

                <Section title="2. How Bitcoin Works">
                    <p>Bitcoin runs on a blockchain, which is a chain of blocks containing transaction data. Each block is linked to the previous one using cryptographic hashes, ensuring that past records cannot be altered. Miners use computational power to validate transactions and secure the network through Proof of Work (PoW). For their effort, miners earn new bitcoins as rewards, maintaining both network integrity and coin issuance.</p>
                    <p><strong className="text-green-400">Real-Life Explanation:</strong> Imagine a digital public notebook that is copied across thousands of computers worldwide. When a transaction happens, it's written on a new page. To add this page, "miners" compete to solve a complex math puzzle. The winner adds the page and gets rewarded with new bitcoin. Because everyone has a copy of the notebook, it's nearly impossible to cheat or change past entries, making it incredibly secure.</p>
                </Section>

                <Section title="3. Bitcoin Supply and Halving">
                    <p>Bitcoin's supply is capped at 21 million coins, introducing scarcity similar to precious metals like gold. Every four years, the reward given to miners halves in an event known as “Bitcoin Halving." This deflationary mechanism ensures a controlled supply, reducing inflation over time and increasing demand.</p>
                    <p><strong className="text-green-400">Real-Life Explanation:</strong> Unlike traditional currencies which governments can print indefinitely (potentially causing inflation), Bitcoin has a fixed limit. The "Halving" event is like if the amount of gold that could be mined was cut in half every four years. This scarcity is a key reason why some people consider Bitcoin "digital gold" and a store of value.</p>
                </Section>

                <Section title="4. Bitcoin Wallets and Transactions">
                    <p>Bitcoin users interact through digital wallets. Each wallet contains a public key, like an account number, and a private key, which is used to sign transactions securely. When transactions occur, they are broadcast to the network, verified by miners, and permanently added to the blockchain. This process ensures decentralization, transparency, and security.</p>
                     <p><strong className="text-green-400">Real-Life Explanation:</strong> A public key is like your email address; you can share it with anyone to receive Bitcoin. Your private key is like your email password; it proves you own the bitcoins and must be kept secret. If you lose your private key, you lose access to your funds forever. </p>
                </Section>
                
                <Section title="5. Usability and Real-World Applications">
                    <p>Bitcoin has evolved beyond a digital experiment into a recognized financial asset. It is used for remittances, online payments, and as a hedge against inflation. Companies like Tesla, PayPal, and Overstock have integrated Bitcoin payments, while nations like El Salvador adopted it as legal tender. Its borderless and censorship-resistant nature makes it valuable globally.</p>
                    <p><strong className="text-green-400">Real-Life Explanation:</strong> You can use Bitcoin to send money to family in another country with lower fees than traditional banks. Some online stores accept it as payment. In El Salvador, you can even buy a coffee with Bitcoin. It provides a financial alternative, especially in countries with unstable currencies.</p>
                </Section>

                <Section title="6. Risks and Challenges">
                    <p>Bitcoin's volatility remains its biggest challenge. Prices fluctuate significantly, making it difficult to use as stable money. Additionally, regulatory uncertainty and environmental concerns about mining energy usage persist. However, innovations like the Lightning Network aim to improve scalability and transaction speed while reducing energy consumption.</p>
                    <p><strong className="text-red-400">Real-Life Explanation:</strong> Volatility means the value of your Bitcoin can change dramatically in a short time. The pizza you bought for 10,000 BTC in 2010 would be worth hundreds of millions of dollars today! This makes it risky for daily use as money, but also presents an opportunity for investment.</p>
                </Section>
                
                <Section title="Conclusion">
                    <p>Bitcoin has revolutionized how the world perceives money and financial independence. It offers a decentralized, transparent, and borderless system where individuals control their own assets. Understanding its creation, blockchain foundation, supply mechanism, and usability is key to appreciating how Bitcoin continues to reshape global finance.</p>
                </Section>

                <div className="mt-12 pt-6 border-t border-gray-700 text-right text-gray-500 italic">
                    <p>Prepared by: Your Professional Blockchain Tutor</p>
                </div>
            </article>
        </div>
    );
};