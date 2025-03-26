import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DocumentReviewAdmin from "../../components/DocumentReviewAdmin";
import DocumentReviewInterface from "../../components/DocumentReviewInterface";
import { fetchUserData } from "../../services/api";

function DashboardPage() {
  const { documentId } = useParams();
  const [userRole, setUserRole] = useState(null); // State to store user role

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await fetchUserData(); // Fetch user data
        setUserRole(user.role); // Set the user's role
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("guest"); // Default to guest if there's an error
      }
    };

    fetchRole(); // Fetch the user's role when the component mounts
  }, []);

  return (
    <div>
      {/* Conditionally render based on user role */}
      {userRole === "admin" ? (
        <DocumentReviewAdmin documentId={documentId} />
      ) : (
        <DocumentReviewInterface documentId={documentId} />
      )}
    </div>
  );
}

export default DashboardPage;
