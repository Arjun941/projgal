"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Github } from "lucide-react";
import Papa from "papaparse";
import { format, parse, isValid } from "date-fns";
import Head from "next/head";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1xJm8JnKXbzGdFalzKBzHjvN8cou-4fIa5jH7IbC1dWE/pub?output=csv";
const GOOGLE_PROJECT_FORM_URL =
  "https://docs.google.com/forms/d/1ujCN1QEKRu64f9Sub2ZzqoUWXPf0B33N8Nop0PnjvTE/viewform?edit_requested=true&fbzx=-1925584451870821221";

// Dummy project data
const dummyProject = {
  id: 0,
  title: "EcoTrack: Campus Sustainability Monitor",
  description:
    "EcoTrack is an IoT-based system that monitors and visualizes real-time energy consumption, waste management, and carbon emissions across our college campus. It uses a network of sensors to collect data, which is then processed and displayed on an interactive dashboard. The project aims to raise awareness about sustainability and drive behavioral changes among students and staff.",
  author: "Alex Chen",
  imageUrl:
    "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  timestamp: new Date().toISOString(),
  tags: ["IoT", "Sustainability", "Data Visualization"],
  feedbackFormUrl: "https://forms.gle/exampleFeedbackForm",
  githubRepoUrl: "https://github.com/example/ecotrack",
};

export default function StudentProjectHub() {
  const [projects, setProjects] = useState([dummyProject]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const parsedProjects = results.data
          .filter(
            (row: any) =>
              row["Project Title"] && row["Project Title"].trim() !== ""
          )
          .map((row: any, index) => ({
            id: index + 1,
            title: row["Project Title"] || "",
            description: row["Project Description"] || "",
            author: row["Author Name"] || "",
            imageUrl: row["Image URL"] || "",
            tags: row["Project Tags"]
              ? row["Project Tags"].split(",").map((tag: string) => tag.trim())
              : [],
            feedbackFormUrl: row["Feedback Form URL (optional)"] || null,
            githubRepoUrl: row["GitHub Repo URL"] || null,
            timestamp: row["Timestamp"] || "",
          }));
        setProjects([dummyProject, ...parsedProjects]);
      },
      error: (error) => {
        console.error("Error fetching projects:", error);
      },
    });
  };

  const openProjectSubmissionForm = () => {
    window.open(GOOGLE_PROJECT_FORM_URL, "_blank");
  };

  const openFeedbackForm = (project: any) => {
    if (project.feedbackFormUrl) {
      window.open(project.feedbackFormUrl, "_blank");
    } else {
      alert("No feedback form available for this project.");
    }
  };

  const openGithubRepo = (project: any) => {
    if (project.githubRepoUrl) {
      window.open(project.githubRepoUrl, "_blank");
    } else {
      alert("No GitHub repository available for this project.");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>UCEK Project Hub</title>
        <meta
          name="description"
          content="Explore and showcase projects from UCEK students."
        />
      </Head>

      <h1 className="text-3xl font-bold mb-6">UCEK Project Hub</h1>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={openProjectSubmissionForm}
          className="transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Submit New Project
        </Button>
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search projects by name, author, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No projects found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg animate-fade-in"
            >
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>By {project.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {project.imageUrl && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                )}
                <p className="line-clamp-3">{project.description}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mr-2">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] w-full md:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl md:text-2xl">{project.title}</DialogTitle>
                      <DialogDescription className="text-sm md:text-base">By {project.author}</DialogDescription>
                    </DialogHeader>
                    {project.imageUrl && (
                      <div className="relative w-full h-48 md:h-64 my-4">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <p className="text-sm md:text-base">{project.description}</p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs md:text-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs md:text-sm text-gray-500 mt-2">
                      Submitted on:{" "}
                      {project.timestamp
                        ? (() => {
                            try {
                              const date = parse(
                                project.timestamp,
                                "dd/MM/yyyy HH:mm:ss",
                                new Date()
                              );
                              return isValid(date)
                                ? format(date, "PPPpp")
                                : "Invalid date";
                            } catch {
                              return "Invalid date";
                            }
                          })()
                        : "Date not available"}
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 mt-4">
                      <Button
                        onClick={() => openFeedbackForm(project)}
                        disabled={!project.feedbackFormUrl}
                        className="w-full md:w-auto"
                      >
                        Provide Feedback
                      </Button>
                      <Button
                        onClick={() => openGithubRepo(project)}
                        disabled={!project.githubRepoUrl}
                        className="w-full md:w-auto"
                      >
                        <Github className="mr-2 h-4 w-4" /> View on GitHub
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}