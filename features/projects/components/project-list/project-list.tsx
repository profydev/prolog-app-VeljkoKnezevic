import styled, { keyframes } from "styled-components";
import { breakpoint, color, space } from "@styles/theme";
import { ProjectCard } from "../project-card";
import { useGetProjects } from "../../api/use-get-projects";

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: ${space(6)};

  // reset list styles
  list-style: none;
  padding: 0;
  margin: 0;

  @media (min-width: ${breakpoint("desktop")}) {
    grid-template-columns: repeat(auto-fit, 400px);
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
  margin-top: 121px;
  border-top: 4px solid white;
  border-right: 8px solid purple;
  border-bottom: 4px solid white;
  border-left: 4px solid white;
  background: transparent;
  width: 58px;
  height: 58px;
  border-radius: 50%;
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

export function ProjectList() {
  const { data, isLoading, isError, error } = useGetProjects();

  if (isLoading) {
    return (
      <LoaderContainer>
        <Spinner />
      </LoaderContainer>
    );
  }

  if (isError) {
    console.error(error);
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

  return (
    <List>
      {data?.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </List>
  );
}
