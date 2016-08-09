import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from './ResourceForm';

const New = ({ params: { resourceNameSingular }, location: { query } }) => {
  return (
    <div className="admin-edit">
      <h1>New {capitalize(resourceNameSingular)}</h1>

      {/* TODO: EDIT FORM GOES HERE must receive formName, submitUrl, resourceType (in order to get form fields), context: (edit, or create) */}
      <ResourceForm 
        formName={resourceNameSingular + 'Form'} 
        submitUrl={resourceNameSingular +'/new'}
        resourceType={resourceNameSingular}
        context='new'
      />
    </div>
  );
};
export default New;