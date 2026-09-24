import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "../types/project";
import type { ProjectsContent } from "../types/projects";
import { useDiscovery } from "@/analytics";
import { ProjectDetail } from "./project-detail";

vi.mock("@/analytics", () => ({
  useDiscovery: vi.fn(() => ({ current: null })),
}));
vi.mock("@/features/specs/components/technology", () => ({
  TechnologyIcon: ({ name }: { name: string }) => (
    <span data-testid="technology-icon">{name}</span>
  ),
}));
vi.mock("./project-media", () => ({
  ProjectMedia: ({ media, priority }: {
    media: { src: string; alt: string };
    priority?: boolean;
  }) => (
    <div data-testid="project-media" data-src={media.src} data-priority={String(priority)}>
      {media.alt}
    </div>
  ),
}));

const labels: ProjectsContent["labels"] = {
  featured: "Featured",
  viewProject: "View project",
  started: "Started",
  overview: "Overview",
  problem: "Problem",
  architecture: "Architecture",
  capabilities: "Capabilities",
  engineering: "Engineering",
  challenges: "Challenges",
  lessons: "Lessons",
  roadmap: "Roadmap",
  technology: "Technology",
  links: "Links",
};

const project: Project = {
  slug: "argus",
  title: "Argus cockpit",
  tagline: "Operational visibility",
  summary: "A digital systems cockpit.",
  category: "Developer tools",
  status: "In development",
  overview: ["Overview paragraph one", "Overview paragraph two"],
  technologies: [
    { name: "Rust", purpose: "Core implementation" },
    { name: "React", purpose: "Interface" },
  ],
};

describe("ProjectDetail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the required project information and overview", () => {
    render(<ProjectDetail project={project} labels={labels} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Argus cockpit" })).toBeInTheDocument();
    expect(screen.getByText("Developer tools")).toBeInTheDocument();
    expect(screen.getByText("Operational visibility")).toBeInTheDocument();
    expect(screen.getByText("A digital systems cockpit.")).toBeInTheDocument();
    expect(screen.getByText("In development")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Overview paragraph one")).toBeInTheDocument();
    expect(screen.getByText("Overview paragraph two")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Core implementation")).toBeInTheDocument();
    expect(screen.getByText("Interface")).toBeInTheDocument();
    expect(screen.getAllByTestId("technology-icon")).toHaveLength(2);
    expect(useDiscovery).not.toHaveBeenCalled();
  });

  it("omits optional sections, media, and start date when absent", () => {
    render(<ProjectDetail project={project} labels={labels} />);

    for (const heading of [
      "Problem", "Architecture", "Capabilities", "Engineering",
      "Challenges", "Lessons", "Roadmap",
    ]) {
      expect(screen.queryByText(heading)).not.toBeInTheDocument();
    }
    expect(screen.queryByText(/Started/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("project-media")).not.toBeInTheDocument();
  });

  it("renders every optional section and all its items", () => {
    const complete: Project = {
      ...project,
      started: 2026,
      problem: ["Problem one", "Problem two"],
      architecture: ["Architecture one", "Architecture two"],
      capabilities: ["Capability one", "Capability two"],
      engineering: ["Engineering one"],
      challenges: ["Challenge one"],
      lessons: ["Lesson one"],
      roadmap: ["Roadmap one"],
    };

    render(<ProjectDetail project={complete} labels={labels} />);

    expect(screen.getByText("Started 2026")).toBeInTheDocument();
    for (const text of [
      "Problem one", "Problem two",
      "Architecture one", "Architecture two",
      "Capability one", "Capability two",
      "Engineering one", "Challenge one", "Lesson one", "Roadmap one",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    for (const heading of [
      "Problem", "Architecture", "Capabilities", "Engineering",
      "Challenges", "Lessons", "Roadmap",
    ]) {
      expect(screen.getByText(heading)).toBeInTheDocument();
    }
    expect(useDiscovery).toHaveBeenCalledTimes(6);
    expect(useDiscovery).toHaveBeenCalledWith({
      type: "capability_discovery",
      target: "project-capabilities",
    });
    expect(useDiscovery).toHaveBeenCalledWith({
      type: "capability_discovery",
      target: "",
    });
  });

  it("renders only the first media item with priority enabled", () => {
    render(
      <ProjectDetail
        project={{
          ...project,
          media: [
            { src: "/first.webp", alt: "First preview" },
            { src: "/second.webp", alt: "Second preview" },
          ],
        }}
        labels={labels}
      />,
    );

    const media = screen.getByTestId("project-media");
    expect(media).toHaveAttribute("data-src", "/first.webp");
    expect(media).toHaveAttribute("data-priority", "true");
    expect(media).toHaveTextContent("First preview");
    expect(screen.queryByText("Second preview")).not.toBeInTheDocument();
  });

  it("handles empty overview and technology collections", () => {
    render(
      <ProjectDetail
        project={{ ...project, overview: [], technologies: [] }}
        labels={labels}
      />,
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.queryByTestId("technology-icon")).not.toBeInTheDocument();
  });
});
