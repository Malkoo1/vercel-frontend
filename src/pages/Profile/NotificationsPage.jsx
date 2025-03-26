import { ChevronDown, MoreVertical } from 'lucide-react';
import { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';

function NotificationsPage() {
    const { filters, sortBy } = useContext(NotificationContext);

    // Notifications data
    const notifications = [
        {
            id: 1,
            type: 'task_assigned',
            title: 'Task Assigned',
            message: 'John has assigned you a new task titled "Market Research for Product Launch." Please review the details and get started.',
            time: '6 min ago',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop',
            unread: true,
            timestamp: new Date('2024-03-10T10:00:00')
        },
        // Add more notifications here
    ];

    // Filter and sort notifications
    const filteredNotifications = notifications
        .filter(notification => {
            if (filters.unreadOnly && !notification.unread) return false;
            return filters.types[notification.type];
        })
        .sort((a, b) => {
            return sortBy === 'newest'
                ? b.timestamp.getTime() - a.timestamp.getTime()
                : a.timestamp.getTime() - b.timestamp.getTime();
        });

    // Split notifications into sections
    const earlierNotifications = filteredNotifications.slice(0, 3);
    const olderNotifications = filteredNotifications.slice(3);

    return (
        <div className="p-8">
            {/* Notifications List */}
            <div className="space-y-6">
                {/* Earlier this month section */}
                <div>
                    <button
                        className="w-full flex items-center justify-between text-gray-900 font-medium mb-4"
                        onClick={() => setExpandedSection(expandedSection === 'earlier' ? '' : 'earlier')}
                    >
                        <span>Earlier this month</span>
                        <ChevronDown size={16} />
                    </button>
                    {earlierNotifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>

                {/* 2023 section */}
                <div>
                    <button
                        className="w-full flex items-center justify-between text-gray-900 font-medium mb-4"
                        onClick={() => setExpandedSection(expandedSection === '2023' ? '' : '2023')}
                    >
                        <span>2023</span>
                        <ChevronDown size={16} />
                    </button>
                    {olderNotifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Notification Item Component
function NotificationItem({ notification }) {
    return (
        <div className="bg-white rounded-xl p-4 flex items-start gap-4 shadow-sm">
            {notification.avatar ? (
                <img src={notification.avatar} alt="" className="w-10 h-10 rounded-full" />
            ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">📅</span>
                </div>
            )}
            <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                            {notification.title}
                            {notification.unread && (
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">{notification.time}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationsPage;