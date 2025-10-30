import React from 'react';
import { FacebookIcon, InstagramIcon, XIcon, WhatsAppIcon } from './icons/SocialIcons';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-green transition-colors duration-200">
        {children}
    </a>
);

export const Footer: React.FC = () => {
    return (
        <footer className="bg-primary-blue text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">CryptoGuy<span className="text-primary-green">TECH</span></h3>
                        <p className="text-sm text-gray-400">Learn, Track & Grow in the Crypto World.</p>
                        <div className="flex space-x-4 mt-6">
                            <SocialIcon href="https://www.facebook.com/Cryptoguy.tech">
                                <FacebookIcon className="w-6 h-6" />
                            </SocialIcon>
                            <SocialIcon href="https://www.instagram.com/cryptoguy.tech/">
                                <InstagramIcon className="w-6 h-6" />
                            </SocialIcon>
                            <SocialIcon href="https://x.com/cryptoguy476335">
                                <XIcon className="w-6 h-6" />
                            </SocialIcon>
                            <SocialIcon href="https://wa.me/254701476026">
                                <WhatsAppIcon className="w-6 h-6" />
                            </SocialIcon>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4">Sign up for our newsletter to get the latest crypto news and updates. <span className="font-bold text-primary-green">Coming Soon!</span></p>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input type="email" placeholder="Enter your email" disabled className="flex-grow w-full px-4 py-2 rounded-md bg-dark-card border border-gray-600 text-gray-500 cursor-not-allowed focus:outline-none" />
                        </form>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} CryptoGuyTECH. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <a href="#" className="hover:text-white">Terms of Use</a>
                        <span>&middot;</span>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};