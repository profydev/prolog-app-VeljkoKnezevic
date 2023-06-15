import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import { breakpoint, color, space, textFont } from "@styles/theme";
import { ProjectLanguage } from "@api/projects.types";
import { useGetProjects } from "@features/projects";
import { useGetIssues } from "../../api/use-get-issues";
import { IssueRow } from "./issue-row";

const Container = styled.div`
  background: white;
  border: 1px solid ${color("gray", 200)};
  box-sizing: border-box;
  box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1),
    0px 2px 4px -2px rgba(16, 24, 40, 0.06);
  border-radius: ${space(2)};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const HeaderRow = styled.tr`
  border-bottom: 1px solid ${color("gray", 200)};
`;

const HeaderCell = styled.th`
  padding: ${space(3, 6)};
  text-align: left;
  color: ${color("gray", 500)};
  ${textFont("xs", "medium")};
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${space(4, 6)};
  border-top: 1px solid ${color("gray", 200)};
`;

const PaginationButton = styled.button`
  height: 38px;
  padding: ${space(0, 4)};
  background: white;
  border: 1px solid ${color("gray", 300)};
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 6px;

  &:not(:first-of-type) {
    margin-left: ${space(3)};
  }
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);

  border-top: 4px solid white;
  border-right: 8px solid purple;
  border-bottom: 4px solid white;
  border-left: 4px solid white;
  background: transparent;
  width: 58px;
  height: 58px;
  border-radius: 50%;
`;

const PageInfo = styled.div`
  color: ${color("gray", 700)};
  ${textFont("sm", "regular")}
`;

const PageNumber = styled.span`
  ${textFont("sm", "medium")}
`;

const ErrorParent = styled.div`
  border: 1px solid #fda29b;
  border-radius: 8px;
  padding-block: 16px;
  display: flex;
  align-items: center;
`;

const ErrorIcon = styled.img`
  margin-inline-end: 13.5px;
  margin-inline-start: 17.5px;
`;

const ErrorText = styled.p`
  color: ${color("error", 700)};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
`;

const ErrorButton = styled.button`
  font-family: "Inter";
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-inline-start: auto;
  margin-inline-end: 20px;
  color: ${color("error", 700)};
  background-color: transparent;
  background-image: url("/icons/button-icon.svg");
  background-repeat: no-repeat;
  background-position: right 50%;
  border: none;
  text-align: start;
  padding: 0;
  min-width: 80px;

  @media (min-width: ${breakpoint("desktop")}) {
    padding-right: 12px;
  }
`;

export function IssueList() {
  const router = useRouter();
  const page = Number(router.query.page || 1);
  const navigateToPage = (newPage: number) =>
    router.push({
      pathname: router.pathname,
      query: { page: newPage },
    });

  const issuesPage = useGetIssues(page);
  const projects = useGetProjects();

  if (projects.isLoading || issuesPage.isLoading) {
    return (
      <LoaderContainer>
        <Spinner />
      </LoaderContainer>
    );
  }

  if (projects.isError) {
    console.error(projects.error);
    return (
      <ErrorParent>
        <ErrorIcon src="/icons/error.svg" />
        <ErrorText>
          There was a problem while loading the project data
        </ErrorText>
        <ErrorButton onClick={useGetProjects}>Try again</ErrorButton>
      </ErrorParent>
    );
  }

  if (issuesPage.isError) {
    console.error(issuesPage.error);
    return (
      <ErrorParent>
        <ErrorIcon src="/icons/error.svg" />
        <ErrorText>
          There was a problem while loading the project data
        </ErrorText>
        <ErrorButton onClick={useGetProjects}>Try again</ErrorButton>
      </ErrorParent>
    );
  }

  const projectIdToLanguage = (projects.data || []).reduce(
    (prev, project) => ({
      ...prev,
      [project.id]: project.language,
    }),
    {} as Record<string, ProjectLanguage>
  );
  const { items, meta } = issuesPage.data || {};

  return (
    <Container>
      <Table>
        <thead>
          <HeaderRow>
            <HeaderCell>Issue</HeaderCell>
            <HeaderCell>Level</HeaderCell>
            <HeaderCell>Events</HeaderCell>
            <HeaderCell>Users</HeaderCell>
          </HeaderRow>
        </thead>
        <tbody>
          {(items || []).map((issue) => {
            console.log(issue);

            return (
              <IssueRow
                key={issue.id}
                issue={issue}
                projectLanguage={projectIdToLanguage[issue.projectId]}
              />
            );
          })}
        </tbody>
      </Table>
      <PaginationContainer>
        <div>
          <PaginationButton
            onClick={() => navigateToPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </PaginationButton>
          <PaginationButton
            onClick={() => navigateToPage(page + 1)}
            disabled={page === meta?.totalPages}
          >
            Next
          </PaginationButton>
        </div>
        <PageInfo>
          Page <PageNumber>{meta?.currentPage}</PageNumber> of{" "}
          <PageNumber>{meta?.totalPages}</PageNumber>
        </PageInfo>
      </PaginationContainer>
    </Container>
  );
}
