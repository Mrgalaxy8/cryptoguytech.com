import React from 'react';
import { FacebookIcon, InstagramIcon, XIcon, WhatsAppIcon } from './icons/SocialIcons';

const socialLinks = [
  { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/Cryptoguy.tech', description: 'Join our community for news and discussions.' },
  { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/cryptoguy.tech/', description: 'Follow us for visual updates and stories.' },
  { name: 'X (Twitter)', icon: XIcon, href: 'https://x.com/cryptoguy476335', description: 'Get real-time updates and join the conversation on X.' },
  { name: 'WhatsApp', icon: WhatsAppIcon, href: 'https://chat.whatsapp.com/ENRVqPrrY4yHxSEW9xH6jn', description: 'Join our community group on WhatsApp.' },
];

const SocialLinkCard: React.FC<{ link: typeof socialLinks[0] }> = ({ link }) => (
    <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-green dark:hover:border-primary-green"
    >
        <link.icon className="w-16 h-16 text-primary-blue dark:text-gray-300 group-hover:text-primary-green transition-colors duration-300" />
        <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary-green transition-colors duration-300">{link.name}</h3>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
    </a>
);


export const CommunityPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-blue dark:text-white">Join Our Community</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Connect with us on social media to stay up-to-date with the latest news, trends, and discussions in the crypto world.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {socialLinks.map(link => (
                    <SocialLinkCard key={link.name} link={link} />
                ))}
            </div>
        </div>
    );
};
