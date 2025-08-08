import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Maps from '../pages/Maps';
import Chat from '../pages/Chat';
import Drawings from '../pages/Drawings';
import SDS from '../pages/SDS';
import Videos from '../pages/Videos';
import ChecklistForm from '../components/checklist/ChecklistForm';
import ErrorBoundary from '../components/common/ErrorBoundary';
import AnalysisHistory from '../pages/AnalysisHistory';
import AnalysisViewer from '../pages/AnalysisViewer';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/maps"
        element={
          <PrivateRoute>
            <Maps />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/drawings"
        element={
          <PrivateRoute requiredRole="admin">
            <Drawings />
          </PrivateRoute>
        }
      />
      <Route
        path="/sds"
        element={
          <PrivateRoute>
            <SDS />
          </PrivateRoute>
        }
      />
      <Route
        path="/checklist/:templateId"
        element={
          <ErrorBoundary>
            <PrivateRoute>
              <ChecklistForm />
            </PrivateRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/videos"
        element={
          <PrivateRoute>
            <Videos />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis/:id"
        element={
          <PrivateRoute requiredRole="admin">
            <AnalysisViewer />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute requiredRole="admin">
            <AnalysisHistory />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;