import { useInfiniteQuery } from "@tanstack/react-query"
import { Issue, State } from "../interfaces/Issue";
import { githubApi } from "../../api/githubApi";

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

interface QueryParams {
  pageParam?: number;
  queryKey: (string | Props)[];
}

const getIssues = async ({ pageParam = 1, queryKey }: QueryParams): Promise<Issue[]> => {

  const [, , args] = queryKey;
  const { labels, state } = args as Props;

  const params = new URLSearchParams();
  if (state) params.append('state', state);

  if (labels.length > 0) {
    const label = labels.join(',');
    params.append('labels', label);
  }

  params.append('page', pageParam.toString());
  params.append('per_page', '5');

  const { data } = await githubApi.get<Issue[]>('/issues', { params });
  return data;
}

export const usueIssuesInfinite = ({ state, labels }: Props) => {
  
  const issuesQuery = useInfiniteQuery({
    queryKey: ['issues', 'infinite', { state, labels }],
    queryFn: getIssues,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined; // no more pages to fetch
      return allPages.length + 1; // the next page number
    },
    initialPageParam: 1
  })

  const fetchNextPage = () => {
    issuesQuery.fetchNextPage();
  }

  return {
    //Properties
    issuesQuery,

    //Methods
    fetchNextPage
  }
}
