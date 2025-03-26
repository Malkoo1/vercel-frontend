import { useOutletContext } from "react-router-dom";
import FileTable from '../../components/FileTable';

const AdminDashboard = () => {
    const layoutContext = useOutletContext();
    const { files } = layoutContext;
    // const [searchTerm, setSearchTerm] = useState('');
    // const [selectedFiles, setSelectedFiles] = useState(new Set());

    // const files = [
    //     {
    //         id: 1,
    //         name: "In-app-content.JPG",
    //         type: "jpg",
    //         description: "",
    //         date: "January 8, 2023",
    //         size: "12.5 MB",
    //         versions: [
    //             { id: 101, name: "In-app-content_v1.JPG", date: "January 5, 2023", size: "12.0 MB" },
    //             { id: 102, name: "In-app-content_draft.JPG", date: "January 3, 2023", size: "11.8 MB" }
    //         ]
    //     },
    //     {
    //         id: 2,
    //         name: "New Versions .JPG",
    //         type: "jpg",
    //         description: "I love to see this....",
    //         date: "January 8, 2023",
    //         size: "12.5 MB",
    //         versions: [
    //             { id: 201, name: "New Versions_backup.JPG", date: "January 7, 2023", size: "12.2 MB" },
    //             { id: 202, name: "New Versions_old.JPG", date: "January 6, 2023", size: "11.9 MB" }
    //         ]
    //     },
    //     { id: 3, name: "New Versions 2 .JPG", type: "jpg", description: "", date: "", size: "" },
    //     {
    //         id: 4,
    //         name: "style_guide.docx",
    //         type: "docx",
    //         description: "I love to see this....",
    //         date: "January 8, 2023",
    //         size: "12.5 MB",
    //         versions: [
    //             { id: 401, name: "style_guide_v2.docx", date: "January 7, 2023", size: "12.3 MB" },
    //             { id: 402, name: "style_guide_draft.docx", date: "January 5, 2023", size: "11.7 MB" }
    //         ]
    //     },
    //     { id: 5, name: "design_reviews_summary.doc", type: "doc", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 6, name: "color_palette.xlsx", type: "xlsx", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 7, name: "design_specs.pptx", type: "pptx", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 8, name: "final_mockup.psd", type: "psd", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 9, name: "UI_patterns_library.ai", type: "ai", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 10, name: "wireframe_sketches.jpg", type: "jpg", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 11, name: "icon_set.jpg", type: "jpg", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    //     { id: 12, name: "user_flow_chart.pdf", type: "pdf", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    // ];



    // const toggleFileSelection = (fileId) => {
    //     const newSelection = new Set(selectedFiles);
    //     if (selectedFiles.has(fileId)) {
    //         newSelection.delete(fileId);
    //     } else {
    //         newSelection.add(fileId);
    //     }
    //     setSelectedFiles(newSelection);
    // };

    // const filteredFiles = files.filter(file =>
    //     file.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto bg-white">
            <FileTable files={files} />
            {/* <FileTable files={filteredFiles} selectedFiles={selectedFiles} toggleFileSelection={toggleFileSelection} /> */}
        </div>
    );
};

export default AdminDashboard;