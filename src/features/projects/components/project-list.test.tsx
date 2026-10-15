import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "../types/project";
import type { ProjectsContent } from "../types/projects";
import { trackProjectOpen } from "@/analytics";
import { ProjectList } from "./project-list";

vi.mock("@/analytics", () => ({ trackProjectOpen: vi.fn() }));

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
  featured: true,
  overview: ["Overview text"],
  technologies: [
    { name: "Rust", purpose: "Core" },
    { name: "TypeScript", purpose: "Web" },
    { name: "React", purpose: "UI" },
    { name: "Next.js", purpose: "Routing" },
    { name: "Supabase", purpose: "Data" },
    { name: "Cloudflare", purpose: "Infrastructure" },
  ],
};

describe("ProjectList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders an empty grid without project links", () => {
    const { container } = render(
      <ProjectList projects={[]} locale="en" labels={labels} />,
    );
    expect(container.querySelector(".grid")).not.toBeNull();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it.each([
    ["en", "/projects/argus"],
    ["de", "/de/projects/argus"],
    ["hu", "/hu/projects/argus"],
  ] as const)("renders the project link for %s", (locale, href) => {
    render(<ProjectList projects={[project]} locale={locale} labels={labels} />);

    const link = screen.getByRole("link", { name: /Argus cockpit/ });
    expect(link).toHaveAttribute("href", href);
    expect(screen.getByRole("heading", { name: "Argus cockpit" })).toBeInTheDocument();
    expect(screen.getByText("A digital systems cockpit.")).toBeInTheDocument();
    expect(screen.getByText("In development")).toBeInTheDocument();
    expect(screen.getByText(/View project/)).toBeInTheDocument();

    fireEvent.click(link);
    expect(trackProjectOpen).toHaveBeenCalledExactlyOnceWith("argus");
  });


  it("renders projects without optional metadata", () => {
    render(
      <ProjectList
        projects={[{ ...project, featured: false, technologies: [] }]}
        locale="en"
        labels={labels}
      />,
    );
    expect(screen.getByRole("link", { name: /Argus cockpit/ })).toBeInTheDocument();
  });

  it("renders and tracks each project independently", () => {
    const second = {
      ...project,
      slug: "human50",
      title: "Human50",
      featured: false,
    };
    render(
      <ProjectList projects={[project, second]} locale="en" labels={labels} />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    fireEvent.click(screen.getByRole("link", { name: /Human50/ }));
    expect(trackProjectOpen).toHaveBeenCalledExactlyOnceWith("human50");
  });
});
