import { useState } from 'react';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import LoadingIcon from '../../shared/components/LoadingIcon';
import { Issue, State } from '../interfaces/Issue';
import {usueIssuesInfinite} from '../hooks/usueIssuesInfinite';


export const ListViewInfinite = () => {

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [state, setState] = useState<State>();

  const { issuesQuery } = usueIssuesInfinite({ state, labels: selectedLabels });
  
  const onLabelChange = (labelName: string) => {
    (selectedLabels.includes(labelName))
      ? setSelectedLabels( selectedLabels.filter( label => label !== labelName ) )
      : setSelectedLabels([...selectedLabels, labelName]);
  }

  return (
    <div className="row mt-5">
      
      <div className="col-8">
        {
          issuesQuery.isLoading
            ? (<LoadingIcon />)
            : (
              <IssueList
                issues={issuesQuery.data!.pages.flat() as Issue[] || []}
                state={state}
                onStateChange={ ( newState ) => setState( newState ) }
              />
            )
        }

        <button
          className='btn btn-outline-primary mt-2 mb-4'
          onClick={() => issuesQuery.fetchNextPage() }
          disabled={ !issuesQuery.hasNextPage }
        >
          Load more...
        </button>
      </div>
      
      <div className="col-4">
        <LabelPicker
          selectedLabels={selectedLabels}
          onChange={ (labelName) => onLabelChange(labelName) }
        />
      </div>
    </div>
  )
}
