import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { Issue } from '../interfaces/Issue';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getIssueInfo, getIssueComments } from '../hooks/useIssue';
import { timeSince } from '../../helpers';

interface Props {
    issue: Issue;
}

export const IssueItem = ({ issue }: Props) => {

    const navigator = useNavigate();

    const queryClient = useQueryClient();

    const prefetchData = () => {
        queryClient.prefetchQuery({
            queryKey: ["issue", issue.number],
            queryFn: () => getIssueInfo(issue.number)
        });
        queryClient.prefetchQuery({
            queryKey: ["issue", issue.number, "comment"],
            queryFn: () => getIssueComments(issue.number)
        });
    }

    const preSetData = () => {
        queryClient.setQueryData(
            ['issue', issue.number],
            issue,
            {
                updatedAt: new Date().getTime() + 10000
            }
        )
    }

    return (
        <div
            className="card mb-2 issue"
            onClick={() => navigator(`/issues/issue/${issue.number}`)}
            // onMouseEnter={ prefetchData }
            onMouseEnter={ preSetData }
        >
            <div className="card-body d-flex align-items-center">
                
                {
                    issue.state === "open"
                        ? <FiInfo size={30} color="red" />
                        : <FiCheckCircle size={30} color="green" />
                }

                <div className="d-flex flex-column flex-fill px-2">
                    <span>{ issue.title }</span>
                    <span className="issue-subinfo">
                        {
                            `#${issue.number} ${issue.state} ${ timeSince(issue.created_at) } by `}
                        <span className='fw-bold'>
                            {issue.user.login}
                        </span>
                    </span>
                    <div>
                        {
                            issue.labels.map((label) => (
                                <span key={label.id} className="badge rounded-pill m-1 label-color" style={{ backgroundColor: `#${label.color}` }}>
                                    {label.name}
                                </span>
                            ))
                        }
                    </div>
                </div>

                <div className='d-flex align-items-center'>
                    <img src={ issue.user.avatar_url } alt="User Avatar" className="avatar" />
                    <span className='px-2'>
                        {
                            issue.comments
                        }
                    </span>
                    <FiMessageSquare />
                </div>

            </div>
        </div>
    )
}
