import React from 'react';
import { Link } from 'react-router-dom';
import websiteInfo from '../../../../config/websiteInfo';

export default function Footer() {
    const { owner } = websiteInfo;
    const { githubUsername } = owner;

    return (
        <footer className="mt-auto w-full border-t border-gray-200 dark:border-gray-700 bg-lightmode_header_footer dark:bg-darkmode_header_footer py-4">            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2 sm:mb-0">
                © {new Date().getFullYear()} Timeline Project
            </p>
            <div className="space-x-4">
                <Link to="/imprint" className="hover:underline">
                    Impressum
                </Link>
                <Link to="/privacy" className="hover:underline">
                    Datenschutz
                </Link>
                <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    GitHub
                </a>
            </div>
        </div>
        </footer>
    );
}
