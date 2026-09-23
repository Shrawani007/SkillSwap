import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Browse from "@/pages/Browse";
import Requests from "@/pages/Requests";
import Chat from "@/pages/Chat";
import Resources from "@/pages/Resources";
import ProfileView from "@/pages/ProfileView";
import ProfileEdit from "@/pages/ProfileEdit";
import NotFound from "@/pages/NotFound";
import ResourceViewer from "@/pages/ResourceViewer.tsx";
import SharedResources from "@/pages/SharedResources.tsx";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/viewer/:id" element={<ResourceViewer />} />
            <Route path="/shared-resources/:ownerId" element={<SharedResources />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
