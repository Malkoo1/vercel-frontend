// src/layouts/MainLayout.jsx


import { Outlet } from "react-router-dom";
import { DocumentProvider } from '../context/DocumentContext';
const MainLayout = () => {



    return (
        <DocumentProvider> {/* Wrap the layout with DocumentProvider */}

            <Outlet />
        </DocumentProvider>
    );
};

export default MainLayout;
