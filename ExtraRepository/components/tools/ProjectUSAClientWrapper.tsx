"use client";

export default function ProjectUSAClientWrapper() {
  const prospectId = '';
  const ProjectUSAClient = require('./ProjectUSAClient').default;
  return <ProjectUSAClient prospectId={prospectId} />;
}
