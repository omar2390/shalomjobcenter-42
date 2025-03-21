
import React, { useState, useEffect } from 'react';
import { TabsContainer } from '@/components/admin/jobs/TabsContainer';
import { JobFormDialog } from '@/components/admin/jobs/JobFormDialog';
import { ListingFormDialog } from '@/components/admin/listings/ListingFormDialog';
import { PageHeader } from '../components/PageHeader';
import { useJobManagement } from '../hooks/useJobManagement';
import { useListingManagement } from '../hooks/useListingManagement';
import { getDomainName } from '../utils/domainUtils';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useJobsService } from '@/services/jobsService';
import { useQueryClient } from '@tanstack/react-query';

export const AdminJobsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const { purgeAllJobs } = useJobsService();
  const queryClient = useQueryClient();
  
  const {
    filteredJobs,
    isLoadingJobs,
    selectedJob,
    isJobDialogOpen,
    setIsJobDialogOpen,
    isEditing: isEditingJob,
    searchTerm: jobSearchTerm,
    setSearchTerm: setJobSearchTerm,
    showExpired,
    setShowExpired,
    domainFilter,
    setDomainFilter,
    handleSaveJob,
    handleUpdateJob,
    handleEditJob,
    handleDeleteJob,
    handleCreateJob,
    handleCancelJob,
    refetchJobs
  } = useJobManagement();

  const {
    filteredListings,
    isLoadingListings,
    selectedListing,
    isListingDialogOpen,
    setIsListingDialogOpen,
    isEditing: isEditingListing,
    searchTerm: listingSearchTerm,
    setSearchTerm: setListingSearchTerm,
    handleSaveListing,
    handleUpdateListing,
    handleEditListing,
    handleDeleteListing,
    handleCreateListing,
    handleCancelListing
  } = useListingManagement();

  // Synchronize search terms between tabs
  useEffect(() => {
    if (activeTab === 'jobs') {
      setListingSearchTerm(jobSearchTerm);
    } else {
      setJobSearchTerm(listingSearchTerm);
    }
  }, [activeTab, jobSearchTerm, listingSearchTerm, setJobSearchTerm, setListingSearchTerm]);

  // Fonction pour supprimer toutes les offres d'emploi
  const handlePurgeAllJobs = () => {
    try {
      purgeAllJobs();
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Toutes les offres d'emploi ont été supprimées");
      refetchJobs();
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes les offres:", error);
      toast.error("Erreur lors de la suppression des offres d'emploi");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <PageHeader 
            activeTab={activeTab}
            itemCount={activeTab === 'jobs' ? filteredJobs.length : filteredListings.length}
            onCreateItem={activeTab === 'jobs' ? handleCreateJob : handleCreateListing}
            exportData={activeTab === 'jobs' ? filteredJobs : filteredListings}
            exportType={activeTab === 'jobs' ? 'jobs' : 'listings'}
          />
          
          {activeTab === 'jobs' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Tout supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va supprimer définitivement toutes les offres d'emploi et ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePurgeAllJobs} className="bg-red-600 hover:bg-red-700">
                    Supprimer tout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <TabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={activeTab === 'jobs' ? jobSearchTerm : listingSearchTerm}
          setSearchTerm={activeTab === 'jobs' ? setJobSearchTerm : setListingSearchTerm}
          showExpired={showExpired}
          setShowExpired={setShowExpired}
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
          getDomainName={getDomainName}
          isLoadingJobs={isLoadingJobs}
          isLoadingListings={isLoadingListings}
          filteredJobs={filteredJobs}
          filteredListings={filteredListings}
          handleEditJob={handleEditJob}
          handleDeleteJob={handleDeleteJob}
          handleEditListing={handleEditListing}
          handleDeleteListing={handleDeleteListing}
          onCreateJob={handleCreateJob}
          onCreateListing={handleCreateListing}
        />
      </div>

      {/* Job Form Dialog */}
      <JobFormDialog
        onSave={isEditingJob ? handleUpdateJob : handleSaveJob}
        selectedJob={selectedJob}
        isEditing={isEditingJob}
        onCancel={handleCancelJob}
        isOpen={isJobDialogOpen}
        setIsOpen={setIsJobDialogOpen}
      />
      
      {/* Listing Form Dialog */}
      <ListingFormDialog
        selectedListing={selectedListing}
        isEditing={isEditingListing}
        onSave={isEditingListing ? handleUpdateListing : handleSaveListing}
        onCancel={handleCancelListing}
        isOpen={isListingDialogOpen}
        setIsOpen={setIsListingDialogOpen}
      />
    </main>
  );
};
