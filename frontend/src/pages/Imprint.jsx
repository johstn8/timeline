import React from 'react';
import websiteInfo from '../../../config/websiteInfo.json';

export default function Imprint() {
    const { owner } = websiteInfo;
    const { name, address, email } = owner;

    const { imprintInfo } = websiteInfo;
    const { imprintNote } = imprintInfo;

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-4">Impressum</h1>
            <p>{name}</p>
            {address && (
                <p>
                    {address.street}<br />
                    {address.postalCode} {address.city}<br />
                    {address.country}
                </p>
            )}
            <p className="mt-2">
                E-Mail: <a href={`mailto:${email}`} className="text-blue-600">{email}</a>
            </p>
            <p className="mt-4 text-sm text-gray-600">{imprintNote}</p>
        </div>
    );
}
