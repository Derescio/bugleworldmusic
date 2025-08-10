'use client';

import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import MusicManagement from './components/MusicManagement';

export default function AdminDashboard() {
  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your music catalog, merchandise, and digital content.
          </p>
        </div>
      </div>

      <Tabs defaultValue="music" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="music" className="flex items-center gap-2">
            <span>♪</span>
            Music
          </TabsTrigger>
          <TabsTrigger value="merch" className="flex items-center gap-2">
            <span>🛍️</span>
            Merchandise
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-2">
            <span>📄</span>
            Digital Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="space-y-6">
          <MusicManagement />
        </TabsContent>

        <TabsContent value="merch" className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Merchandise Management</h3>
              <p className="text-gray-500 mb-6">Create and manage your merchandise catalog</p>
              <Button disabled>Coming Soon - Create Merch</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Digital Files Management</h3>
              <p className="text-gray-500 mb-6">
                Upload and manage PDF files, digital downloads, and other documents
              </p>
              <Button disabled>Coming Soon - Upload PDFs</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
