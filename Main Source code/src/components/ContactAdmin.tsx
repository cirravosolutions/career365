import React from 'react';

const ContactAdmin: React.FC = () => {
    const PLACEMENT_OFFICER_EMAIL = "info@career365.co.in";
    const SITE_ADMIN_EMAIL = "cirravosolutions@gmail.com";

    return (
        <div className="text-center md:text-left">
            <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">Contact</h4>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
                 <div className="flex items-center">
                    <span className="font-medium mr-2">Placement Officer:</span>
                    <a href={`mailto:${PLACEMENT_OFFICER_EMAIL}`} className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-blue-400 transition-colors">{PLACEMENT_OFFICER_EMAIL}</a>
                </div>
                 <div className="flex items-center">
                    <span className="font-medium mr-2">Site Admin:</span>
                    <a href={`mailto:${SITE_ADMIN_EMAIL}`} className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-blue-400 transition-colors">{SITE_ADMIN_EMAIL}</a>
                </div>
            </div>
        </div>
    );
};

export default ContactAdmin;