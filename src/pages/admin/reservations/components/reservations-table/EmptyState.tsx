
import React from 'react';
import { Calendar } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <div className="mb-4 text-gray-400">
        <Calendar className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune réservation trouvée</h3>
      <p className="text-gray-500">Il n'y a pas de réservations enregistrées ou correspondant à vos critères.</p>
      <p className="text-gray-500 text-sm mt-2">Les réservations seront affichées ici une fois qu'elles sont créées.</p>
    </div>
  );
};

export default EmptyState;
