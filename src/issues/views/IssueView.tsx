import { Link, Navigate, useParams } from 'react-router-dom';

import { IssueComment } from '../components/IssueComment';
import LoadingIcon from '../../shared/components/LoadingIcon';

import useIssue from '../hooks/useIssue';

export const IssueView = () => {

  const params = useParams();
  const { id = 0 } = params;

  const { issueQuery, commentsQuery } = useIssue(+id);
  
  if (issueQuery.isLoading) 
    return <LoadingIcon />
  
  if (commentsQuery.isLoading)
    return <LoadingIcon />
  
  if (!issueQuery.data) 
    return <Navigate to={"./issues/list"} />
  
  if (!commentsQuery.data) 
    return <Navigate to={"./issues/list"} />
    
  return (
    <div className="row mb-5">
      <div className="col-12 mb-3">
        <Link to='./issues/list'>Go Back</Link>
      </div>

      {/* Primer comentario */}
      <IssueComment issue={ issueQuery.data }/>

      {/* Comentario de otros */}

      {
        commentsQuery.data.map((comment) => (
          <IssueComment key={ issueQuery.data.id } issue={comment} />
        ))
      }
    </div>
  )
}
