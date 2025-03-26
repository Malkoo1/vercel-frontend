import * as Toast from '@radix-ui/react-toast';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

const toastTypes = {
    success: { icon: <CheckCircle className="text-green-500 w-5 h-5" />, bg: "border-green-500" },
    info: { icon: <Info className="text-blue-500 w-5 h-5" />, bg: "border-blue-500" },
    warning: { icon: <AlertTriangle className="text-yellow-500 w-5 h-5" />, bg: "border-yellow-500" },
    danger: { icon: <AlertCircle className="text-red-500 w-5 h-5" />, bg: "border-red-500" }
};

const CustomToast = ({ message, type = "info" }) => {
    const [open, setOpen] = useState(true);
    const { icon, bg } = toastTypes[type] || toastTypes.info; // Default to "info" if type is missing

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root open={open} onOpenChange={setOpen} asChild>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed bottom-4 right-4 flex items-center gap-3 bg-white shadow-lg border-l-4 ${bg} p-4 rounded-lg`}
                >
                    {icon}
                    <div className="flex-1">
                        <Toast.Title className="font-bold capitalize">{type}</Toast.Title>
                        <Toast.Description className="text-sm text-gray-700">{message}</Toast.Description>
                    </div>
                    <Toast.Action asChild altText="Close">
                        <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">
                            <X className="w-4 h-4" />
                        </button>
                    </Toast.Action>
                </motion.div>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
        </Toast.Provider>
    );
};

export default CustomToast;
