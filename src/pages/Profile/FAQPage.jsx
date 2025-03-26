import React, { useState } from 'react';
function FAQPage() {
    const [openFaq, setOpenFaq] = useState(0);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I create a new project in the tool?",
            answer: "To create a new project, simply log in, navigate to the dashboard, and click on the \"New Project\" button. Fill in the required details, and your project will be ready to go."
        },
        {
            question: "Can I invite team members to collaborate on my project?",
            answer: "Yes, you can invite team members to collaborate on your projects. Navigate to your project settings, find the 'Team Members' section, and use the invite feature to add collaborators."
        },
        {
            question: "Is there a way to track task progress within the tool?",
            answer: "Yes, our tool provides comprehensive task tracking features. You can view progress bars, completion percentages, and status updates for all tasks within your projects."
        },
        {
            question: "How can I customize the notifications I receive from the project management tool?",
            answer: "You can customize notifications in your account settings. Navigate to the 'Notifications' tab where you can select which types of updates you want to receive and how you want to receive them (email, in-app, etc.)."
        },
        {
            question: "What security measures are in place to protect my project data?",
            answer: "We implement industry-standard security measures including end-to-end encryption, regular security audits, and role-based access controls to ensure your project data remains secure and private."
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="bg-gray-100 p-6 rounded-md">
                <div className="text-sm text-red-400 mb-2">Support</div>
                <h1 className="text-2xl font-bold mb-2">Top questions about Agile Atlas</h1>
                <p className="text-gray-500 mb-6">Need something cleared up? Here are our most frequently asked questions.</p>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full p-3 pl-10 rounded-md border border-gray-200"
                    />
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h2 className="text-2xl font-bold mb-4">FAQs</h2>
                    <p className="text-gray-500">
                        Everything you need to know about the product and billing. Can't find the answer you're looking for? Please chat to our team.
                    </p>
                </div>

                <div className="md:col-span-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4 border rounded-md overflow-hidden">
                            <div
                                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                                onClick={() => toggleFaq(index)}
                            >
                                <h3 className="font-medium">{faq.question}</h3>
                                <button className="text-gray-500">
                                    {openFaq === index ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {openFaq === index && (
                                <div className="p-4 bg-white">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default FAQPage;