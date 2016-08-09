import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from './ResourceForm';

const Edit = ({ params: { resourceNameSingular, resourceId }, location: { query } }) => {
  return (

    <div className="admin-edit">
      <h1>Edit {capitalize(resourceNameSingular)} {resourceId}</h1>

      {/* TODO: EDIT FORM GOES HERE must receive formName, submitUrl, resourceType (in order to get form fields), context: (edit, or create) */}
      <ResourceForm 
        formName={resourceNameSingular + 'Form'} 
        submitUrl={resourceNameSingular + '/' + resourceId + '/update'}
        resourceType={resourceNameSingular}
        context='edit'
      />
    </div>
  );
};
export default Edit;