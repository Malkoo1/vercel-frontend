const API_BASE_URL = 'https://api.example.com';

export const fetchDocument = async (documentId) => {
    try {
        // In a real application, you would call an actual API
        // For this example, we'll return mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    document: {
                        id: documentId,
                        title: "Seeds Design Session Optimierung von Prompts für KI (1).pdf",
                        content: {
                            heading: "Ein Hoch auf die Expertise",
                            bulletPoints: [
                                "Eine weitere Möglichkeit mit KI erstellte Bilder aufs nächste zu heben ist die Verwendung von Fachbegriffen im Prompt.",
                                "So können diverse facheinschlägige Beschreibungen dabei helfen, dem Modell diverse Detailinformationen zu vermitteln."
                            ]
                        }
                    },
                    annotations: [
                        {
                            id: 1,
                            x: 350,
                            y: 140,
                            comments: [
                                {
                                    id: 1,
                                    user: "Candice Wu",
                                    avatar: "C",
                                    avatarColor: "bg-orange-500",
                                    text: "Hey team great to get started on this!",
                                    time: "3 hours ago",
                                    edited: false
                                },
                                {
                                    id: 2,
                                    user: "Alex Chen",
                                    avatar: "A",
                                    avatarColor: "bg-blue-500",
                                    text: "Agreed! Looking forward to the collaboration.",
                                    time: "2 hours ago",
                                    edited: false
                                }
                            ]
                        },
                        {
                            id: 2,
                            x: 380,
                            y: 250,
                            comments: [
                                {
                                    id: 3,
                                    user: "Candice Wu",
                                    avatar: "C",
                                    avatarColor: "bg-orange-500",
                                    text: "This section needs more details.",
                                    time: "3 hours ago",
                                    edited: false
                                }
                            ]
                        }
                    ]
                });
            }, 800);
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
};

export const saveAnnotation = async (documentId, annotation) => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...annotation,
                id: Date.now() // Mock ID generation
            });
        }, 300);
    });
};

export const saveComment = async (documentId, annotationId, comment) => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...comment,
                id: Date.now(), // Mock ID generation
                time: "Just now",
                edited: false
            });
        }, 300);
    });
};

export const deleteComment = async (documentId, annotationId, commentId) => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });
};